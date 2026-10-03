import { Buffer } from 'node:buffer';
import { randomBytes } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { openSession, sealSession, sessionCookie } from './session';

const identity = {
  bearer: 'test-session-credential',
  email: 'customer@example.invalid',
  subject: '11111111-1111-4111-8111-111111111111',
  expiresAt: 0,
};

beforeEach(() => {
  vi.stubEnv('SESSION_SECRET', randomBytes(32).toString('base64'));
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-02T20:00:00Z'));
  identity.expiresAt = Math.floor(Date.now() / 1000) + 3600;
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe('Citadel encrypted session', () => {
  it('encrypts identity and credential, caps lifetime, and uses a fresh IV and CSRF value', () => {
    const first = sealSession(identity);
    const second = sealSession(identity);

    expect(first.maxAge).toBe(900);
    expect(first.value).not.toBe(second.value);

    const decoded = Buffer.from(first.value, 'base64url').toString('utf8');

    expect(decoded).not.toContain(identity.bearer);
    expect(decoded).not.toContain(identity.email);
    expect(openSession(first.value)?.bearer).toBe(identity.bearer);
    expect(openSession(first.value)?.csrf).not.toBe(openSession(second.value)?.csrf);
  });

  it('expires without sliding renewal and respects the upstream expiration', () => {
    const short = sealSession({ ...identity, expiresAt: Math.floor(Date.now() / 1000) + 30 });

    expect(short.maxAge).toBe(30);

    vi.advanceTimersByTime(30_000);

    expect(openSession(short.value)).toBeNull();
    expect(() => sealSession({ ...identity, expiresAt: 1 })).toThrow();
  });

  it('rejects tampering, truncation, malformed cookies and a rotated secret', () => {
    const { value } = sealSession(identity);
    const bytes = Buffer.from(value, 'base64url');
    bytes[30] = bytes[30]! ^ 1;

    expect(openSession(bytes.toString('base64url'))).toBeNull();
    expect(openSession(value.slice(0, 40))).toBeNull();
    expect(openSession('untrusted.%value')).toBeNull();
    expect(openSession('a'.repeat(3801))).toBeNull();

    vi.stubEnv('SESSION_SECRET', randomBytes(32).toString('base64'));

    expect(openSession(value)).toBeNull();
  });

  it('refuses missing or weak encryption configuration', () => {
    vi.stubEnv('SESSION_SECRET', 'short');

    expect(() => sealSession(identity)).toThrow();
    expect(openSession('abc')).toBeNull();
  });

  it('sets every required cookie flag and clears the same host-only cookie', () => {
    const cookie = sessionCookie('encrypted-value', 900);
    for (const flag of ['__Host-citadel-session=', 'Path=/', 'HttpOnly', 'Secure', 'SameSite=Lax', 'Max-Age=900']) {
      expect(cookie).toContain(flag);
    }

    expect(cookie).not.toContain('Domain=');
    expect(sessionCookie('', 0)).toContain('Max-Age=0');
  });
});
