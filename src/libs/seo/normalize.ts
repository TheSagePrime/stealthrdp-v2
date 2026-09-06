import type { SeoConfig } from '../../config/seo';
import type { ResolvedSiteUrl } from './site-url';

const DEFAULT_TRACKING = ['utm_*', 'fbclid', 'gclid'];

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function trackingPattern(token: string): RegExp {
  if (token.endsWith('*')) {
    return new RegExp(`^${escapeRegex(token.slice(0, -1))}.*$`, 'i');
  }
  return new RegExp(`^${escapeRegex(token)}$`, 'i');
}

function isTrackingParam(name: string, trackingParams: string[] = DEFAULT_TRACKING): boolean {
  return trackingParams.some(token => trackingPattern(token).test(name));
}

export function normalizePathname(
  pathname: string,
  trailingSlash: SeoConfig['url']['trailingSlash'] = 'strip',
): string {
  const decoded = decodeURIComponent(pathname || '/');
  const withLeading = decoded.startsWith('/') ? decoded : `/${decoded}`;
  const collapsed = withLeading.replace(/\/{2,}/g, '/').toLowerCase();

  if (collapsed === '/') {
    return '/';
  }

  if (trailingSlash === 'append') {
    return collapsed.endsWith('/') ? collapsed : `${collapsed}/`;
  }

  return collapsed.endsWith('/') ? collapsed.slice(0, -1) : collapsed;
}

export function stripTrackingParams(
  searchParams: URLSearchParams,
  trackingParams: string[] = DEFAULT_TRACKING,
): URLSearchParams {
  const next = new URLSearchParams();
  for (const [key, value] of searchParams.entries()) {
    if (!isTrackingParam(key, trackingParams)) {
      next.append(key, value);
    }
  }
  return next;
}

export function canonicalUrlForPath(
  path: string,
  site: ResolvedSiteUrl,
  config: Pick<SeoConfig, 'url'>,
): string {
  const withoutQuery = path.split('?')[0]?.split('#')[0] || '/';
  const pathname = normalizePathname(withoutQuery, config.url.trailingSlash);
  return `${site.origin}${pathname === '/' ? '' : pathname}`;
}
