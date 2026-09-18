import type { NextFetchEvent, NextRequest } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { defaultSeoConfig } from './config/seo';
import { clerkContextPagePrefixes } from './features/security/routing';
import { routing } from './libs/I18nRouting';
import { getSeoConfig } from './libs/seo/config';
import { isProductionDeployEnv } from './libs/seo/env';
import { localizedRoutePaths } from './libs/seo/locale';
import { normalizePathname } from './libs/seo/normalize';
import { resolveSiteUrl } from './libs/seo/site-url';

const handleI18nRouting = createMiddleware(routing);

function logicalPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] && routing.locales.includes(segments[0] as (typeof routing.locales)[number])) {
    segments.shift();
  }
  return segments.length ? `/${segments.join('/')}` : '/';
}

function needsClerkPageContext(pathname: string): boolean {
  const logical = logicalPath(pathname);
  return clerkContextPagePrefixes.some(prefix =>
    logical === prefix || logical.startsWith(`${prefix}/`),
  );
}

const auditPublicRoutes = new Set(
  [...defaultSeoConfig.routes.publicMarketing, ...defaultSeoConfig.routes.publicUtility]
    .flatMap(route => localizedRoutePaths(route, defaultSeoConfig)),
);

function seoNormalizeRedirect(request: NextRequest): NextResponse | null {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return null;
  }

  try {
    const config = getSeoConfig();
    const site = resolveSiteUrl(process.env, config.environment.deployEnv);
    const current = request.nextUrl;
    const pathname = normalizePathname(current.pathname, config.url.trailingSlash);
    const target = current.clone();
    target.pathname = pathname;

    const syntheticAuditOrigin = site.hostname.endsWith('.invalid');
    const localAudit = process.env.SEO_AUDIT_LOCAL === 'true' || syntheticAuditOrigin;
    if (isProductionDeployEnv(config.environment.deployEnv) && !localAudit) {
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
  const config = getSeoConfig();
  const site = resolveSiteUrl(process.env, config.environment.deployEnv);
  const syntheticAuditOrigin = site.hostname.endsWith('.invalid');
  if (
    process.env.SEO_AUDIT_LOCAL !== 'true'
    || (isProductionDeployEnv(config.environment.deployEnv) && !syntheticAuditOrigin)
  ) {
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

  if (!/sage-prime-seo-audit/i.test(request.headers.get('user-agent') || '')) {
    return null;
  }

  return auditPublicRoutes.has(request.nextUrl.pathname) ? request.nextUrl.pathname : null;
}

async function handleLocalSeoAudit(request: NextRequest): Promise<Response | null> {
  const logicalPathname = directAuditLogicalPath(request);
  if (!logicalPathname || !auditPublicRoutes.has(logicalPathname)) {
    return null;
  }

  if (request.headers.get('x-seo-audit-direct') === '1') {
    return NextResponse.next();
  }

  const target = request.nextUrl.clone();
  target.protocol = 'http:';
  target.hostname = '127.0.0.1';
  target.port = '3123';
  target.pathname = `/${routing.defaultLocale}${logicalPathname === '/' ? '' : logicalPathname}`;

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

export default async function proxy(
  request: NextRequest,
  event: NextFetchEvent,
) {
  const seoRedirect = seoNormalizeRedirect(request);
  if (seoRedirect) {
    return seoRedirect;
  }

  const localSeoAudit = await handleLocalSeoAudit(request);
  if (localSeoAudit) {
    return localSeoAudit;
  }

  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Clerk middleware provides request auth context. Sensitive Route Handlers
    // authenticate and authorize at the resource boundary.
    return clerkMiddleware(async () => NextResponse.next())(request, event);
  }

  if (needsClerkPageContext(request.nextUrl.pathname)) {
    return clerkMiddleware(async (_auth, req) => handleI18nRouting(req))(request, event);
  }

  // Public marketing/utility pages do not need Clerk request context.
  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\\..*).*)',
    '/api(.*)',
  ],
};
