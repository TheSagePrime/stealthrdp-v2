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

function isDirectSeoAuditRequest(request: NextRequest): boolean {
  if (process.env.SEO_AUDIT_LOCAL !== 'true' || request.headers.get('x-seo-audit-direct') !== '1') {
    return false;
  }

  const prefix = `/${routing.defaultLocale}`;
  if (request.nextUrl.pathname !== prefix && !request.nextUrl.pathname.startsWith(`${prefix}/`)) {
    return false;
  }

  const logicalPath = request.nextUrl.pathname.slice(prefix.length) || '/';
  return [...defaultSeoConfig.routes.publicMarketing, ...defaultSeoConfig.routes.publicUtility]
    .some(route => route === logicalPath);
}

export default async function proxy(
  request: NextRequest,
  event: NextFetchEvent,
) {
  const seoRedirect = seoNormalizeRedirect(request);
  if (seoRedirect) {
    return seoRedirect;
  }

  if (isDirectSeoAuditRequest(request)) {
    return NextResponse.next();
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

  if (isAuthPage(request) || isProtectedPage(request)) {
    return clerkMiddleware(async (auth, req) => {
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
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
};
