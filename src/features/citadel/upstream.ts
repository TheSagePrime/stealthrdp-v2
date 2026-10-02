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

export async function citadelRequest(bearer: string, path: string, method = 'GET'): Promise<unknown> {
  if (!/^\/api\/v1\/[a-z0-9/-]+$/.test(path)) {
    throw new CitadelError(400, 'Unsupported Citadel operation.');
  }
  let response: Response;
  try {
    response = await fetch(`${apiOrigin()}${path}`, {
      method,
      headers: { Authorization: `Bearer ${bearer}`, Accept: 'application/json' },
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
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new CitadelError(502, 'Citadel returned an invalid response.');
  } finally {
    reader.releaseLock();
  }
}
