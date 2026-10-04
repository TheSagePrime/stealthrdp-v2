import { Buffer } from 'node:buffer';
import { createHash, createPublicKey, randomBytes, timingSafeEqual, verify as verifySignature } from 'node:crypto';

import { z } from 'zod';
import 'server-only';

export type OidcFailure
  = | 'malformed_token'
    | 'unsupported_algorithm'
    | 'unknown_key'
    | 'bad_signature'
    | 'wrong_issuer'
    | 'wrong_audience'
    | 'expired_token'
    | 'unusable_lifetime'
    | 'nonce_mismatch'
    | 'missing_subject';

export class OidcError extends Error {
  constructor(
    public code: OidcFailure,
    message: string,
  ) {
    super(message);
  }
}

/** RS256 only. WHMCS publishes `id_token_signing_alg_values_supported: ["RS256"]`. */
const ID_TOKEN_ALGORITHM = 'RS256';
const MAX_TOKEN_LENGTH = 8192;
const MAX_TOKEN_LIFETIME_SECONDS = 24 * 60 * 60;
const CLOCK_SKEW_SECONDS = 60;
const BASE64URL = /^[\w-]+$/;
const emailSchema = z.email();

export type RsaJwk = { kty: 'RSA'; kid: string; alg?: string; n: string; e: string };

export type VerifiedIdToken = {
  subject: string;
  email?: string;
  emailVerified: boolean;
  issuedAt: number;
  expiresAt: number;
};

export function createVerifier(): string {
  // 32 random bytes, base64url: 43 characters, inside the RFC 7636 range for S256.
  return randomBytes(32).toString('base64url');
}

export function challengeFor(verifier: string): string {
  return createHash('sha256').update(verifier, 'utf8').digest('base64url');
}

export function createRandomToken(bytes = 32): string {
  return randomBytes(bytes).toString('base64url');
}

function equalSecrets(left: string, right: string): boolean {
  const a = Buffer.from(left, 'utf8');
  const b = Buffer.from(right, 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}

function decodeSegment(segment: string): unknown {
  if (!BASE64URL.test(segment)) {
    throw new OidcError('malformed_token', 'The identity provider returned an unreadable token.');
  }
  try {
    return JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'));
  } catch {
    throw new OidcError('malformed_token', 'The identity provider returned an unreadable token.');
  }
}

/** Keeps only RSA keys with a key id. Anything else is ignored rather than trusted. */
export function parseJwkSet(body: unknown): RsaJwk[] {
  const keys = z
    .object({ keys: z.array(z.record(z.string(), z.unknown())).max(16) })
    .safeParse(body);
  if (!keys.success) {
    throw new OidcError('unknown_key', 'The identity provider returned no usable signing key.');
  }
  return keys.data.keys.flatMap((key) => {
    const kind = key.kty;
    const kid = key.kid;
    const n = key.n;
    const e = key.e;
    const alg = key.alg;
    if (kind !== 'RSA' || typeof kid !== 'string' || kid.length === 0 || kid.length > 256 || typeof n !== 'string' || typeof e !== 'string') {
      return [];
    }
    if (alg !== undefined && alg !== ID_TOKEN_ALGORITHM) {
      return [];
    }
    return [{ kty: 'RSA' as const, kid, alg: alg as string | undefined, n, e }];
  });
}

function signatureKey(keys: RsaJwk[], kid: string) {
  const candidates = keys.filter(key => key.kid === kid);
  if (candidates.length !== 1) {
    throw new OidcError('unknown_key', 'The identity provider token was signed with an unknown key.');
  }
  const { n, e } = candidates[0]!;
  try {
    return createPublicKey({ key: { kty: 'RSA', n, e }, format: 'jwk' });
  } catch {
    throw new OidcError('unknown_key', 'The identity provider returned an unusable signing key.');
  }
}

/**
 * Validates a signed RS256 ID token: algorithm, signature, issuer, audience, lifetime,
 * nonce and subject. Missing claims fail closed.
 */
export function verifyIdToken(input: {
  token: string;
  issuer: string;
  audience: string;
  nonce: string;
  keys: RsaJwk[];
  nowSeconds?: number;
}): VerifiedIdToken {
  const { token } = input;
  if (token.length === 0 || token.length > MAX_TOKEN_LENGTH) {
    throw new OidcError('malformed_token', 'The identity provider returned an unreadable token.');
  }
  const segments = token.split('.');
  if (segments.length !== 3) {
    throw new OidcError('malformed_token', 'The identity provider returned an unreadable token.');
  }
  const [headerSegment, payloadSegment, signatureSegment] = segments as [string, string, string];

  const header = z
    .object({ alg: z.string(), kid: z.string().min(1).max(256).optional(), crit: z.unknown().optional(), typ: z.unknown().optional() })
    .safeParse(decodeSegment(headerSegment));
  if (!header.success) {
    throw new OidcError('malformed_token', 'The identity provider returned an unreadable token.');
  }
  if (header.data.alg !== ID_TOKEN_ALGORITHM) {
    throw new OidcError('unsupported_algorithm', 'The identity provider used an unsupported signing algorithm.');
  }
  if (header.data.kid === undefined || header.data.crit !== undefined) {
    throw new OidcError('unsupported_algorithm', 'The identity provider used an unsupported token header.');
  }

  const publicKey = signatureKey(input.keys, header.data.kid);
  if (!BASE64URL.test(signatureSegment)) {
    throw new OidcError('malformed_token', 'The identity provider returned an unreadable token.');
  }
  const signed = Buffer.from(`${headerSegment}.${payloadSegment}`, 'utf8');
  const signature = Buffer.from(signatureSegment, 'base64url');
  if (signature.length === 0 || !verifySignature('RSA-SHA256', signed, publicKey, signature)) {
    throw new OidcError('bad_signature', 'The identity provider token signature is not valid.');
  }

  const claims = z
    .object({
      iss: z.string().max(300),
      aud: z.union([z.string().max(300), z.array(z.string().max(300)).max(8)]),
      sub: z.string().min(1).max(255),
      iat: z.number(),
      exp: z.number(),
      nonce: z.string().min(1).max(256).optional(),
      email: z.string().max(320).optional(),
      email_verified: z.boolean().optional(),
    })
    .safeParse(decodeSegment(payloadSegment));
  if (!claims.success) {
    throw new OidcError('malformed_token', 'The identity provider returned an unreadable token.');
  }

  const now = input.nowSeconds ?? Math.floor(Date.now() / 1000);
  const { iss, aud, sub, iat, exp, nonce } = claims.data;
  if (iss !== input.issuer) {
    throw new OidcError('wrong_issuer', 'The identity provider response came from an unexpected issuer.');
  }
  const audience = Array.isArray(aud) ? aud : [aud];
  if (!audience.includes(input.audience)) {
    throw new OidcError('wrong_audience', 'The identity provider response was issued for another client.');
  }
  if (!Number.isFinite(iat) || !Number.isFinite(exp) || iat > now + CLOCK_SKEW_SECONDS || exp <= now - CLOCK_SKEW_SECONDS) {
    throw new OidcError('expired_token', 'The identity provider token is not valid now.');
  }
  if (exp - iat > MAX_TOKEN_LIFETIME_SECONDS) {
    throw new OidcError('unusable_lifetime', 'The identity provider token lifetime is not acceptable.');
  }
  /*
   * The nonce binds this token to the sign-in transaction this browser started. WHMCS
   * does not list `nonce` in `claims_supported`, so a missing nonce fails closed here and
   * shows up in the live test gate instead of silently downgrading replay protection.
   */
  if (nonce === undefined || !equalSecrets(nonce, input.nonce)) {
    throw new OidcError('nonce_mismatch', 'The identity provider response does not match this sign-in attempt.');
  }
  if (sub.length === 0) {
    throw new OidcError('missing_subject', 'The identity provider did not identify the account.');
  }

  const email = claims.data.email !== undefined && emailSchema.safeParse(claims.data.email).success ? claims.data.email : undefined;

  return {
    subject: sub,
    email,
    emailVerified: claims.data.email_verified === true,
    issuedAt: iat,
    expiresAt: exp,
  };
}
