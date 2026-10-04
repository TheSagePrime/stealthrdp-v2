import { Buffer } from 'node:buffer';
import { resolveDeployEnv } from '@/libs/seo/env';

import 'server-only';

export class CitadelError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

function apiOrigin(): string {
  const environment = resolveDeployEnv();
  const configured = process.env.CITADEL_API_BASE_URL;
  // Only production may contact the production Citadel service. Preview has no fallback.
  if (environment !== 'production' && !configured) {
    throw new CitadelError(503, 'Citadel is not configured for this environment.');
  }
  const url = new URL(configured || 'https://citadel.stealthrdp.com');
  if (
    url.protocol !== 'https:'
    || url.username
    || url.password
    || url.pathname !== '/'
    || url.search
    || url.hash
    || (environment !== 'production' && url.hostname.replace(/\.$/, '') === 'citadel.stealthrdp.com')
  ) {
    throw new CitadelError(503, 'Invalid Citadel environment configuration.');
  }
  return url.origin;
}

const PLATFORM_KEY_MIN_LENGTH = 16;
const PLATFORM_KEY_RESPONSE_LIMIT = 64 * 1024;
const PLATFORM_TOKEN_PATH = '/api/admin/platform/access-token';

async function readBounded(response: Response): Promise<Uint8Array[]> {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new CitadelError(502, 'Citadel returned an invalid response.');
  }
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      size += value.length;
      if (size > PLATFORM_KEY_RESPONSE_LIMIT) {
        await reader.cancel();
        throw new CitadelError(502, 'Citadel returned an invalid response.');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return chunks;
}

function platformKey(): string {
  const key = (process.env.CITADEL_PLATFORM_API_KEY ?? '').trim();
  const environment = resolveDeployEnv();
  if (key.length < PLATFORM_KEY_MIN_LENGTH) {
    throw new CitadelError(503, 'Citadel sign-in is not configured for this environment.');
  }
  /*
   * The platform key is fleet-wide. Outside production a separate staging key must be
   * installed AND explicitly allowed, so a production key in preview fails closed.
   */
  if (environment !== 'production' && process.env.CITADEL_PLATFORM_KEY_ALLOW_NON_PRODUCTION !== 'true') {
    throw new CitadelError(503, 'Citadel sign-in is not configured for this environment.');
  }
  return key;
}

function credentialExpiry(body: { expires_at?: unknown; expires_in?: unknown }, now: number): number {
  const expiresAt = body.expires_at;
  if (typeof expiresAt === 'string') {
    const parsed = Date.parse(expiresAt);
    if (Number.isFinite(parsed)) {
      return Math.floor(parsed / 1000);
    }
  }
  const expiresIn = body.expires_in;
  if (typeof expiresIn === 'number' && Number.isFinite(expiresIn) && expiresIn > 0) {
    return now + Math.floor(expiresIn);
  }
  // Never assume an indefinite credential lifetime.
  throw new CitadelError(502, 'Citadel did not return a usable credential.');
}

/**
 * Operator-only bridge from a verified WHMCS identity to a user-scoped Citadel
 * credential. The platform key never leaves this server and is never returned to a caller.
 */
export async function mintUserCredential(email: string): Promise<{ bearer: string; expiresAt: number }> {
  const key = platformKey();
  let response: Response;
  try {
    response = await fetch(`${apiOrigin()}${PLATFORM_TOKEN_PATH}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(8000),
    });
  } catch (error) {
    if (error instanceof CitadelError) {
      throw error;
    }
    throw new CitadelError(502, 'Citadel is temporarily unavailable.');
  }
  if (!response.ok) {
    throw new CitadelError(502, 'Citadel could not complete the sign-in.');
  }
  const chunks = await readBounded(response);
  let body: { access_token?: unknown; expires_at?: unknown; expires_in?: unknown };
  try {
    body = JSON.parse(Buffer.concat(chunks).toString('utf8')) as typeof body;
  } catch {
    throw new CitadelError(502, 'Citadel did not return a usable credential.');
  }
  const bearer = body.access_token;
  if (typeof bearer !== 'string' || bearer.length < 8 || bearer.length > 4096) {
    throw new CitadelError(502, 'Citadel did not return a usable credential.');
  }
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = credentialExpiry(body, now);
  if (expiresAt <= now + 5) {
    throw new CitadelError(502, 'Citadel did not return a usable credential.');
  }
  return { bearer, expiresAt };
}

/** Best-effort revocation of a freshly minted credential when sign-in cannot be completed. */
export async function revokeCredential(bearer: string): Promise<void> {
  try {
    await citadelRequest(bearer, '/api/v1/auth/logout', 'POST');
  } catch {
    // The credential expires on its own; local cleanup must never depend on this call.
  }
}

export async function citadelRequest(bearer: string, path: string, method = 'GET', body?: unknown, query?: URLSearchParams): Promise<unknown> {
  if (!/^\/api\/v1\/[a-z0-9/-]+$/.test(path)) {
    throw new CitadelError(400, 'Unsupported Citadel operation.');
  }
  let response: Response;
  try {
    response = await fetch(`${apiOrigin()}${path}${query?.size ? `?${query}` : ''}`, {
      method,
      headers: { Authorization: `Bearer ${bearer}`, Accept: 'application/json', ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(8000),
    });
  } catch (error) {
    if (error instanceof CitadelError) {
      throw error;
    }
    throw new CitadelError(502, 'Citadel is temporarily unavailable.');
  }
  if (!response.ok) {
    if (response.status === 401) {
      throw new CitadelError(401, 'Your Citadel session has expired.');
    }
    if (response.status === 403) {
      throw new CitadelError(403, 'This action is not permitted.');
    }
    if (response.status === 429) {
      throw new CitadelError(429, 'Please wait before trying again.');
    }
    throw new CitadelError(502, 'Citadel could not complete the request.');
  }
  if (response.status === 204) {
    return {};
  }
  const reader = response.body?.getReader();
  if (!reader) {
    throw new CitadelError(502, 'Citadel returned an invalid response.');
  }
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      size += value.length;
      if (size > 1024 * 1024) {
        await reader.cancel();
        throw new Error('Response too large');
      }
      chunks.push(value);
    }
    const result: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (response.status === 207 || (result && typeof result === 'object' && 'ok' in result && result.ok === false)) {
      throw new CitadelError(409, 'Citadel applied only part of this change. Refresh the settings before trying again.');
    }
    return result;
  } catch (error) {
    if (error instanceof CitadelError) {
      throw error;
    }
    throw new CitadelError(502, 'Citadel returned an invalid response.');
  } finally {
    reader.releaseLock();
  }
}
