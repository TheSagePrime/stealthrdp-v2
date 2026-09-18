import 'server-only';

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

declare global {
  // eslint-disable-next-line vars-on-top
  var sagePrimeRateLimits: Map<string, RateLimitEntry> | undefined;
}

const buckets
  = globalThis.sagePrimeRateLimits ?? new Map<string, RateLimitEntry>();
const MAX_BUCKETS = 10_000;

if (!globalThis.sagePrimeRateLimits) {
  globalThis.sagePrimeRateLimits = buckets;
}

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

function pruneBuckets(now: number): void {
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) {
      buckets.delete(key);
    }
  }

  while (buckets.size >= MAX_BUCKETS) {
    const oldest = buckets.keys().next().value;
    if (typeof oldest !== 'string') {
      break;
    }
    buckets.delete(oldest);
  }
}

export function consumeRateLimit(
  key: string,
  options: { limit?: number; windowMs?: number } = {},
): RateLimitResult {
  const limit = options.limit ?? 8;
  const windowMs = options.windowMs ?? 60_000;
  const now = Date.now();
  pruneBuckets(now);
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((current.resetAt - now) / 1000),
      ),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
