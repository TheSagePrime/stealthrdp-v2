import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { defaultSeoConfig } from './config/seo';
import { routing } from './libs/I18nRouting';
import { getSeoConfig } from './libs/seo/config';
import { isProductionDeployEnv, resolveDeployEnv } from './libs/seo/env';
import { normalizePathname } from './libs/seo/normalize';
import { parseSiteUrl, resolveSiteUrl } from './libs/seo/site-url';

const handleI18nRouting = createMiddleware(routing);

const auditPublicRoutes = new Set([
  ...defaultSeoConfig.routes.publicMarketing,
  ...defaultSeoConfig.routes.publicUtility,
  ...(defaultSeoConfig.routes.dynamicPublic ?? []),
]);

const isAuditablePublicRoute = (pathname: string): boolean => auditPublicRoutes.has(pathname)
  || pathname.startsWith('/blog/')
  || pathname.startsWith('/docs/');

function syntheticAuditEnvironment(): boolean {
  if (process.env.CI !== 'true' || process.env.SEO_AUDIT_LOCAL !== 'true') {
    return false;
  }

  try {
    const auditUrl = (process.env.SEO_AUDIT_SITE_URL || '').trim();
    const site = parseSiteUrl(auditUrl);
    const auditHostname = new URL(auditUrl).hostname.toLowerCase();
    return site.hostname.endsWith('.invalid')
      && auditHostname.endsWith('.invalid')
      && !isProductionDeployEnv(resolveDeployEnv(process.env));
  } catch {
    return false;
  }
}

function isSyntheticAuditRequest(request: NextRequest): boolean {
  return syntheticAuditEnvironment()
    && /sage-prime-seo-audit/i.test(request.headers.get('user-agent') || '');
}

function seoNormalizeRedirect(request: NextRequest): NextResponse | null {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return null;
  }

  try {
    if (isSyntheticAuditRequest(request)) {
      return null;
    }

    const config = getSeoConfig();
    const site = resolveSiteUrl(process.env, config.environment.deployEnv);
    if (syntheticAuditEnvironment()) {
      return null;
    }

    const current = request.nextUrl;
    const pathname = normalizePathname(current.pathname, config.url.trailingSlash);
    const target = current.clone();
    target.pathname = pathname;

    if (isProductionDeployEnv(config.environment.deployEnv)) {
      target.protocol = site.protocol;
      target.hostname = site.hostname;
      target.port = new URL(site.origin).port;
    }

    const from = `${current.protocol}//${current.host}${current.pathname}`;
    const to = `${target.protocol}//${target.host}${target.pathname}`;
    if (from !== to) {
      return NextResponse.redirect(target, 308);
    }
  } catch {
    return null;
  }

  return null;
}

function directAuditLogicalPath(request: NextRequest): string | null {
  if (!isSyntheticAuditRequest(request)) {
    return null;
  }

  const prefix = `/${routing.defaultLocale}`;
  if (request.headers.get('x-seo-audit-direct') === '1') {
    if (request.nextUrl.pathname === prefix) {
      return '/';
    }
    if (request.nextUrl.pathname.startsWith(`${prefix}/`)) {
      return request.nextUrl.pathname.slice(prefix.length) || '/';
    }
    return null;
  }

  if (!isSyntheticAuditRequest(request)) {
    return null;
  }

  return isAuditablePublicRoute(request.nextUrl.pathname)
    ? request.nextUrl.pathname
    : null;
}

async function handleLocalSeoAudit(request: NextRequest): Promise<Response | null> {
  const logical = directAuditLogicalPath(request);
  if (!logical || !isAuditablePublicRoute(logical)) {
    return null;
  }

  if (request.headers.get('x-seo-audit-direct') === '1') {
    return NextResponse.next();
  }

  const target = request.nextUrl.clone();
  target.protocol = 'http:';
  target.hostname = '127.0.0.1';
  target.port = '3123';
  target.pathname = `/${routing.defaultLocale}${logical === '/' ? '' : logical}`;

  const headers = new Headers(request.headers);
  headers.set('x-seo-audit-direct', '1');
  headers.delete('x-forwarded-host');
  headers.delete('x-forwarded-proto');

  return fetch(target, {
    method: request.method,
    headers,
    redirect: 'manual',
  });
}

const INTERNAL_LOCALE_REWRITE = 'x-internal-locale-rewrite';

/**
 * With one locale and no URL prefix, next-intl rewrites /plans to /en/plans and then
 * redirects /en/plans back to /plans when Next.js runs this proxy again on the rewritten
 * path. That is an endless redirect loop under `next start`. Do the rewrite here and mark
 * it, so the second pass is served as-is while direct /en/... requests still redirect.
 */
function routeSingleLocale(request: NextRequest): NextResponse {
  const prefix = `/${routing.defaultLocale}`;
  const { pathname } = request.nextUrl;
  const hasPrefix = pathname === prefix || pathname.startsWith(`${prefix}/`);

  if (hasPrefix) {
    if (request.headers.get(INTERNAL_LOCALE_REWRITE) === '1') {
      return NextResponse.next();
    }
    const target = request.nextUrl.clone();
    target.pathname = pathname.slice(prefix.length) || '/';
    return NextResponse.redirect(target, 308);
  }

  const target = request.nextUrl.clone();
  target.pathname = `${prefix}${pathname === '/' ? '' : pathname}`;
  const headers = new Headers(request.headers);
  headers.set(INTERNAL_LOCALE_REWRITE, '1');
  return NextResponse.rewrite(target, { request: { headers } });
}

export default async function proxy(request: NextRequest) {
  const seoRedirect = seoNormalizeRedirect(request);
  if (seoRedirect) {
    return seoRedirect;
  }

  const localSeoAudit = await handleLocalSeoAudit(request);
  if (localSeoAudit) {
    return localSeoAudit;
  }

  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  if (routing.locales.length === 1) {
    return routeSingleLocale(request);
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    '/((?!_next|_vercel|monitoring|.*\\.(?:png|jpg|jpeg|gif|svg|webp|avif|ico|css|js|map|woff|woff2|txt|xml|json|webmanifest)$).*)',
    '/api(.*)',
  ],
};
