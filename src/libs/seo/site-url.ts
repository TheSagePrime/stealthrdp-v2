import type { DeployEnv } from './env';
import { isProductionDeployEnv, resolveDeployEnv } from './env';

export type ResolvedSiteUrl = {
  origin: string;
  protocol: 'http:' | 'https:';
  hostname: string;
  href: string;
};

const DEV_FALLBACK = 'http://localhost:3000';

function readRawSiteUrl(env: NodeJS.Dict<string>): string {
  return (env.SITE_URL || env.NEXT_PUBLIC_APP_URL || '').trim();
}

/**
 * Resolves the canonical site origin from SITE_URL.
 * Development and test may fall back to http://localhost:3000.
 */
export function resolveSiteUrl(
  env: NodeJS.Dict<string> = process.env,
  deployEnv: DeployEnv = resolveDeployEnv(env),
): ResolvedSiteUrl {
  const raw = readRawSiteUrl(env);
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

  if (parsed.username || parsed.password) {
    throw new Error('SITE_URL must not include credentials');
  }

  if (parsed.search || parsed.hash) {
    throw new Error('SITE_URL must not include query parameters or fragments');
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
