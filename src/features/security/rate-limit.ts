type RateLimitEntry = {
  count: number;
  resetAt: number;
};

declare global {
  // eslint-disable-next-line vars-on-top
  var sagePrimeRateLimits: Map<string, RateLimitEntry> | undefined;
}

const buckets = globalThis.sagePrimeRateLimits ?? new Map<string, RateLimitEntry>();

if (!globalThis.sagePrimeRateLimits) {
  globalThis.sagePrimeRateLimits = buckets;
}

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export function consumeRateLimit(
  key: string,
  options: { limit?: number; windowMs?: number } = {},
): RateLimitResult {
  const limit = options.limit ?? 8;
  const windowMs = options.windowMs ?? 60_000;
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
