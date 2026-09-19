import 'server-only';
import { createHash } from 'node:crypto';

type ReplayEntry = {
  expiresAt: number;
};

declare global {
  // eslint-disable-next-line vars-on-top
  var sagePrimeWebhookReplayCache: Map<string, ReplayEntry> | undefined;
}

const replayCache = globalThis.sagePrimeWebhookReplayCache ?? new Map<string, ReplayEntry>();
const MAX_REPLAY_ENTRIES = 10_000;

if (!globalThis.sagePrimeWebhookReplayCache) {
  globalThis.sagePrimeWebhookReplayCache = replayCache;
}

function canonicalize(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entryValue]) => `${JSON.stringify(key)}:${canonicalize(entryValue)}`);
    return `{${entries.join(',')}}`;
  }

  return JSON.stringify(value) ?? 'null';
}

function fingerprint(payload: unknown): string {
  return createHash('sha256').update(canonicalize(payload)).digest('hex');
}

export async function withPolarWebhookReplayGuard(payload: unknown, handler: () => Promise<void>): Promise<boolean> {
  const now = Date.now();
  const key = fingerprint(payload);

  for (const [cachedKey, entry] of replayCache) {
    if (entry.expiresAt <= now) {
      replayCache.delete(cachedKey);
    }
  }

  if (replayCache.has(key)) {
    return false;
  }

  while (replayCache.size >= MAX_REPLAY_ENTRIES) {
    const oldest = replayCache.keys().next().value;
    if (typeof oldest !== 'string') {
      break;
    }
    replayCache.delete(oldest);
  }

  replayCache.set(key, { expiresAt: now + 24 * 60 * 60 * 1000 });

  try {
    await handler();
    return true;
  } catch (error) {
    replayCache.delete(key);
    throw error;
  }
}
