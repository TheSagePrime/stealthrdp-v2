import { describe, expect, it } from 'vitest';
import { consumeRateLimit } from './rate-limit';

describe('consumeRateLimit', () => {
  it('blocks after the configured limit', () => {
    const key = 'security-rate-limit-unit-test';

    expect(consumeRateLimit(key, { limit: 2, windowMs: 60_000 }).allowed).toBe(true);
    expect(consumeRateLimit(key, { limit: 2, windowMs: 60_000 }).allowed).toBe(true);

    const blocked = consumeRateLimit(key, { limit: 2, windowMs: 60_000 });
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });
});
