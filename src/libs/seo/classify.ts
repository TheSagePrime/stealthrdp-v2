import type { SeoConfig } from '../../config/seo';
import { stripLocalePrefix } from './locale';
import { normalizePathname } from './normalize';

export type RouteClass = 'publicMarketing' | 'publicUtility' | 'privatePage' | 'privateApi' | 'unknown';

function matchesPrefix(pathname: string, prefix: string): boolean {
  if (pathname === prefix) {
    return true;
  }
  if (prefix === '/') {
    return pathname === '/';
  }
  return pathname.startsWith(`${prefix}/`);
}

export function classifyPath(pathname: string, config: SeoConfig): RouteClass {
  const normalized = normalizePathname(pathname, config.url.trailingSlash);
  const path = stripLocalePrefix(normalized, config).path;

  if (config.routes.privateApis.some(prefix => matchesPrefix(path, prefix))) {
    return 'privateApi';
  }
  if (config.routes.privatePages.some(prefix => matchesPrefix(path, prefix))) {
    return 'privatePage';
  }
  if (config.routes.publicUtility.some(prefix => matchesPrefix(path, prefix))) {
    return 'publicUtility';
  }
  if (
    config.routes.publicMarketing.some(prefix => matchesPrefix(path, prefix))
    || (config.routes.dynamicPublic ?? []).some(prefix => matchesPrefix(path, prefix))
  ) {
    return 'publicMarketing';
  }

  return 'unknown';
}

export function robotsForClass(routeClass: RouteClass): 'index, follow' | 'noindex, follow' | 'noindex, nofollow' {
  if (routeClass === 'publicMarketing') {
    return 'index, follow';
  }
  if (routeClass === 'publicUtility') {
    return 'noindex, follow';
  }
  return 'noindex, nofollow';
}
