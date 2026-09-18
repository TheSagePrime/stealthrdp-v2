import type { NextFetchEvent, NextRequest } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { defaultSeoConfig } from './config/seo';
import {
  clerkContextPagePrefixes,
  protectedPagePrefixes,
  publicApiPaths,
  sensitiveApiPaths,
} from './features/security/routing';
import { routing } from './libs/I18nRouting';
import { getSeoConfig } from './libs/seo/config';
import { isProductionDeployEnv } from './libs/seo/env';
import { normalizePathname } from './libs/seo/normalize';
import { resolveSiteUrl } from './libs/seo/site-url';

const handleI18nRouting = createMiddleware(routing);

const auditPublicRoutes = new Set([
  ...defaultSeoConfig.routes.publicMarketing,
  ...defaultSeoConfig.routes.publicUtility,
]);

function logicalPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (
    segments[0]
    && routing.locales.includes(
      segments[0] as (typeof routing.locales)[number],
    )
  ) {
    segments.shift();
  }
  return segments.length ? `/${segments.join('/')}` : '/';
}

function matchesLogicalPrefix(
  pathname: string,
  prefixes: readonly string[],
): boolean {
  const logical = logicalPath(pathname);
  return prefixes.some(
    prefix =>
      logical === prefix
      || (prefix !== '/' && logical.startsWith(`${prefix}/`)),
  );
}

function isPublicApi(pathname: string): boolean {
  return publicApiPaths.some(path => pathname === path);
}

function isSensitiveApi(pathname: string): boolean {
  return sensitiveApiPaths.some(path => pathname === path);
}

function syntheticAuditEnvironment(): boolean {
  if (process.env.CI !== 'true' || process.env.SEO_AUDIT_LOCAL !== 'true') {
    return false;
  }

  try {
    const config = getSeoConfig();
    const site = resolveSiteUrl(process.env, config.environment.deployEnv);
    return site.hostname.endsWith('.invalid');
  } catch {
    return false;
  }
}

function isSyntheticAuditRequest(request: NextRequest): boolean {
  return (
    syntheticAuditEnvironment()
    && /sage-prime-seo-audit/i.test(
      request.headers.get('user-agent') || '',
    )
  );
}

function seoNormalizeRedirect(request: NextRequest): NextResponse | null {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return null;
  }

  try {
    const config = getSeoConfig();
    const site = resolveSiteUrl(process.env, config.environment.deployEnv);
    const current = request.nextUrl;
    const pathname = normalizePathname(
      current.pathname,
      config.url.trailingSlash,
    );
    const target = current.clone();
    target.pathname = pathname;

    const localAudit = syntheticAuditEnvironment();
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
  if (!syntheticAuditEnvironment()) {
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

  return auditPublicRoutes.has(request.nextUrl.pathname)
    ? request.nextUrl.pathname
    : null;
}

async function handleLocalSeoAudit(
  request: NextRequest,
): Promise<Response | null> {
  const logical = directAuditLogicalPath(request);
  if (!logical || !auditPublicRoutes.has(logical)) {
    return null;
  }

  if (request.headers.get('x-seo-audit-direct') === '1') {
    return NextResponse.next();
  }

  const target = request.nextUrl.clone();
  target.protocol = 'http:';
  target.hostname = '127.0.0.1';
  target.port = '3123';
  target.pathname = `/${routing.defaultLocale}${
    logical === '/' ? '' : logical
  }`;

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

function syntheticPrivateResponse(request: NextRequest): Response | null {
  if (!isSyntheticAuditRequest(request)) {
    return null;
  }

  if (
    isSensitiveApi(request.nextUrl.pathname)
    || matchesLogicalPrefix(
      request.nextUrl.pathname,
      protectedPagePrefixes,
    )
  ) {
    return NextResponse.json(
      { error: 'UNAUTHORIZED' },
      { status: 401 },
    );
  }

  return null;
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

  const syntheticPrivate = syntheticPrivateResponse(request);
  if (syntheticPrivate) {
    return syntheticPrivate;
  }

  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (isPublicApi(request.nextUrl.pathname)) {
      return NextResponse.next();
    }

    // Clerk middleware supplies auth context only. Each sensitive Route
    // Handler authenticates and authorizes at the resource boundary.
    return clerkMiddleware(async () => NextResponse.next())(
      request,
      event,
    );
  }

  if (
    matchesLogicalPrefix(
      request.nextUrl.pathname,
      clerkContextPagePrefixes,
    )
  ) {
    return clerkMiddleware(
      async (_auth, req) => handleI18nRouting(req),
    )(request, event);
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    '/((?!_next|_vercel|monitoring|.*\\..*).*)',
    '/api(.*)',
  ],
};
