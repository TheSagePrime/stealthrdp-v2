import { Buffer } from 'node:buffer';
import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from 'node:crypto';

import { z } from 'zod';
import 'server-only';

export const SESSION_COOKIE = '__Host-citadel-session';
export const LOGIN_COOKIE = '__Host-citadel-login';
const LIFETIME_SECONDS = 15 * 60;
/** A sign-in transaction only has to survive one round trip through the identity provider. */
export const LOGIN_LIFETIME_SECONDS = 10 * 60;
const MAX_SEALED_LENGTH = 3800;
const MIN_PACKED_LENGTH = 29;

const sessionSchema = z
  .object({
    version: z.literal(1),
    bearer: z.string().min(1).max(2048),
    email: z.email(),
    subject: z.uuid(),
    csrf: z.string().regex(/^[a-f0-9]{64}$/),
    issuedAt: z.number().int(),
    expiresAt: z.number().int(),
  })
  .strict();

export type CitadelSession = z.infer<typeof sessionSchema>;

type SealedPayload = { issuedAt: number; expiresAt: number };

type EnvelopeOptions<T extends SealedPayload> = {
  cookie: string;
  purpose: string;
  schema: z.ZodType<T>;
  lifetimeSeconds: number;
};

function masterKey(): Buffer {
  const secret = process.env.SESSION_SECRET;
  if (!secret || !/^[A-Z0-9+/]{43}=$/i.test(secret)) {
    throw new Error('SESSION_SECRET must be a base64-encoded 32-byte random key');
  }
  const decoded = Buffer.from(secret, 'base64');
  if (decoded.length !== 32) {
    throw new Error('Invalid session configuration');
  }
  return decoded;
}

/* One key per purpose and cookie name, so a sealed value can only be opened as what it is. */
function derivedKey(purpose: string, cookie: string): Buffer {
  return Buffer.from(hkdfSync('sha256', masterKey(), purpose, cookie, 32));
}

/** Seals a bounded JSON payload with AES-256-GCM. The cookie name is the authenticated data. */
export function sealEnvelope<T extends SealedPayload>(options: EnvelopeOptions<T>, payload: T): { value: string; maxAge: number } {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = Math.min(payload.expiresAt, now + options.lifetimeSeconds);
  if (expiresAt <= now) {
    throw new Error('Expired Citadel session');
  }
  const sealed = options.schema.parse({ ...payload, issuedAt: now, expiresAt });
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', derivedKey(options.purpose, options.cookie), iv);
  cipher.setAAD(Buffer.from(options.cookie));
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(sealed), 'utf8'), cipher.final()]);
  const value = Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url');
  if (value.length > MAX_SEALED_LENGTH) {
    throw new Error('Citadel session exceeds cookie size limit');
  }
  return { value, maxAge: expiresAt - now };
}

/** Opens a sealed payload. Tampering, truncation, expiry and a rotated secret all return null. */
export function openEnvelope<T extends SealedPayload>(options: EnvelopeOptions<T>, value: string | undefined): T | null {
  if (!value || value.length > MAX_SEALED_LENGTH || !/^[\w-]+$/.test(value)) {
    return null;
  }
  try {
    const packed = Buffer.from(value, 'base64url');
    if (packed.length < MIN_PACKED_LENGTH) {
      return null;
    }
    const decipher = createDecipheriv('aes-256-gcm', derivedKey(options.purpose, options.cookie), packed.subarray(0, 12));
    decipher.setAAD(Buffer.from(options.cookie));
    decipher.setAuthTag(packed.subarray(12, 28));
    const plaintext = Buffer.concat([decipher.update(packed.subarray(28)), decipher.final()]);
    const payload = options.schema.parse(JSON.parse(plaintext.toString('utf8')));
    const now = Math.floor(Date.now() / 1000);
    if (payload.issuedAt > now || payload.expiresAt <= now || payload.expiresAt - payload.issuedAt > options.lifetimeSeconds) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

const SESSION_ENVELOPE: EnvelopeOptions<CitadelSession> = {
  cookie: SESSION_COOKIE,
  purpose: 'citadel-session-v1',
  schema: sessionSchema,
  lifetimeSeconds: LIFETIME_SECONDS,
};

/**
 * The only way a Citadel customer credential enters a browser cookie. The verified
 * WHMCS OIDC callback in `login.ts` is the only caller.
 */
export function sealSession(identity: { bearer: string; email: string; subject: string; expiresAt: number }): {
  value: string;
  maxAge: number;
} {
  const now = Math.floor(Date.now() / 1000);
  return sealEnvelope(SESSION_ENVELOPE, {
    ...identity,
    version: 1,
    csrf: randomBytes(32).toString('hex'),
    issuedAt: now,
    expiresAt: Math.min(identity.expiresAt, now + LIFETIME_SECONDS),
  });
}

export function openSession(value: string | undefined): CitadelSession | null {
  return openEnvelope(SESSION_ENVELOPE, value);
}

function cookieHeader(name: string, value: string, maxAge: number): string {
  return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

export function sessionCookie(value: string, maxAge: number): string {
  return cookieHeader(SESSION_COOKIE, value, maxAge);
}

export function loginCookie(value: string, maxAge: number): string {
  return cookieHeader(LOGIN_COOKIE, value, maxAge);
}
