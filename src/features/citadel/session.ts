import { Buffer } from 'node:buffer';
import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from 'node:crypto';

import { z } from 'zod';
import 'server-only';

export const SESSION_COOKIE = '__Host-citadel-session';
const LIFETIME_SECONDS = 15 * 60;
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

function encryptionKey(): Buffer {
  const secret = process.env.SESSION_SECRET;
  if (!secret || !/^[A-Z0-9+/]{43}=$/i.test(secret)) {
    throw new Error('SESSION_SECRET must be a base64-encoded 32-byte random key');
  }
  const decoded = Buffer.from(secret, 'base64');
  if (decoded.length !== 32) {
    throw new Error('Invalid session configuration');
  }
  return Buffer.from(hkdfSync('sha256', decoded, 'citadel-session-v1', SESSION_COOKIE, 32));
}

/** Server integration seam for the future verified WHMCS OIDC callback. No HTTP issuer exists. */
export function sealSession(identity: { bearer: string; email: string; subject: string; expiresAt: number }): {
  value: string;
  maxAge: number;
} {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = Math.min(identity.expiresAt, now + LIFETIME_SECONDS);
  if (expiresAt <= now) {
    throw new Error('Expired Citadel session');
  }
  const session = sessionSchema.parse({
    ...identity,
    version: 1,
    csrf: randomBytes(32).toString('hex'),
    issuedAt: now,
    expiresAt,
  });
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv);
  cipher.setAAD(Buffer.from(SESSION_COOKIE));
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(session), 'utf8'), cipher.final()]);
  const value = Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url');
  if (value.length > 3800) {
    throw new Error('Citadel session exceeds cookie size limit');
  }
  return { value, maxAge: expiresAt - now };
}

export function openSession(value: string | undefined): CitadelSession | null {
  if (!value || value.length > 3800 || !/^[\w-]+$/.test(value)) {
    return null;
  }
  try {
    const packed = Buffer.from(value, 'base64url');
    if (packed.length < 29) {
      return null;
    }
    const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), packed.subarray(0, 12));
    decipher.setAAD(Buffer.from(SESSION_COOKIE));
    decipher.setAuthTag(packed.subarray(12, 28));
    const plaintext = Buffer.concat([decipher.update(packed.subarray(28)), decipher.final()]);
    const session = sessionSchema.parse(JSON.parse(plaintext.toString('utf8')));
    const now = Math.floor(Date.now() / 1000);
    if (session.issuedAt > now || session.expiresAt <= now || session.expiresAt - session.issuedAt > LIFETIME_SECONDS) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function sessionCookie(value: string, maxAge: number): string {
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}
