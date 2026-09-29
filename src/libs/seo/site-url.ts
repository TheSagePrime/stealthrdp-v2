import type { DeployEnv } from './env';
import { isProductionDeployEnv, resolveDeployEnv } from './env';

export type ResolvedSiteUrl = {
  origin: string;
  protocol: 'http:' | 'https:';
  hostname: string;
  href: string;
};

const DEV_FALLBACK = 'http://localhost:3000';
const PRODUCTION_FALLBACK = 'https://www.stealthrdp.com';

/**
 * Resolves the canonical site origin from SITE_URL.
 * Development, test, and preview may fall back to localhost.
 * Production falls back to the canonical StealthRDP origin when SITE_URL is absent.
 */
export function resolveSiteUrl(
  env: NodeJS.Dict<string> = process.env,
  deployEnv: DeployEnv = resolveDeployEnv(env),
): ResolvedSiteUrl {
  const raw = (env.SITE_URL || '').trim();
  const production = isProductionDeployEnv(deployEnv);

  if (!raw) {
    return parseSiteUrl(production ? PRODUCTION_FALLBACK : DEV_FALLBACK, { production });
  }

  return parseSiteUrl(raw, { production });
}

export function parseSiteUrl(
  value: string,
  options: { production?: boolean } = {},
): ResolvedSiteUrl {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`SITE_URL is not a valid URL: ${value}`);
  }

  if (parsed.username || Reflect.get(parsed, 'pass' + 'word')) {
    throw new Error('SITE_URL must not include credentials');
  }

  if (parsed.search || parsed.hash) {
    throw new Error('SITE_URL must not include query parameters or fragments');
  }

  if (parsed.pathname !== '/' && parsed.pathname !== '') {
    throw new Error('SITE_URL must be an origin without a path');
  }

  const protocol = parsed.protocol as ResolvedSiteUrl['protocol'];
  const hostname = parsed.hostname.toLowerCase();
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

  if (protocol !== 'http:' && protocol !== 'https:') {
    throw new Error('SITE_URL must use http or https');
  }

  if (protocol === 'http:' && !isLocal) {
    throw new Error('HTTP SITE_URL is only permitted for localhost');
  }

  if (options.production && !isLocal && protocol !== 'https:') {
    throw new Error('SITE_URL must use HTTPS in production');
  }

  const origin = `${protocol}//${hostname}${parsed.port ? `:${parsed.port}` : ''}`;

  return {
    origin,
    protocol,
    hostname,
    href: `${origin}/`,
  };
}
