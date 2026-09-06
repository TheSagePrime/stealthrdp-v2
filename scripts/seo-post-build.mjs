#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createReporter } from './seo-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = relative => pathToFileURL(path.join(root, relative)).href;
const { defaultSeoConfig } = await import(src('src/config/seo.ts'));
const { resolveDeployEnv, isProductionDeployEnv } = await import(src('src/libs/seo/env.ts'));
const { resolveSiteUrl } = await import(src('src/libs/seo/site-url.ts'));
const { canonicalUrlForPath, normalizePathname } = await import(src('src/libs/seo/normalize.ts'));
const { classifyPath } = await import(src('src/libs/seo/classify.ts'));

const reporter = createReporter();
const deployEnv = resolveDeployEnv(process.env);
const config = { ...defaultSeoConfig, environment: { deployEnv } };
const site = resolveSiteUrl(process.env, deployEnv);
config.siteUrl = site.origin;
const crawlOrigin = 'http://127.0.0.1:3123';
const privatePrefixes = [...config.routes.privatePages, ...config.routes.privateApis];

function isPrivatePath(pathname) {
  const pathName = normalizePathname(pathname, config.url.trailingSlash);
  return privatePrefixes.some(prefix => pathName === prefix || pathName.startsWith(`${prefix}/`));
}

function sameOriginPath(href, base) {
  try {
    const url = new URL(href, base);
    if (url.origin !== new URL(base).origin && url.origin !== site.origin) {
      return null;
    }
    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

function extract(html, expression, flags = 'i') {
  return html.match(new RegExp(expression, flags))?.[1] || '';
}

function parseHtml(html) {
  return {
    title: extract(html, '<title[^>]*>([\\s\\S]*?)</title>').trim(),
    description: extract(html, '<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)["\']')
      || extract(html, '<meta[^>]+content=["\']([^"\']*)["\'][^>]+name=["\']description["\']'),
    canonical: extract(html, '<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']')
      || extract(html, '<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']canonical["\']'),
    robots: extract(html, '<meta[^>]+name=["\']robots["\'][^>]+content=["\']([^"\']+)["\']').toLowerCase(),
    ogUrl: extract(html, '<meta[^>]+property=["\']og:url["\'][^>]+content=["\']([^"\']+)["\']'),
    ogImage: extract(html, '<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']'),
    jsonLd: [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(match => match[1]),
    hrefs: [...html.matchAll(/\bhref=["']([^"']+)["']/gi)].map(match => match[1]),
  };
}

function leakCheck(route, label, value) {
  if (!value) {
    return;
  }
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  for (const prefix of privatePrefixes) {
    if (text.includes(prefix) && prefix !== '/') {
      reporter.fail(route, 'private-leak', `${label} references private URL ${prefix}`, '', text.slice(0, 180));
    }
  }
}

async function fetchRaw(url, redirect = 'manual') {
  const response = await fetch(url, { redirect, headers: { 'user-agent': 'sage-prime-seo-audit' } });
  const text = await response.text();
  return { response, text, status: response.status, location: response.headers.get('location') || '' };
}

function looksSoft404(html, status) {
  if (status !== 200) {
    return false;
  }
  const text = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length < 40 || /not found|page doesn.?t exist/i.test(text);
}

async function auditHtml(route, html, status) {
  const parsed = parseHtml(html);
  const routeClass = classifyPath(route, config);
  const expectedCanonical = canonicalUrlForPath(route, site, config);

  if (status === 404) {
    reporter.fail(route, 'http', 'Confirmed HTTP 404');
    return parsed;
  }
  if (status >= 500) {
    reporter.fail(route, 'http', `HTTP ${status}`);
    return parsed;
  }
  if (looksSoft404(html, status)) {
    reporter.warn(route, 'soft-404', 'Suspected soft-404');
  }
  if (!parsed.title) {
    reporter.fail(route, 'title', 'Missing <title>');
  } else if (parsed.title.length > 60) {
    reporter.warn(route, 'title', 'Title longer than 60 characters', '<=60', String(parsed.title.length));
  }
  if (routeClass === 'publicMarketing' || routeClass === 'publicUtility') {
    if (!parsed.description) {
      reporter.fail(route, 'description', 'Missing meta description');
    } else if (parsed.description.length < 50) {
      reporter.warn(route, 'description', 'Meta description shorter than 50 characters');
    } else if (parsed.description.length > 160) {
      reporter.warn(route, 'description', 'Meta description longer than 160 characters');
    }
  }
  if (routeClass === 'publicMarketing') {
    if (!parsed.canonical) {
      reporter.fail(route, 'canonical', 'Missing canonical');
    } else if (!/^https?:\/\//i.test(parsed.canonical)) {
      reporter.fail(route, 'canonical', 'Relative canonical', expectedCanonical, parsed.canonical);
    } else {
      const canonicalUrl = new URL(parsed.canonical);
      if (isProductionDeployEnv(deployEnv) && canonicalUrl.protocol !== 'https:') {
        reporter.fail(route, 'canonical', 'HTTP canonical in production', expectedCanonical, parsed.canonical);
      }
      if (canonicalUrl.hostname !== site.hostname) {
        reporter.fail(route, 'canonical', 'Wrong canonical hostname', site.hostname, canonicalUrl.hostname);
      }
      if (canonicalUrl.origin + (canonicalUrl.pathname === '/' ? '' : canonicalUrl.pathname) !== expectedCanonical.replace(/\/$/, '') && parsed.canonical.replace(/\/$/, '') !== expectedCanonical.replace(/\/$/, '')) {
        reporter.fail(route, 'canonical', 'Canonical does not match SITE_URL path', expectedCanonical, parsed.canonical);
      }
      if (isPrivatePath(canonicalUrl.pathname)) {
        reporter.fail(route, 'canonical', 'Canonical points to a private route', expectedCanonical, parsed.canonical);
      }
    }
  }
  leakCheck(route, 'canonical', parsed.canonical);
  leakCheck(route, 'og:url', parsed.ogUrl);
  leakCheck(route, 'html', html);
  for (const block of parsed.jsonLd) {
    try {
      const parsedBlock = JSON.parse(block);
      leakCheck(route, 'json-ld', parsedBlock);
    } catch {
      reporter.fail(route, 'json-ld', 'Unparseable JSON-LD');
    }
  }
  if (parsed.ogImage) {
    try {
      const imageUrl = new URL(parsed.ogImage, site.origin);
      const image = await fetchRaw(imageUrl.href, 'follow');
      if (image.status !== 200) {
        reporter.fail(route, 'og-image', 'Configured OG image did not return 200', '200', String(image.status));
      }
    } catch (error) {
      reporter.fail(route, 'og-image', error instanceof Error ? error.message : String(error));
    }
  } else if (routeClass === 'publicMarketing') {
    reporter.warn(route, 'og-image', 'Missing optional fallback OG image');
  }
  return parsed;
}

async function auditSitemap(text) {
  const locs = [...text.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(match => match[1].trim());
  const expected = [...config.routes.publicMarketing, ...(config.routes.dynamicPublic ?? [])]
    .map(route => canonicalUrlForPath(route, site, config));
  for (const url of expected) {
    if (!locs.includes(url) && !locs.includes(`${url}/`)) {
      reporter.fail('/sitemap.xml', 'sitemap-missing', `Indexable URL missing from sitemap`, url);
    }
  }
  for (const loc of locs) {
    leakCheck('/sitemap.xml', 'sitemap', loc);
    for (const utility of config.routes.publicUtility) {
      if (loc.includes(utility) && utility !== '/') {
        reporter.fail('/sitemap.xml', 'sitemap-utility', 'Utility URL included in sitemap', '', loc);
      }
    }
    if (!loc.startsWith(site.origin)) {
      reporter.fail('/sitemap.xml', 'sitemap-canonical', 'Sitemap URL is not canonical', site.origin, loc);
    }
  }
}

async function crawlSsr() {
  const visited = new Set();
  const queue = ['/'];
  const htmlByRoute = new Map();
  while (queue.length && visited.size < 200) {
    const route = queue.shift();
    if (!route || visited.has(route)) {
      continue;
    }
    visited.add(route);
    const pathname = route.split('?')[0];
    if (pathname.startsWith('/api/')) {
      const api = await fetchRaw(`${crawlOrigin}${route}`, 'manual');
      if (api.status === 404) {
        reporter.fail(route, 'http', 'Confirmed HTTP 404');
      } else if (api.status >= 500) {
        reporter.fail(route, 'http', `HTTP ${api.status}`);
      }
      continue;
    }
    const result = await fetchRaw(`${crawlOrigin}${route}`, 'manual');
    if ([301, 302, 307, 308].includes(result.status)) {
      if (isPrivatePath(pathname) && /sign-in|login/i.test(result.location)) {
        reporter.pass(route, 'auth', `Private page redirected to login with ${result.status}`);
        continue;
      }
      const location = result.location;
      if (!location) {
        reporter.fail(route, 'redirect', 'Redirect without Location');
        continue;
      }
      const next = sameOriginPath(location, crawlOrigin);
      if (next && !visited.has(next.split('?')[0])) {
        reporter.fail(route, 'redirect', 'Internal link redirected instead of using the final URL', next, route);
      }
      continue;
    }
    if (result.status === 401 || result.status === 403) {
      reporter.pass(route, 'auth', `Private or protected response ${result.status}`);
      continue;
    }
    const parsed = await auditHtml(pathname, result.text, result.status);
    htmlByRoute.set(pathname, parsed);
    for (const href of parsed.hrefs) {
      const next = sameOriginPath(href, `${crawlOrigin}${pathname}`);
      if (!next) {
        continue;
      }
      const nextPath = next.split('?')[0];
      if (!visited.has(nextPath) && !nextPath.startsWith('/_next')) {
        queue.push(nextPath);
      }
    }
  }

  const reachable = new Set(htmlByRoute.keys());
  for (const route of config.routes.publicMarketing) {
    if (!reachable.has(route) && route !== '/') {
      reporter.warn(route, 'orphan', 'Indexable route was not reachable from internal links');
    }
  }
}

async function crawlStatic(dir) {
  const index = path.join(dir, 'index.html');
  if (!existsSync(index)) {
    reporter.fail('/', 'static-export', `Missing ${index}`);
    return;
  }
  const html = readFileSync(index, 'utf8');
  await auditHtml('/', html, 200);
}

function detectStaticDir() {
  for (const dir of ['out', 'dist']) {
    if (existsSync(path.join(root, dir, 'index.html'))) {
      return path.join(root, dir);
    }
  }
  return null;
}

function waitForServer(url, timeoutMs = 45000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const probe = () => {
      const request = http.get(url, (response) => {
        response.resume();
        resolve(response.statusCode || 0);
      });
      request.on('error', () => {
        if (Date.now() - started > timeoutMs) {
          reject(new Error(`Timed out waiting for ${url}`));
          return;
        }
        setTimeout(probe, 400);
      });
    };
    probe();
  });
}

async function withServer(fn) {
  const child = spawn('pnpm', ['exec', 'next', 'start', '-p', '3123', '-H', '127.0.0.1'], {
    cwd: root,
    env: { ...process.env, PATH: `${root}/node_modules/.bin:${process.env.PATH || ''}` },
    stdio: 'ignore',
    detached: true,
  });
  try {
    await waitForServer(`${crawlOrigin}/`);
    await fn();
  } catch (error) {
    reporter.fail('/', 'ssr-server', error instanceof Error ? error.message : String(error));
  } finally {
    await new Promise((resolve) => {
      if (child.exitCode !== null) {
        resolve();
        return;
      }
      const timer = setTimeout(() => {
        try {
          process.kill(-child.pid, 'SIGKILL');
        } catch {}
      }, 2000);
      child.once('exit', () => {
        clearTimeout(timer);
        resolve();
      });
      try {
        process.kill(-child.pid, 'SIGTERM');
      } catch {
        child.kill('SIGTERM');
      }
    });
  }
}

const staticDir = detectStaticDir();
if (staticDir) {
  await crawlStatic(staticDir);
} else {
  await withServer(async () => {
    const robots = await fetchRaw(`${crawlOrigin}/robots.txt`, 'follow');
    if (robots.status !== 200) {
      reporter.fail('/robots.txt', 'http', `HTTP ${robots.status}`);
    }
    const sitemap = await fetchRaw(`${crawlOrigin}/sitemap.xml`, 'follow');
    if (sitemap.status !== 200) {
      reporter.fail('/sitemap.xml', 'http', `HTTP ${sitemap.status}`);
    } else {
      await auditSitemap(sitemap.text);
    }
    await crawlSsr();
  });
}

const report = reporter.write(root);
if (report.failCount > 0) {
  console.error(`SEO post-build failed with ${report.failCount} issue(s). See reports/seo-audit.txt`);
  process.exit(1);
}

console.log(`SEO post-build passed with ${report.warnCount} warning(s).`);
