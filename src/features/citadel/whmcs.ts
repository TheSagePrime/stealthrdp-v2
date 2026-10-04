import type { RsaJwk } from './oidc';

import { Buffer } from 'node:buffer';
import { z } from 'zod';
import { resolveSiteUrl } from '@/libs/seo/site-url';
import { parseJwkSet } from './oidc';
import 'server-only';

/** Exactly the redirect URI registered with WHMCS for this deployment. */
const CITADEL_CALLBACK_PATH = '/api/citadel/auth/callback';
const MAX_RESPONSE_BYTES = 64 * 1024;
const REQUEST_TIMEOUT_MS = 8000;
const JWKS_CACHE_MS = 5 * 60 * 1000;
const DEFAULT_ISSUER = 'https://dash.stealthrdp.com';
const OAUTH_ERROR = z.object({ error: z.string().regex(/^[a-z_]{1,40}$/) });

export type WhmcsProvider = {
  issuer: string;
  clientId: string;
  clientSecret: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  jwksUri: string;
  userinfoEndpoint: string;
};

export class ProviderError extends Error {
  constructor(
    public code: 'unreachable' | 'rejected' | 'invalid_response',
    message: string,
    public providerError?: string,
  ) {
    super(message);
  }
}

function httpsOrigin(value: string, label: string): string {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new ProviderError('invalid_response', `${label} is not a valid URL.`);
  }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || (url.pathname !== '/' && url.pathname !== '')) {
    throw new ProviderError('invalid_response', `${label} must be an HTTPS origin without a path.`);
  }
  return url.origin;
}

function endpoint(value: string | undefined, issuer: string, fallbackPath: string): string {
  if (value === undefined || value.trim() === '') {
    return `${issuer}${fallbackPath}`;
  }
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new ProviderError('invalid_response', 'The WHMCS endpoint configuration is invalid.');
  }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) {
    throw new ProviderError('invalid_response', 'The WHMCS endpoint configuration is invalid.');
  }
  return url.toString();
}

/** Reads the WHMCS OpenID Connect provider from server environment variables only. */
export function whmcsProvider(): WhmcsProvider | null {
  const clientId = (process.env.WHMCS_OIDC_CLIENT_ID ?? '').trim();
  const clientSecret = (process.env.WHMCS_OIDC_CLIENT_SECRET ?? '').trim();
  if (clientId === '' || clientSecret === '') {
    return null;
  }
  const issuer = httpsOrigin(process.env.WHMCS_OIDC_ISSUER || DEFAULT_ISSUER, 'WHMCS_OIDC_ISSUER');
  return {
    issuer,
    clientId,
    clientSecret,
    authorizationEndpoint: endpoint(process.env.WHMCS_OIDC_AUTHORIZATION_ENDPOINT, issuer, '/oauth/authorize.php'),
    tokenEndpoint: endpoint(process.env.WHMCS_OIDC_TOKEN_ENDPOINT, issuer, '/oauth/token.php'),
    jwksUri: endpoint(process.env.WHMCS_OIDC_JWKS_URI, issuer, '/oauth/certs.php'),
    userinfoEndpoint: endpoint(process.env.WHMCS_OIDC_USERINFO_ENDPOINT, issuer, '/oauth/userinfo.php'),
  };
}

/** The absolute redirect URI sent to WHMCS. It must match the URI registered there byte for byte. */
export function loginRedirectUri(): string {
  const configured = (process.env.CITADEL_LOGIN_REDIRECT_URI ?? '').trim();
  const value = configured === '' ? `${resolveSiteUrl().origin}${CITADEL_CALLBACK_PATH}` : configured;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new ProviderError('invalid_response', 'The login redirect URI is not valid.');
  }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== CITADEL_CALLBACK_PATH) {
    throw new ProviderError('invalid_response', 'The login redirect URI must be this deployment\u2019s HTTPS callback.');
  }
  return url.toString();
}

export function buildAuthorizeUrl(
  provider: WhmcsProvider,
  input: { redirectUri: string; state: string; nonce: string; challenge: string },
): string {
  const url = new URL(provider.authorizationEndpoint);
  url.search = new URLSearchParams({
    response_type: 'code',
    client_id: provider.clientId,
    redirect_uri: input.redirectUri,
    scope: 'openid profile email',
    state: input.state,
    nonce: input.nonce,
    code_challenge: input.challenge,
    code_challenge_method: 'S256',
  }).toString();
  return url.toString();
}

async function readBounded(response: Response): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new ProviderError('invalid_response', 'The identity provider returned no response body.');
  }
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      size += value.length;
      if (size > MAX_RESPONSE_BYTES) {
        await reader.cancel();
        throw new ProviderError('invalid_response', 'The identity provider response was too large.');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function providerFetch(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, {
      ...init,
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof ProviderError) {
      throw error;
    }
    throw new ProviderError('unreachable', 'The StealthRDP account service is temporarily unavailable.');
  }
}

function providerErrorCode(body: string): string | undefined {
  try {
    return OAUTH_ERROR.safeParse(JSON.parse(body)).data?.error;
  } catch {
    return undefined;
  }
}

/**
 * Exchanges the one-time authorization code. The client secret and the PKCE verifier
 * stay on this server and are never written to a response, a log or the browser.
 */
export async function exchangeAuthorizationCode(
  provider: WhmcsProvider,
  input: { code: string; redirectUri: string; verifier: string },
): Promise<{ idToken: string; accessToken: string | null }> {
  const response = await providerFetch(provider.tokenEndpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', 'accept': 'application/json' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: input.code,
      client_id: provider.clientId,
      client_secret: provider.clientSecret,
      redirect_uri: input.redirectUri,
      code_verifier: input.verifier,
    }).toString(),
  });
  const body = await readBounded(response);
  if (!response.ok) {
    throw new ProviderError('rejected', 'The StealthRDP account service rejected the sign-in attempt.', providerErrorCode(body));
  }
  const parsed = z
    .object({ id_token: z.string().min(1).max(8192), access_token: z.string().min(1).max(4096).optional() })
    .safeParse((() => {
      try {
        return JSON.parse(body);
      } catch {
        return null;
      }
    })());
  if (!parsed.success) {
    throw new ProviderError('invalid_response', 'The StealthRDP account service returned an unusable response.');
  }
  return { idToken: parsed.data.id_token, accessToken: parsed.data.access_token ?? null };
}

/** Reads the profile claims the ID token does not carry (WHMCS has no email claim). */
export async function fetchUserInfo(
  provider: WhmcsProvider,
  accessToken: string,
): Promise<{ subject: string; email?: string; emailVerified: boolean } | null> {
  const response = await providerFetch(provider.userinfoEndpoint, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}`, accept: 'application/json' },
  });
  const body = await readBounded(response);
  if (!response.ok) {
    return null;
  }
  const parsed = z
    .object({
      sub: z.string().min(1).max(255),
      email: z.string().max(320).optional(),
      email_verified: z.boolean().optional(),
    })
    .safeParse((() => {
      try {
        return JSON.parse(body);
      } catch {
        return null;
      }
    })());
  if (!parsed.success) {
    return null;
  }
  return { subject: parsed.data.sub, email: parsed.data.email, emailVerified: parsed.data.email_verified === true };
}

const keyCache = new Map<string, { keys: RsaJwk[]; expiresAt: number }>();

export function resetSigningKeyCache(): void {
  keyCache.clear();
}

/** Fetches the RS256 signing keys, cached briefly and refreshed once when a key id is unknown. */
export async function fetchSigningKeys(provider: WhmcsProvider, refresh = false): Promise<RsaJwk[]> {
  const cached = keyCache.get(provider.jwksUri);
  if (!refresh && cached && cached.expiresAt > Date.now()) {
    return cached.keys;
  }
  const response = await providerFetch(provider.jwksUri, { method: 'GET', headers: { accept: 'application/json' } });
  const body = await readBounded(response);
  if (!response.ok) {
    throw new ProviderError('invalid_response', 'The StealthRDP account service returned no signing keys.');
  }
  let keys: RsaJwk[];
  try {
    keys = parseJwkSet(JSON.parse(body));
  } catch {
    throw new ProviderError('invalid_response', 'The StealthRDP account service returned no usable signing keys.');
  }
  if (keys.length === 0) {
    throw new ProviderError('invalid_response', 'The StealthRDP account service returned no usable signing keys.');
  }
  keyCache.set(provider.jwksUri, { keys, expiresAt: Date.now() + JWKS_CACHE_MS });
  return keys;
}
