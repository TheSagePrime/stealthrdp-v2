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
  || pathname.startsWith('/docs/')
  || pathname.startsWith('/citadel/docs/');

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

function firstForwardedValue(value: string | null): string | null {
  const first = value?.split(',')[0]?.trim();
  return first || null;
}

/* The address the visitor used. Behind Coolify's Traefik the app sees plain
   http on an internal port, so the forwarded host and protocol decide; without
   this every production request redirects to itself in a loop. */
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
    if (isSyntheticAuditRequest(request)) {
      return null;
    }

    const config = getSeoConfig();
    const site = resolveSiteUrl(process.env, config.environment.deployEnv);
    if (syntheticAuditEnvironment()) {
      return null;
    }

    const current = externalRequestUrl(request);
    const pathname = normalizePathname(current.pathname, config.url.trailingSlash);
    const target = new URL(current);
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

/** True when the Accept header lists text/markdown with a quality above zero. */
function acceptsMarkdown(accept: string | null): boolean {
  return (accept ?? '').split(',').some((range) => {
    const [type, ...params] = range.split(';').map(part => part.trim().toLowerCase());
    if (type !== 'text/markdown') {
      return false;
    }
    const quality = params.find(param => param.startsWith('q='));
    return quality ? Number(quality.slice(2)) > 0 : true;
  });
}

/* EU, EEA, UK and Switzerland: analytics and ad tags wait for consent there (TrackingConsent). */
const optInCountries = new Set([
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
  'IS',
  'LI',
  'NO',
  'GB',
  'CH',
]);

/** Tell the page whether the visitor's country needs opt-in consent. No country header means opt-in. */
function withConsentRegion(request: NextRequest, response: NextResponse): NextResponse {
  const country = request.headers.get('x-vercel-ip-country')?.toUpperCase();
  const region = country && !optInCountries.has(country) ? 'other' : 'eea';
  if (request.cookies.get('sr_region')?.value !== region) {
    response.cookies.set('sr_region', region, { path: '/', maxAge: 60 * 60 * 24, sameSite: 'lax', secure: true });
  }
  return response;
}

export default async function proxy(request: NextRequest) {
  const seoRedirect = seoNormalizeRedirect(request);
  if (seoRedirect) {
    return seoRedirect;
  }

  /* Production only, as on the v1 site: an agent that asks for Markdown on the homepage gets
     llms.txt, the Markdown overview of the site. */
  if (
    request.nextUrl.pathname === '/'
    && acceptsMarkdown(request.headers.get('accept'))
    && isProductionDeployEnv(getSeoConfig().environment.deployEnv)
  ) {
    const markdown = NextResponse.rewrite(new URL('/llms.txt', request.url));
    /* Never cache this answer in a shared cache: the HTML for "/" lives at the same URL. */
    markdown.headers.set('Cache-Control', 'private, no-store');
    return markdown;
  }

  const localSeoAudit = await handleLocalSeoAudit(request);
  if (localSeoAudit) {
    return localSeoAudit;
  }

  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    return protectCitadelResponse(request, response);
  }

  return protectCitadelResponse(request, withConsentRegion(request, handleI18nRouting(request)));
}

function protectCitadelResponse(request: NextRequest, response: NextResponse): NextResponse {
  if (/^\/(?:en\/)?citadel\/app(?:\/|$)/.test(request.nextUrl.pathname)
    || /^\/api\/citadel(?:\/|$)/.test(request.nextUrl.pathname)) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    response.headers.set('Cache-Control', 'private, no-store');
    response.headers.set('Referrer-Policy', 'no-referrer');
  }
  return response;
}

export const config = {
  matcher: [
    '/((?!_next|_vercel|monitoring|.*\\.(?:png|jpg|jpeg|gif|svg|webp|avif|ico|css|js|map|woff|woff2|txt|xml|json|webmanifest)$).*)',
    '/api(.*)',
  ],
};
