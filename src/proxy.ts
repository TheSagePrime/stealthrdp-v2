import type { NextFetchEvent, NextRequest } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { defaultSeoConfig } from './config/seo';
import { routing } from './libs/I18nRouting';
import { getSeoConfig } from './libs/seo/config';
import { isProductionDeployEnv } from './libs/seo/env';
import { normalizePathname } from './libs/seo/normalize';
import { resolveSiteUrl } from './libs/seo/site-url';

const handleI18nRouting = createMiddleware(routing);

const protectedPagePatterns = defaultSeoConfig.routes.privatePages.flatMap((route) => {
  const suffix = route === '/' ? '(.*)' : `${route}(.*)`;
  return [suffix, `/:locale${suffix}`];
});
const privateApiPatterns = defaultSeoConfig.routes.privateApis.map(route => `${route}(.*)`);
const isProtectedPage = createRouteMatcher(protectedPagePatterns);
const isPrivateApi = privateApiPatterns.length > 0
  ? createRouteMatcher(privateApiPatterns)
  : () => false;

const isAuthPage = createRouteMatcher([
  '/sign-in(.*)',
  '/:locale/sign-in(.*)',
  '/sign-up(.*)',
  '/:locale/sign-up(.*)',
]);

const auditPublicRoutes = new Set([
  ...defaultSeoConfig.routes.publicMarketing,
  ...defaultSeoConfig.routes.publicUtility,
]);

function firstForwardedValue(value: string | null): string | null {
  const first = value?.split(',')[0]?.trim();
  return first || null;
}

function externalRequestUrl(request: NextRequest): URL {
  const forwardedHost = firstForwardedValue(request.headers.get('x-forwarded-host'));
  const forwardedProto = firstForwardedValue(request.headers.get('x-forwarded-proto'));
  const host = forwardedHost ?? request.headers.get('host') ?? request.nextUrl.host;
  const protocol = (forwardedProto ?? request.nextUrl.protocol).replace(/:$/, '');

  return new URL(`${protocol}://${host}${request.nextUrl.pathname}${request.nextUrl.search}`);
}

function seoNormalizeRedirect(request: NextRequest): NextResponse | null {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return null;
  }

  try {
    const config = getSeoConfig();
    const site = resolveSiteUrl(process.env, config.environment.deployEnv);
    const current = externalRequestUrl(request);
    const pathname = normalizePathname(current.pathname, config.url.trailingSlash);
    const target = new URL(current);
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

function localePrefix(pathname: string): string {
  const first = pathname.split('/').filter(Boolean)[0];
  return first && routing.locales.includes(first as (typeof routing.locales)[number]) ? `/${first}` : '';
}

type LocalSeoAuditRoute = {
  logicalPath: string;
  locale: string;
};

function directAuditRoute(request: NextRequest): LocalSeoAuditRoute | null {
  if (process.env.SEO_AUDIT_LOCAL !== 'true') {
    return null;
  }

  const pathname = request.nextUrl.pathname;
  const prefix = localePrefix(pathname);

  if (request.headers.get('x-seo-audit-direct') === '1') {
    if (!prefix) {
      return null;
    }

    const logicalPath = pathname === prefix
      ? '/'
      : pathname.slice(prefix.length) || '/';

    return auditPublicRoutes.has(logicalPath)
      ? { logicalPath, locale: prefix.slice(1) }
      : null;
  }

  if (!/sage-prime-seo-audit/i.test(request.headers.get('user-agent') || '')) {
    return null;
  }

  // Keep the existing default-locale audit behavior. The auditor requests
  // unprefixed public routes and we render them through an explicit locale path.
  if (auditPublicRoutes.has(pathname)) {
    return { logicalPath: pathname, locale: routing.defaultLocale };
  }

  // Localized auth routes must use the same direct audit path as the default
  // locale. Otherwise they enter Clerk middleware during the build-time crawl,
  // while /sign-in and /sign-up do not, which creates false HTTP 500 failures
  // when external Clerk runtime credentials are unavailable to the audit server.
  if (!prefix || !isAuthPage(request)) {
    return null;
  }

  const logicalPath = pathname === prefix
    ? '/'
    : pathname.slice(prefix.length) || '/';

  return auditPublicRoutes.has(logicalPath)
    ? { logicalPath, locale: prefix.slice(1) }
    : null;
}

async function handleLocalSeoAudit(request: NextRequest): Promise<Response | null> {
  const auditRoute = directAuditRoute(request);
  if (!auditRoute || !auditPublicRoutes.has(auditRoute.logicalPath)) {
    return null;
  }

  if (request.headers.get('x-seo-audit-direct') === '1') {
    return NextResponse.next();
  }

  const target = request.nextUrl.clone();
  target.protocol = 'http:';
  target.hostname = '127.0.0.1';
  target.port = '3123';
  target.pathname = `/${auditRoute.locale}${auditRoute.logicalPath === '/' ? '' : auditRoute.logicalPath}`;

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

  if (isPrivateApi(request)) {
    return clerkMiddleware(async (auth) => {
      const session = await auth();
      if (!session.userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.next();
    })(request, event);
  }

  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Clerk keyless mode doesn't work with i18n, this is why we need to run the middleware conditionally
  if (isAuthPage(request) || isProtectedPage(request)) {
    return clerkMiddleware(async (auth, req) => {
      // Check if the current route is protected and requires authentication.
      // If user is not authenticated, redirect them to the sign-in page with proper locale.
      if (isProtectedPage(req)) {
        const signInUrl = new URL(`${localePrefix(req.nextUrl.pathname)}/sign-in`, req.url);
        await auth.protect({ unauthenticatedUrl: signInUrl.toString() });
      }

      return handleI18nRouting(req);
    })(request, event);
  }

  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/_next`, `/_vercel` or `monitoring`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
};
