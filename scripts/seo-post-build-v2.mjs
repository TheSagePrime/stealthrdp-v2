#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createReporter } from './seo-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = relative => pathToFileURL(path.join(root, relative)).href;
const { defaultSeoConfig } = await import(src('src/config/seo.ts'));
const { AllLocales } = await import(src('src/config/i18n.ts'));
const { resolveDeployEnv, isProductionDeployEnv } = await import(src('src/libs/seo/env.ts'));
const { resolveSiteUrl } = await import(src('src/libs/seo/site-url.ts'));
const { canonicalUrlForPath, normalizePathname } = await import(src('src/libs/seo/normalize.ts'));
const { classifyPath } = await import(src('src/libs/seo/classify.ts'));
const { localizedRoutePaths, stripLocalePrefix } = await import(src('src/libs/seo/locale.ts'));
const { articlePathFor, findArticleForPath, isIndexableArticle, validateArticleHtml, validateArticleIndexHtml, validateArticleSitemapXml } = await import(
  src('src/libs/seo/articles.ts'),
);
const { validateInternalLinks, findNonCanonicalInternalLinks } = await import(src('src/libs/seo/internal-links.ts'));
const { validateArticleRssXml } = await import(src('src/libs/seo/article-rss.ts'));

const reporter = createReporter();
const deployEnv = resolveDeployEnv(process.env);
const config = { ...defaultSeoConfig, environment: { deployEnv } };
const site = resolveSiteUrl(process.env, deployEnv);
config.siteUrl = site.origin;
const crawlOrigin = 'http://127.0.0.1:3123';
const titleRoutes = new Map();

const normalizedPath = value => normalizePathname(value || '/', config.url.trailingSlash);
const localized = routes => [...new Set(routes.flatMap(route => localizedRoutePaths(route, config)))];
const marketingRoutes = localized([...config.routes.publicMarketing, ...(config.routes.dynamicPublic ?? [])]);
const utilityRoutes = localized(config.routes.publicUtility);
const privatePageRoutes = localized(config.routes.privatePages);
const privateApiRoutes = [...config.routes.privateApis];
const publicRoutes = [...new Set([...marketingRoutes, ...utilityRoutes])];

function routeLocale(pathname) {
  return stripLocalePrefix(pathname, config).locale ?? 'default';
}

function isPrivatePath(pathname) {
  const routeClass = classifyPath(pathname, config);
  return routeClass === 'privatePage' || routeClass === 'privateApi';
}

function extract(html, expression, flags = 'i') {
  return html.match(new RegExp(expression, flags))?.[1] || '';
}

function parseHtml(html) {
  const alternates = {};
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    if (!/\brel=["']alternate["']/i.test(tag) || !/\bhreflang=/i.test(tag)) {
      continue;
    }
    const lang = extract(tag, 'hreflang=["\']([^"\']+)["\']');
    const href = extract(tag, 'href=["\']([^"\']+)["\']');
    if (lang && href) {
      alternates[lang] = href;
    }
  }

  return {
    title: extract(html, '<title[^>]*>([\\s\\S]*?)</title>').trim(),
    description: extract(html, '<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)["\']')
      || extract(html, '<meta[^>]+content=["\']([^"\']*)["\'][^>]+name=["\']description["\']'),
    canonical: extract(html, '<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']')
      || extract(html, '<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']canonical["\']'),
    robots: extract(html, '<meta[^>]+name=["\']robots["\'][^>]+content=["\']([^"\']+)["\']').toLowerCase(),
    ogUrl: extract(html, '<meta[^>]+property=["\']og:url["\'][^>]+content=["\']([^"\']+)["\']'),
    jsonLd: [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(match => match[1]),
    hrefs: [...html.matchAll(/<a\b[^>]+\bhref=["']([^"']+)["'][^>]*>/gi)].map(match => match[1]),
    alternates,
  };
}

function sameSitePath(value, base) {
  try {
    const url = new URL(value, base);
    if (![new URL(base).origin, site.origin, crawlOrigin].includes(url.origin)) {
      return null;
    }
    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
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
  for (const candidate of values) {
    const leaked = privateReference(candidate);
    if (leaked) {
      reporter.fail(route, 'private-leak', `${label} references private URL ${leaked}`, '', candidate);
    }
  }
}

async function fetchRaw(url, redirect = 'manual') {
  const response = await fetch(url, {
    redirect,
    headers: { 'user-agent': 'sage-prime-seo-audit' },
  });
  return {
    response,
    text: await response.text(),
    status: response.status,
    location: response.headers.get('location') || '',
  };
}

function recordTitle(route, title) {
  if (!title || classifyPath(route, config) !== 'publicMarketing') {
    return;
  }
  const key = `${routeLocale(route)}:${title.trim().toLowerCase()}`;
  const routes = titleRoutes.get(key) ?? [];
  routes.push(route);
  titleRoutes.set(key, routes);
}

function validateRobotsMeta(route, routeClass, robots) {
  const tokens = new Set(robots.split(',').map(item => item.trim()).filter(Boolean));
  if (routeClass === 'publicMarketing' && (tokens.has('noindex') || tokens.has('nofollow'))) {
    reporter.fail(route, 'robots-meta', 'Marketing route must be index, follow', 'index, follow', robots);
  }
  if (routeClass === 'publicUtility') {
    if (!tokens.has('noindex')) {
      reporter.fail(route, 'robots-meta', 'Utility route must be noindex', 'noindex, follow', robots);
    }
    if (tokens.has('nofollow')) {
      reporter.fail(route, 'robots-meta', 'Utility route must remain followable', 'noindex, follow', robots);
    }
  }
}

function validateAlternates(route, parsed) {
  if (AllLocales.length <= 1 || classifyPath(route, config) !== 'publicMarketing') {
    return;
  }
  const logical = stripLocalePrefix(route, config).path;
  for (const locale of AllLocales) {
    const expectedPath = localizedRoutePaths(logical, config).find(candidate => routeLocale(candidate) === locale)
      ?? localizedRoutePaths(logical, config)[0];
    const expected = canonicalUrlForPath(expectedPath, site, config);
    if (parsed.alternates[locale] !== expected) {
      reporter.fail(route, 'hreflang', `Missing or incorrect hreflang ${locale}`, expected, parsed.alternates[locale] || '');
    }
  }
}

async function auditHtml(route, html, status) {
  const pathname = normalizedPath(route.split('?')[0] || '/');
  const routeClass = classifyPath(pathname, config);
  const parsed = parseHtml(html);

  if (status === 404 || status >= 500) {
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

  const article = findArticleForPath(pathname, config);
  if (article) {
    for (const issue of validateArticleHtml(article, html, config)) {
      reporter.fail(pathname, `article-${issue.code}`, issue.message);
    }
  }
  const nonCanonicalIssues = findNonCanonicalInternalLinks(
    parsed.hrefs,
    site.origin,
    config.url.trailingSlash,
    config.url.trackingParams,
  );
  for (const issue of nonCanonicalIssues) {
    reporter.fail(
      pathname,
      'non-canonical-internal-link',
      `Internal link is not canonical; link directly to ${issue.canonical}`,
      issue.canonical,
      issue.href,
    );
  }
  const legacyIssues = validateInternalLinks(
    html,
    config.url.legacyRedirects ?? [],
    site.origin,
    config.url.trailingSlash,
  );
  for (const issue of legacyIssues) {
    const report = config.url.legacyInternalLinkPolicy === 'warn' ? reporter.warn : reporter.fail;
    report(
      pathname,
      'legacy-internal-link',
      `Internal link uses legacy redirect ${issue.from}; link directly to ${issue.to}`,
      issue.to,
      issue.href,
    );
  }

  if (!parsed.title) {
    reporter.fail(pathname, 'title', 'Missing <title>');
  } else {
    recordTitle(pathname, parsed.title);
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
    const expected = canonicalUrlForPath(pathname, site, config);
    if (!parsed.canonical) {
      reporter.fail(pathname, 'canonical', 'Missing canonical');
    } else {
      try {
        const canonical = new URL(parsed.canonical);
        if (canonical.origin !== site.origin) {
          reporter.fail(pathname, 'canonical', 'Wrong canonical origin', site.origin, canonical.origin);
        }
        if (canonicalUrlForPath(canonical.pathname, site, config) !== expected) {
          reporter.fail(pathname, 'canonical', 'Canonical does not match localized route', expected, parsed.canonical);
        }
        if (isProductionDeployEnv(deployEnv) && canonical.protocol !== 'https:') {
          reporter.fail(pathname, 'canonical', 'HTTP canonical in production', expected, parsed.canonical);
        }
      } catch {
        reporter.fail(pathname, 'canonical', 'Canonical is not an absolute valid URL', expected, parsed.canonical);
      }
    }
    validateAlternates(pathname, parsed);
  }

  leakCheck(pathname, 'canonical', parsed.canonical);
  leakCheck(pathname, 'og:url', parsed.ogUrl);
  for (const href of parsed.hrefs) {
    leakCheck(pathname, 'internal link', href);
  }
  for (const block of parsed.jsonLd) {
    try {
      leakCheck(pathname, 'json-ld', JSON.parse(block));
    } catch {
      reporter.fail(pathname, 'json-ld', 'Unparseable JSON-LD');
    }
  }

  return parsed;
}

function checkDuplicateTitles() {
  for (const routes of titleRoutes.values()) {
    const unique = [...new Set(routes)];
    if (unique.length > 1) {
      for (const route of unique) {
        reporter.fail(route, 'duplicate-title', `Duplicate title in same locale: ${unique.join(', ')}`);
      }
    }
  }
}

function validateRobotsText(text) {
  if (!isProductionDeployEnv(deployEnv)) {
    if (!/disallow:\s*\/\s*$/im.test(text)) {
      reporter.fail('/robots.txt', 'robots', 'Non-production robots.txt must disallow all crawling');
    }
    return;
  }
  if (!text.includes(`${site.origin}/sitemap.xml`)) {
    reporter.fail('/robots.txt', 'robots-sitemap', 'robots.txt must reference canonical sitemap URL');
  }
  for (const route of config.routes.privatePages) {
    if (route !== '/' && !text.includes(`Disallow: ${route}`)) {
      reporter.fail('/robots.txt', 'robots-private', `Missing private route exclusion ${route}`);
    }
  }
}

async function auditSitemap(text, runtime) {
  const locs = [...text.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(match => match[1].trim());
  const expected = [
    ...marketingRoutes.map(route => canonicalUrlForPath(route, site, config)),
    ...config.articles.publications
      .filter(article => isIndexableArticle(article, config))
      .map(article => canonicalUrlForPath(articlePathFor(article, config), site, config)),
  ];

  for (const url of expected) {
    if (!locs.some(loc => loc.replace(/\/$/, '') === url.replace(/\/$/, ''))) {
      reporter.fail('/sitemap.xml', 'sitemap-missing', 'Indexable localized URL missing from sitemap', url);
    }
  }

  for (const loc of locs) {
    let url;
    try {
      url = new URL(loc);
    } catch {
      reporter.fail('/sitemap.xml', 'sitemap-url', 'Malformed sitemap URL', '', loc);
      continue;
    }
    if (url.origin !== site.origin) {
      reporter.fail('/sitemap.xml', 'sitemap-origin', 'Sitemap URL is not on SITE_URL origin', site.origin, url.origin);
    }
    if (classifyPath(url.pathname, config) !== 'publicMarketing') {
      reporter.fail('/sitemap.xml', 'sitemap-class', 'Only indexable marketing URLs may appear in sitemap', 'publicMarketing', url.pathname);
    }
    leakCheck('/sitemap.xml', 'sitemap', loc);

    if (runtime === 'ssr' && url.origin === site.origin) {
      const result = await fetchRaw(`${crawlOrigin}${url.pathname}${url.search}`, 'manual');
      if ([301, 302, 307, 308].includes(result.status)) {
        reporter.fail('/sitemap.xml', 'sitemap-redirect', 'Sitemap URL redirects', '200', `${result.status} ${result.location}`);
      } else if (result.status !== 200) {
        reporter.fail('/sitemap.xml', 'sitemap-http', 'Sitemap URL must return 200', '200', String(result.status));
      } else {
        const parsed = parseHtml(result.text);
        const expectedCanonical = canonicalUrlForPath(url.pathname, site, config);
        if (/noindex/i.test(parsed.robots)) {
          reporter.fail('/sitemap.xml', 'sitemap-noindex', 'Sitemap URL is noindex', '', loc);
        }
        if (parsed.canonical !== expectedCanonical) {
          reporter.fail('/sitemap.xml', 'sitemap-canonical', 'Sitemap URL is not self-canonical', expectedCanonical, parsed.canonical);
        }
      }
    }
  }

  for (const issue of validateArticleSitemapXml(text, config, site)) {
    reporter.fail('/sitemap.xml', `article-${issue.code}`, issue.message);
  }
}

async function auditSsrRoute(route, fromLink = false) {
  const pathname = normalizedPath(route.split('?')[0] || '/');
  const routeClass = classifyPath(pathname, config);
  const result = await fetchRaw(`${crawlOrigin}${route}`, 'manual');

  if ([301, 302, 307, 308].includes(result.status)) {
    if (routeClass === 'privatePage' && /sign-in|login/i.test(result.location)) {
      reporter.pass(pathname, 'auth', `Private page redirected to login with ${result.status}`);
      return null;
    }
    if (fromLink) {
      reporter.fail(pathname, 'internal-redirect', 'Internal link points to a redirect', 'final URL', result.location);
    } else {
      reporter.fail(pathname, 'redirect', 'Registered route redirects instead of returning its final response', '200', `${result.status} ${result.location}`);
    }
    return null;
  }

  if (routeClass === 'privateApi') {
    if (result.status === 401 || result.status === 403) {
      reporter.pass(pathname, 'auth', `Private API rejected unauthenticated request with ${result.status}`);
    } else {
      reporter.fail(pathname, 'auth', 'Private API must return 401/403 unauthenticated', '401/403', String(result.status));
    }
    return null;
  }

  return auditHtml(pathname, result.text, result.status);
}

async function crawlSsr() {
  const visited = new Set();
  const reachable = new Set();
  const queue = [...publicRoutes];

  while (queue.length && visited.size < 500) {
    const route = queue.shift();
    if (!route || visited.has(route)) {
      continue;
    }
    visited.add(route);
    const parsed = await auditSsrRoute(route, false);
    if (!parsed) {
      continue;
    }
    reachable.add(normalizedPath(route));

    for (const href of parsed.hrefs) {
      const next = sameSitePath(href, `${crawlOrigin}${route}`);
      if (!next || next.startsWith('/_next')) {
        continue;
      }
      const nextPath = normalizedPath(next.split('?')[0] || '/');
      if (isPrivatePath(nextPath)) {
        reporter.fail(route, 'private-leak', `Public page links to private route ${nextPath}`);
        continue;
      }
      if (nextPath.startsWith('/api/')) {
        const api = await fetchRaw(`${crawlOrigin}${next}`, 'manual');
        if (api.status === 404 || api.status >= 500) {
          reporter.fail(route, 'broken-link', `Linked API returned ${api.status}`, '', nextPath);
        }
        continue;
      }
      if (!visited.has(next)) {
        queue.push(next);
      }
    }
  }

  for (const article of config.articles.publications) {
    const articleRoute = normalizedPath(articlePathFor(article, config));
    if (visited.has(articleRoute)) {
      continue;
    }
    const parsed = await auditSsrRoute(articleRoute, false);
    if (parsed) {
      visited.add(articleRoute);
      reachable.add(articleRoute);
    }
  }

  if (config.articles.publications.some(article => isIndexableArticle(article, config))) {
    const articleIndexRoute = normalizedPath(config.articles.basePath);
    const indexResult = await fetchRaw(`${crawlOrigin}${articleIndexRoute}`, 'manual');
    if ([301, 302, 307, 308].includes(indexResult.status)) {
      reporter.fail(articleIndexRoute, 'article-index-redirect', 'Article index route redirects instead of serving its canonical URL', '200', indexResult.location);
    } else if (indexResult.status !== 200) {
      reporter.fail(articleIndexRoute, 'article-index-http', 'Article index route must return 200', '200', String(indexResult.status));
    } else {
      if (!visited.has(articleIndexRoute)) {
        await auditHtml(articleIndexRoute, indexResult.text, indexResult.status);
        visited.add(articleIndexRoute);
      }
      for (const issue of validateArticleIndexHtml(indexResult.text, config, site)) {
        reporter.fail(articleIndexRoute, `article-${issue.code}`, issue.message);
      }
    }
  }

  for (const route of marketingRoutes) {
    if (route !== '/' && !reachable.has(normalizedPath(route))) {
      reporter.warn(route, 'orphan', 'Indexable localized route was not reachable through public links');
    }
  }
  for (const route of privatePageRoutes) {
    await auditSsrRoute(route, false);
  }
  for (const route of privateApiRoutes) {
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
  const relative = path.relative(dir, file).replaceAll('\\', '/').replace(/\/index\.html$/, '').replace(/\.html$/, '');
  return relative === 'index' || relative === '' ? '/' : normalizedPath(`/${relative}`);
}

async function crawlStatic(dir) {
  const files = walkHtml(dir);
  const seen = new Set();
  for (const file of files) {
    const route = staticRouteForFile(dir, file);
    seen.add(route);
    await auditHtml(route, readFileSync(file, 'utf8'), 200);
  }
  for (const route of publicRoutes) {
    if (!seen.has(normalizedPath(route))) {
      reporter.fail(route, 'static-route', 'Registered localized public route missing from static output');
    }
  }

  if (config.articles.publications.some(article => isIndexableArticle(article, config))) {
    const articleIndexRoute = normalizedPath(config.articles.basePath);
    const indexFile = files.find(file => staticRouteForFile(dir, file) === articleIndexRoute);
    if (!indexFile) {
      reporter.fail(articleIndexRoute, 'article-index-static-route', 'Article index route missing from static output');
    } else {
      for (const issue of validateArticleIndexHtml(readFileSync(indexFile, 'utf8'), config, site)) {
        reporter.fail(articleIndexRoute, `article-${issue.code}`, issue.message);
      }
    }
  }

  const robots = path.join(dir, 'robots.txt');
  const sitemap = path.join(dir, 'sitemap.xml');
  if (existsSync(robots)) {
    validateRobotsText(readFileSync(robots, 'utf8'));
  } else {
    reporter.fail('/robots.txt', 'static-export', 'robots.txt missing');
  }
  if (existsSync(sitemap)) {
    await auditSitemap(readFileSync(sitemap, 'utf8'), 'static');
  } else {
    reporter.fail('/sitemap.xml', 'static-export', 'sitemap.xml missing');
  }
  const feed = path.join(dir, config.articles.feedPath.replace(/^\/+/, ''));
  if (!existsSync(feed)) {
    reporter.fail(config.articles.feedPath, 'static-export', 'Article feed missing from static output');
  } else {
    for (const issue of validateArticleRssXml(readFileSync(feed, 'utf8'), config, site)) {
      reporter.fail(config.articles.feedPath, `article-${issue.code}`, issue.message);
    }
  }
}

function detectStaticDir() {
  for (const name of ['out', 'dist']) {
    const dir = path.join(root, name);
    if (existsSync(dir) && walkHtml(dir).length) {
      return dir;
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
      request.on('error', () => Date.now() - started > timeoutMs ? reject(new Error(`Timed out waiting for ${url}`)) : setTimeout(probe, 400));
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
    if (child.exitCode === null) {
      try {
        process.kill(-child.pid, 'SIGTERM');
      } catch {
        child.kill('SIGTERM');
      }
    }
  }
}

const staticDir = detectStaticDir();
if (staticDir) {
  await crawlStatic(staticDir);
} else {
  await withServer(async () => {
    const robots = await fetchRaw(`${crawlOrigin}/robots.txt`, 'follow');
    if (robots.status === 200) {
      validateRobotsText(robots.text);
    } else {
      reporter.fail('/robots.txt', 'http', `HTTP ${robots.status}`);
    }
    const sitemap = await fetchRaw(`${crawlOrigin}/sitemap.xml`, 'follow');
    if (sitemap.status === 200) {
      await auditSitemap(sitemap.text, 'ssr');
    } else {
      reporter.fail('/sitemap.xml', 'http', `HTTP ${sitemap.status}`);
    }
    const feed = await fetchRaw(`${crawlOrigin}${config.articles.feedPath}`, 'manual');
    if (feed.status !== 200) {
      reporter.fail(config.articles.feedPath, 'rss', `Article feed returned HTTP ${feed.status}`);
    } else {
      for (const issue of validateArticleRssXml(feed.text, config, site)) {
        reporter.fail(config.articles.feedPath, `article-${issue.code}`, issue.message);
      }
    }
    await crawlSsr();
  });
}

checkDuplicateTitles();
const report = reporter.write(root);
if (report.failCount) {
  console.error(`SEO post-build failed with ${report.failCount} issue(s). See reports/seo-audit.txt`);
  process.exit(1);
}
console.log(`SEO post-build passed with ${report.warnCount} warning(s).`);
