#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
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
const titleRoutes = new Map();

function normalizedPath(pathname) {
  return normalizePathname(pathname || '/', config.url.trailingSlash);
}

function isPrivatePath(pathname) {
  const value = normalizedPath(pathname);
  return privatePrefixes.some(prefix => value === prefix || (prefix !== '/' && value.startsWith(`${prefix}/`)));
}

function isUtilityPath(pathname) {
  return classifyPath(pathname, config) === 'publicUtility';
}

function sameOriginPath(href, base) {
  try {
    const url = new URL(href, base);
    const baseOrigin = new URL(base).origin;
    if (url.origin !== baseOrigin && url.origin !== site.origin) {
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

function privateReference(value, base = site.origin) {
  if (!value || typeof value !== 'string') {
    return null;
  }
  try {
    const url = new URL(value, base);
    return isPrivatePath(url.pathname) ? url.pathname : null;
  } catch {
    return null;
  }
}

function leakCheck(route, label, value) {
  const values = [];
  if (typeof value === 'string') {
    values.push(value);
  } else if (value) {
    const visit = (item) => {
      if (typeof item === 'string') {
        values.push(item);
      } else if (Array.isArray(item)) {
        item.forEach(visit);
      } else if (item && typeof item === 'object') {
        Object.values(item).forEach(visit);
      }
    };
    visit(value);
  }

  for (const candidate of values) {
    const leaked = privateReference(candidate);
    if (leaked) {
      reporter.fail(route, 'private-leak', `${label} references private URL ${leaked}`, '', candidate);
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

function recordTitle(route, title, routeClass) {
  if (!title || routeClass !== 'publicMarketing') {
    return;
  }
  const key = title.trim().toLowerCase();
  const routes = titleRoutes.get(key) ?? [];
  routes.push(route);
  titleRoutes.set(key, routes);
}

function validateRobotsMeta(route, routeClass, robots) {
  const tokens = new Set(robots.split(',').map(token => token.trim()).filter(Boolean));
  if (routeClass === 'publicMarketing') {
    if (tokens.has('noindex') || tokens.has('nofollow')) {
      reporter.fail(route, 'robots-meta', 'Indexable marketing route is noindex/nofollow', 'index, follow', robots);
    }
  } else if (routeClass === 'publicUtility') {
    if (!tokens.has('noindex')) {
      reporter.fail(route, 'robots-meta', 'Utility route must be noindex', 'noindex, follow', robots);
    }
    if (tokens.has('nofollow')) {
      reporter.fail(route, 'robots-meta', 'Utility route must remain followable', 'noindex, follow', robots);
    }
  }
}

async function auditHtml(route, html, status) {
  const pathname = route.split('?')[0] || '/';
  const parsed = parseHtml(html);
  const routeClass = classifyPath(pathname, config);
  const expectedCanonical = canonicalUrlForPath(pathname, site, config);

  if (status === 404) {
    reporter.fail(pathname, 'http', 'Confirmed HTTP 404');
    return parsed;
  }
  if (status >= 500) {
    reporter.fail(pathname, 'http', `HTTP ${status}`);
    return parsed;
  }
  if (status === 401 || status === 403) {
    if (routeClass === 'privatePage' || routeClass === 'privateApi') {
      reporter.pass(pathname, 'auth', `Protected response ${status}`);
    } else {
      reporter.fail(pathname, 'http', `Public route returned HTTP ${status}`);
    }
    return parsed;
  }
  if (status !== 200) {
    reporter.fail(pathname, 'http', `Expected HTTP 200, got ${status}`, '200', String(status));
    return parsed;
  }
  if (looksSoft404(html, status)) {
    reporter.warn(pathname, 'soft-404', 'Suspected soft-404');
  }

  if (!parsed.title) {
    reporter.fail(pathname, 'title', 'Missing <title>');
  } else {
    recordTitle(pathname, parsed.title, routeClass);
    if (parsed.title.length > 60) {
      reporter.warn(pathname, 'title', 'Title longer than 60 characters', '<=60', String(parsed.title.length));
    }
  }

  if (routeClass === 'publicMarketing' || routeClass === 'publicUtility') {
    if (!parsed.description) {
      reporter.fail(pathname, 'description', 'Missing meta description');
    } else if (parsed.description.length < 50) {
      reporter.warn(pathname, 'description', 'Meta description shorter than 50 characters');
    } else if (parsed.description.length > 160) {
      reporter.warn(pathname, 'description', 'Meta description longer than 160 characters');
    }
    validateRobotsMeta(pathname, routeClass, parsed.robots);
  }

  if (routeClass === 'publicMarketing') {
    if (!parsed.canonical) {
      reporter.fail(pathname, 'canonical', 'Missing canonical');
    } else if (!/^https?:\/\//i.test(parsed.canonical)) {
      reporter.fail(pathname, 'canonical', 'Relative canonical', expectedCanonical, parsed.canonical);
    } else {
      const canonicalUrl = new URL(parsed.canonical);
      if (isProductionDeployEnv(deployEnv) && canonicalUrl.protocol !== 'https:' && canonicalUrl.hostname !== 'localhost' && canonicalUrl.hostname !== '127.0.0.1') {
        reporter.fail(pathname, 'canonical', 'HTTP canonical in production', expectedCanonical, parsed.canonical);
      }
      if (canonicalUrl.hostname !== site.hostname) {
        reporter.fail(pathname, 'canonical', 'Wrong canonical hostname', site.hostname, canonicalUrl.hostname);
      }
      if (parsed.canonical.replace(/\/$/, '') !== expectedCanonical.replace(/\/$/, '')) {
        reporter.fail(pathname, 'canonical', 'Canonical does not match SITE_URL path', expectedCanonical, parsed.canonical);
      }
      if (isPrivatePath(canonicalUrl.pathname)) {
        reporter.fail(pathname, 'canonical', 'Canonical points to a private route', expectedCanonical, parsed.canonical);
      }
    }
  }

  leakCheck(pathname, 'canonical', parsed.canonical);
  leakCheck(pathname, 'og:url', parsed.ogUrl);
  for (const href of parsed.hrefs) {
    leakCheck(pathname, 'internal link', href);
  }
  for (const block of parsed.jsonLd) {
    try {
      const parsedBlock = JSON.parse(block);
      leakCheck(pathname, 'json-ld', parsedBlock);
    } catch {
      reporter.fail(pathname, 'json-ld', 'Unparseable JSON-LD');
    }
  }

  if (parsed.ogImage) {
    try {
      const imageUrl = new URL(parsed.ogImage, site.origin);
      const target = imageUrl.origin === site.origin
        ? `${crawlOrigin}${imageUrl.pathname}${imageUrl.search}`
        : imageUrl.href;
      const image = await fetchRaw(target, 'follow');
      if (image.status !== 200) {
        reporter.fail(pathname, 'og-image', 'Configured OG image did not return 200', '200', String(image.status));
      }
    } catch (error) {
      reporter.fail(pathname, 'og-image', error instanceof Error ? error.message : String(error));
    }
  } else if (routeClass === 'publicMarketing') {
    reporter.warn(pathname, 'og-image', 'Missing optional fallback OG image');
  }

  return parsed;
}

function checkDuplicateTitles() {
  for (const routes of titleRoutes.values()) {
    const unique = [...new Set(routes)];
    if (unique.length > 1) {
      for (const route of unique) {
        reporter.fail(route, 'duplicate-title', `Duplicate title shared by: ${unique.join(', ')}`);
      }
    }
  }
}

function validateRobotsText(text) {
  if (!isProductionDeployEnv(deployEnv)) {
    if (!/disallow:\s*\/\s*$/im.test(text)) {
      reporter.fail('/robots.txt', 'robots', 'Non-production robots.txt must disallow all crawling', 'Disallow: /', text);
    }
    return;
  }
  for (const privateRoute of privatePrefixes) {
    if (!privateRoute || privateRoute === '/') {
      continue;
    }
    if (!text.includes(`Disallow: ${privateRoute}`)) {
      reporter.fail('/robots.txt', 'robots-private', `Missing private route exclusion ${privateRoute}`);
    }
  }
  if (!text.includes(`${site.origin}/sitemap.xml`)) {
    reporter.fail('/robots.txt', 'robots-sitemap', 'robots.txt must reference canonical sitemap URL');
  }
}

async function auditSitemap(text, runtime = 'ssr') {
  const locs = [...text.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(match => match[1].trim());
  const expected = [...config.routes.publicMarketing, ...(config.routes.dynamicPublic ?? [])]
    .map(route => canonicalUrlForPath(route, site, config));

  for (const url of expected) {
    if (!locs.some(loc => loc.replace(/\/$/, '') === url.replace(/\/$/, ''))) {
      reporter.fail('/sitemap.xml', 'sitemap-missing', 'Indexable URL missing from sitemap', url);
    }
  }

  for (const loc of locs) {
    leakCheck('/sitemap.xml', 'sitemap', loc);
    let parsed;
    try {
      parsed = new URL(loc);
    } catch {
      reporter.fail('/sitemap.xml', 'sitemap-url', 'Malformed sitemap URL', '', loc);
      continue;
    }
    if (parsed.origin !== site.origin) {
      reporter.fail('/sitemap.xml', 'sitemap-canonical', 'Sitemap URL is not on SITE_URL origin', site.origin, parsed.origin);
    }
    if (isUtilityPath(parsed.pathname)) {
      reporter.fail('/sitemap.xml', 'sitemap-utility', 'Utility URL included in sitemap', '', loc);
    }
    if (isPrivatePath(parsed.pathname)) {
      reporter.fail('/sitemap.xml', 'sitemap-private', 'Private URL included in sitemap', '', loc);
    }

    if (runtime === 'ssr' && parsed.origin === site.origin) {
      const result = await fetchRaw(`${crawlOrigin}${parsed.pathname}${parsed.search}`, 'manual');
      if ([301, 302, 307, 308].includes(result.status)) {
        reporter.fail('/sitemap.xml', 'sitemap-redirect', 'Sitemap URL redirects', '200', `${result.status} ${result.location}`);
      } else if (result.status !== 200) {
        reporter.fail('/sitemap.xml', 'sitemap-http', 'Sitemap URL must return 200', '200', String(result.status));
      } else {
        const html = parseHtml(result.text);
        if (/noindex/i.test(html.robots)) {
          reporter.fail('/sitemap.xml', 'sitemap-noindex', 'Sitemap URL is noindex', '', loc);
        }
        const expectedCanonical = canonicalUrlForPath(parsed.pathname, site, config);
        if (!html.canonical || html.canonical.replace(/\/$/, '') !== expectedCanonical.replace(/\/$/, '')) {
          reporter.fail('/sitemap.xml', 'sitemap-canonical', 'Sitemap URL is not self-canonical', expectedCanonical, html.canonical);
        }
      }
    }
  }
}

async function checkRedirect(route, result) {
  if (!result.location) {
    reporter.fail(route, 'redirect', 'Redirect without Location');
    return;
  }
  const first = sameOriginPath(result.location, `${crawlOrigin}${route}`);
  if (!first) {
    return;
  }
  const second = await fetchRaw(`${crawlOrigin}${first}`, 'manual');
  if ([301, 302, 307, 308].includes(second.status)) {
    const next = sameOriginPath(second.location, `${crawlOrigin}${first}`);
    if (next && normalizedPath(next.split('?')[0]) === normalizedPath(route.split('?')[0])) {
      reporter.fail(route, 'redirect-loop', `Redirect loop detected via ${first}`);
    } else {
      reporter.fail(route, 'redirect-chain', `Redirect chain detected: ${route} → ${first} → ${next || second.location}`);
    }
  }
}

async function auditSsrRoute(route, fromLink = false) {
  const pathname = route.split('?')[0] || '/';
  const routeClass = classifyPath(pathname, config);
  const result = await fetchRaw(`${crawlOrigin}${route}`, 'manual');

  if ([301, 302, 307, 308].includes(result.status)) {
    if (routeClass === 'privatePage' && /sign-in|login/i.test(result.location)) {
      reporter.pass(pathname, 'auth', `Private page redirected to login with ${result.status}`);
      return null;
    }
    await checkRedirect(route, result);
    if (fromLink) {
      reporter.fail(pathname, 'internal-redirect', 'Internal link points to a redirect instead of final URL', '', result.location);
    } else if (routeClass === 'publicMarketing' || routeClass === 'publicUtility') {
      reporter.fail(pathname, 'http', `Registered public route redirects with ${result.status}`, '200', result.location);
    }
    return null;
  }

  if (routeClass === 'privateApi') {
    if (result.status === 401 || result.status === 403) {
      reporter.pass(pathname, 'auth', `Private API rejected unauthenticated request with ${result.status}`);
    } else {
      reporter.fail(pathname, 'auth', 'Private API must reject unauthenticated requests with 401/403', '401/403', String(result.status));
    }
    return null;
  }

  return auditHtml(pathname, result.text, result.status);
}

async function crawlSsr() {
  const reachable = new Set(['/']);
  const visited = new Set();
  const queue = ['/'];

  while (queue.length && visited.size < 500) {
    const route = queue.shift();
    if (!route || visited.has(route)) {
      continue;
    }
    visited.add(route);
    const parsed = await auditSsrRoute(route, route !== '/');
    if (!parsed) {
      continue;
    }

    for (const href of parsed.hrefs) {
      const next = sameOriginPath(href, `${crawlOrigin}${route}`);
      if (!next || next.startsWith('/_next')) {
        continue;
      }
      const nextPath = next.split('?')[0] || '/';
      if (isPrivatePath(nextPath)) {
        reporter.fail(route, 'private-leak', `Public page links to private route ${nextPath}`);
        continue;
      }
      reachable.add(normalizedPath(nextPath));
      if (!visited.has(next)) {
        queue.push(next);
      }
    }
  }

  const registeredPublic = [...config.routes.publicMarketing, ...config.routes.publicUtility, ...(config.routes.dynamicPublic ?? [])];
  for (const route of registeredPublic) {
    if (!visited.has(route)) {
      await auditSsrRoute(route, false);
    }
  }
  for (const route of config.routes.publicMarketing) {
    if (route !== '/' && !reachable.has(normalizedPath(route))) {
      reporter.warn(route, 'orphan', 'Indexable route was not reachable from / through public internal links');
    }
  }
  for (const route of config.routes.privatePages) {
    await auditSsrRoute(route, false);
  }
  for (const route of config.routes.privateApis) {
    await auditSsrRoute(route, false);
  }
}

function walkHtml(dir, output = []) {
  if (!existsSync(dir)) {
    return output;
  }
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtml(full, output);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      output.push(full);
    }
  }
  return output;
}

function staticRouteForFile(dir, file) {
  let relative = path.relative(dir, file).replaceAll('\\', '/');
  relative = relative.replace(/\/index\.html$/, '').replace(/\.html$/, '');
  if (relative === 'index' || relative === '') {
    return '/';
  }
  return normalizedPath(`/${relative}`);
}

async function crawlStatic(dir) {
  const files = walkHtml(dir);
  if (!files.length) {
    reporter.fail('/', 'static-export', `No HTML files found in ${dir}`);
    return;
  }

  const seen = new Set();
  for (const file of files) {
    const route = staticRouteForFile(dir, file);
    seen.add(route);
    await auditHtml(route, readFileSync(file, 'utf8'), 200);
  }

  for (const route of [...config.routes.publicMarketing, ...config.routes.publicUtility]) {
    if (!seen.has(normalizedPath(route))) {
      reporter.fail(route, 'static-route', 'Registered public route missing from static output');
    }
  }

  const robotsPath = path.join(dir, 'robots.txt');
  if (existsSync(robotsPath)) {
    validateRobotsText(readFileSync(robotsPath, 'utf8'));
  } else {
    reporter.fail('/robots.txt', 'static-export', 'robots.txt missing from static output');
  }

  const sitemapPath = path.join(dir, 'sitemap.xml');
  if (existsSync(sitemapPath)) {
    await auditSitemap(readFileSync(sitemapPath, 'utf8'), 'static');
  } else {
    reporter.fail('/sitemap.xml', 'static-export', 'sitemap.xml missing from static output');
  }
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
    } else {
      validateRobotsText(robots.text);
    }

    const sitemap = await fetchRaw(`${crawlOrigin}/sitemap.xml`, 'follow');
    if (sitemap.status !== 200) {
      reporter.fail('/sitemap.xml', 'http', `HTTP ${sitemap.status}`);
    } else {
      await auditSitemap(sitemap.text, 'ssr');
    }

    await crawlSsr();
  });
}

checkDuplicateTitles();
const report = reporter.write(root);
if (report.failCount > 0) {
  console.error(`SEO post-build failed with ${report.failCount} issue(s). See reports/seo-audit.txt`);
  process.exit(1);
}

console.log(`SEO post-build passed with ${report.warnCount} warning(s).`);
