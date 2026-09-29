import type { DeployEnv } from './env';
import { isProductionDeployEnv, resolveDeployEnv } from './env';

export type ResolvedSiteUrl = {
  origin: string;
  protocol: 'http:' | 'https:';
  hostname: string;
  href: string;
};

const DEV_FALLBACK = 'http://localhost:3000';

/**
 * Resolves the canonical site origin from SITE_URL.
 * Development, test, and preview may fall back to localhost.
 * Production requires an explicit SITE_URL.
 */
export function resolveSiteUrl(
  env: NodeJS.Dict<string> = process.env,
  deployEnv: DeployEnv = resolveDeployEnv(env),
): ResolvedSiteUrl {
  const raw = (env.SITE_URL || '').trim();
  const production = isProductionDeployEnv(deployEnv);

  if (!raw) {
    if (production) {
      throw new Error('SITE_URL is required in production');
    }
    return parseSiteUrl(DEV_FALLBACK);
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

  // Reject any userinfo (user, user:secret, or :secret) before the host.
  if (/^[a-z][a-z0-9+.-]*:\/\/[^/?#]*@/i.test(value.trim())) {
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
