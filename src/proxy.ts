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
const isProtectedPage = createRouteMatcher(protectedPagePatterns);

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

function localePrefix(pathname: string): string {
  const first = pathname.split('/').filter(Boolean)[0];
  return first && routing.locales.includes(first as (typeof routing.locales)[number]) ? `/${first}` : '';
}

function directAuditLogicalPath(request: NextRequest): string | null {
  const config = getSeoConfig();
  if (isProductionDeployEnv(config.environment.deployEnv) || process.env.SEO_AUDIT_LOCAL !== 'true') {
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
  const logicalPath = directAuditLogicalPath(request);
  if (!logicalPath || !auditPublicRoutes.has(logicalPath)) {
    return null;
  }

  if (request.headers.get('x-seo-audit-direct') === '1') {
    return NextResponse.next();
  }

  const target = request.nextUrl.clone();
  target.protocol = 'http:';
  target.hostname = '127.0.0.1';
  target.port = '3123';
  target.pathname = `/${routing.defaultLocale}${logicalPath === '/' ? '' : logicalPath}`;

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
    // API routes receive Clerk auth context, but sensitive Route Handlers
    // must enforce authentication and authorization themselves.
    return clerkMiddleware(async () => NextResponse.next())(request, event);
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
