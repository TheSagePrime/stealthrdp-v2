import { Buffer } from 'node:buffer';
import { createHash, timingSafeEqual } from 'node:crypto';

import { z } from 'zod';
import { consumeRateLimit } from '@/features/security/rate-limit';
import { citadelPrincipalSchema } from './http';
import { challengeFor, createRandomToken, createVerifier, OidcError, verifyIdToken } from './oidc';
import { LOGIN_COOKIE, LOGIN_LIFETIME_SECONDS, loginCookie, openEnvelope, sealEnvelope } from './session';
import { CitadelError, citadelRequest, mintUserCredential, revokeCredential } from './upstream';
import { buildAuthorizeUrl, exchangeAuthorizationCode, fetchSigningKeys, fetchUserInfo, loginRedirectUri, ProviderError, whmcsProvider } from './whmcs';
import 'server-only';

/** Public failure codes. They are safe to show in a URL and never carry provider detail. */
export type LoginFailure
  = | 'unconfigured'
    | 'unavailable'
    | 'invalid_request'
    | 'denied'
    | 'expired'
    | 'state'
    | 'provider'
    | 'nonce'
    | 'email_unverified'
    | 'identity';

export class LoginError extends Error {
  constructor(
    public code: LoginFailure,
    public status: number,
  ) {
    super(`Citadel sign-in failed: ${code}`);
  }
}

const transactionSchema = z
  .object({
    version: z.literal(1),
    state: z.string().regex(/^[\w-]{32,128}$/),
    nonce: z.string().regex(/^[\w-]{32,128}$/),
    verifier: z.string().regex(/^[\w-]{43,128}$/),
    issuedAt: z.number().int(),
    expiresAt: z.number().int(),
  })
  .strict();

type LoginTransaction = z.infer<typeof transactionSchema>;

const LOGIN_ENVELOPE = {
  cookie: LOGIN_COOKIE,
  purpose: 'citadel-login-v1',
  schema: transactionSchema as z.ZodType<LoginTransaction>,
  lifetimeSeconds: LOGIN_LIFETIME_SECONDS,
};

const emailSchema = z.email();

function equalSecrets(left: string, right: string): boolean {
  const a = Buffer.from(left, 'utf8');
  const b = Buffer.from(right, 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}

function cookieValue(header: string, name: string): string | undefined {
  return header
    ?.split(';')
    .map(part => part.trim())
    .find(part => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function mapProviderError(error: unknown): LoginError {
  if (error instanceof ProviderError) {
    if (error.code === 'rejected') {
      return new LoginError('provider', 400);
    }
    if (error.code === 'unreachable') {
      return new LoginError('unavailable', 502);
    }
  }
  return new LoginError('provider', 502);
}

function mapTokenError(error: unknown): LoginError {
  if (error instanceof OidcError) {
    // A missing or mismatched nonce means the provider did not bind the token to this attempt.
    return error.code === 'nonce_mismatch' ? new LoginError('nonce', 400) : new LoginError('provider', 400);
  }
  return new LoginError('provider', 502);
}

/**
 * Starts a WHMCS OpenID Connect authorization-code + PKCE (S256) sign-in. The state,
 * nonce and verifier are sealed into one host-only, ten-minute transaction cookie.
 */
export function beginLogin(): { location: string; cookie: string } {
  const provider = whmcsProvider();
  if (!provider) {
    throw new LoginError('unconfigured', 503);
  }
  let redirectUri: string;
  try {
    redirectUri = loginRedirectUri();
  } catch {
    throw new LoginError('unconfigured', 503);
  }
  const state = createRandomToken();
  const nonce = createRandomToken();
  const verifier = createVerifier();
  const now = Math.floor(Date.now() / 1000);
  let sealed: { value: string; maxAge: number };
  try {
    sealed = sealEnvelope(LOGIN_ENVELOPE, {
      version: 1,
      state,
      nonce,
      verifier,
      issuedAt: now,
      expiresAt: now + LOGIN_LIFETIME_SECONDS,
    });
  } catch {
    // A missing or invalid SESSION_SECRET is an operator configuration error, not a user error.
    throw new LoginError('unconfigured', 503);
  }
  return {
    location: buildAuthorizeUrl(provider, { redirectUri, state, nonce, challenge: challengeFor(verifier) }),
    cookie: loginCookie(sealed.value, sealed.maxAge),
  };
}

/**
 * Completes the callback: state and nonce are matched against the transaction cookie,
 * the signed ID token is verified, the email is verified, and only then does the
 * server mint a user-scoped Citadel credential and verify it with `/api/v1/auth/me`.
 */
export async function completeLogin(
  params: URLSearchParams,
  cookieHeader: string,
): Promise<{ bearer: string; email: string; subject: string; expiresAt: number }> {
  const provider = whmcsProvider();
  if (!provider) {
    throw new LoginError('unconfigured', 503);
  }
  if (params.has('error')) {
    throw new LoginError('denied', 400);
  }
  const code = params.get('code');
  const state = params.get('state');
  if (!code || code.length > 4096 || !state || state.length > 128) {
    throw new LoginError('invalid_request', 400);
  }
  const transaction = openEnvelope(LOGIN_ENVELOPE, cookieValue(cookieHeader, LOGIN_COOKIE));
  if (!transaction) {
    // No transaction for this browser: either it expired or this callback is a replay.
    throw new LoginError('expired', 400);
  }
  if (!equalSecrets(state, transaction.state)) {
    throw new LoginError('state', 400);
  }
  /*
   * One state, one sign-in. The sealed transaction cookie is cleared by the route, and
   * this bounded single-use bucket also refuses a replay that still presents the cookie.
   */
  const stateKey = createHash('sha256').update(transaction.state).digest('hex');
  if (!consumeRateLimit(`citadel:auth:txn:${stateKey}`, { limit: 1, windowMs: LOGIN_LIFETIME_SECONDS * 1000 }).allowed) {
    throw new LoginError('expired', 400);
  }

  let redirectUri: string;
  try {
    redirectUri = loginRedirectUri();
  } catch {
    throw new LoginError('unconfigured', 503);
  }

  let exchanged: { idToken: string; accessToken: string | null };
  try {
    exchanged = await exchangeAuthorizationCode(provider, { code, redirectUri, verifier: transaction.verifier });
  } catch (error) {
    throw mapProviderError(error);
  }

  let verified;
  try {
    const keys = await fetchSigningKeys(provider);
    verified = verifyIdToken({
      token: exchanged.idToken,
      issuer: provider.issuer,
      audience: provider.clientId,
      nonce: transaction.nonce,
      keys,
    });
  } catch (error) {
    if (error instanceof OidcError && error.code === 'unknown_key') {
      try {
        const rotated = await fetchSigningKeys(provider, true);
        verified = verifyIdToken({
          token: exchanged.idToken,
          issuer: provider.issuer,
          audience: provider.clientId,
          nonce: transaction.nonce,
          keys: rotated,
        });
      } catch (retryError) {
        throw mapTokenError(retryError);
      }
    } else {
      throw mapTokenError(error);
    }
  }

  /*
   * WHMCS ID tokens carry no email claim, so the verified address comes from the
   * userinfo endpoint and must belong to the same subject. Both paths require
   * `email_verified`, and a token that merely asserts an unverified address fails.
   */
  let email = verified.emailVerified ? verified.email : undefined;
  if (email === undefined && exchanged.accessToken !== null) {
    let info: { subject: string; email?: string | undefined; emailVerified: boolean } | null;
    try {
      info = await fetchUserInfo(provider, exchanged.accessToken);
    } catch (error) {
      throw mapProviderError(error);
    }
    if (info && info.subject === verified.subject && info.emailVerified && info.email !== undefined && emailSchema.safeParse(info.email).success) {
      email = info.email;
    }
  }
  if (email === undefined || !emailSchema.safeParse(email).success) {
    throw new LoginError('email_unverified', 403);
  }
  const verifiedEmail = email;

  let minted: { bearer: string; expiresAt: number };
  try {
    minted = await mintUserCredential(verifiedEmail);
  } catch (error) {
    throw error instanceof CitadelError && error.status === 503 ? new LoginError('unconfigured', 503) : new LoginError('unavailable', 502);
  }

  try {
    const parsed = citadelPrincipalSchema.safeParse(await citadelRequest(minted.bearer, '/api/v1/auth/me'));
    if (!parsed.success) {
      throw new LoginError('identity', 403);
    }
    const principal = parsed.data.user;
    if (principal.email.toLowerCase() !== verifiedEmail.toLowerCase()) {
      throw new LoginError('identity', 403);
    }
    return { bearer: minted.bearer, email: principal.email, subject: principal.id, expiresAt: minted.expiresAt };
  } catch (error) {
    // A credential that failed verification must not survive the attempt.
    await revokeCredential(minted.bearer);
    if (error instanceof LoginError) {
      throw error;
    }
    throw new LoginError('unavailable', 502);
  }
}
