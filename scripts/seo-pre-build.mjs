#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createReporter, fileToAppRoute, routeExists, walkFiles } from './seo-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = relative => pathToFileURL(path.join(root, relative)).href;

const { defaultSeoConfig } = await import(src('src/config/seo.ts'));
const { resolveDeployEnv, isProductionDeployEnv } = await import(src('src/libs/seo/env.ts'));
const { resolveSiteUrl } = await import(src('src/libs/seo/site-url.ts'));
const { normalizePathname } = await import(src('src/libs/seo/normalize.ts'));
const { classifyPath } = await import(src('src/libs/seo/classify.ts'));
const { articlePathFor, validateArticlePublication } = await import(src('src/libs/seo/articles.ts'));

const reporter = createReporter();
const deployEnv = resolveDeployEnv(process.env);
const config = {
  ...defaultSeoConfig,
  environment: { deployEnv },
};

try {
  const site = resolveSiteUrl(process.env, deployEnv);
  config.siteUrl = site.origin;
  reporter.pass('/', 'site-url', `Resolved SITE_URL to ${site.origin}`);
} catch (error) {
  reporter.fail('/', 'site-url', error instanceof Error ? error.message : String(error));
}

const groups = [
  'publicMarketing',
  'publicUtility',
  'publicApis',
  'privatePages',
  'privateApis',
  'webhookApis',
  'systemApis',
  'dynamicPublic',
];
const apiGroups = ['publicApis', 'privateApis', 'webhookApis', 'systemApis'];
const apiClasses = new Set(['publicApi', 'privateApi', 'webhookApi', 'systemApi']);
const seen = new Map();

function validateRoute(route, group) {
  if (typeof route !== 'string' || !route.startsWith('/') || /\s/.test(route)) {
    reporter.fail(String(route), 'route-format', `Invalid ${group} route`, '/path', String(route));
    return;
  }
  if (/[A-Z]/.test(route)) {
    reporter.fail(route, 'route-case', 'Configured paths must be lowercase');
  }
  const normalized = normalizePathname(route, config.url.trailingSlash);
  if (normalized !== route) {
    reporter.fail(route, 'trailing-slash', 'Route does not match trailing-slash policy', normalized, route);
  }
  const previous = seen.get(route);
  if (previous) {
    reporter.fail(route, 'duplicate-route', `Route registered in both ${previous} and ${group}`);
  } else {
    seen.set(route, group);
  }
}

for (const group of groups) {
  for (const route of config.routes[group] ?? []) {
    validateRoute(route, group);
  }
}

function prefixesOverlap(left, right) {
  if (left === right) return true;
  if (left === '/' || right === '/') return false;
  return left.startsWith(`${right}/`) || right.startsWith(`${left}/`);
}

for (let leftIndex = 0; leftIndex < apiGroups.length; leftIndex += 1) {
  const leftGroup = apiGroups[leftIndex];
  for (let rightIndex = leftIndex + 1; rightIndex < apiGroups.length; rightIndex += 1) {
    const rightGroup = apiGroups[rightIndex];
    for (const leftRoute of config.routes[leftGroup] ?? []) {
      for (const rightRoute of config.routes[rightGroup] ?? []) {
        if (prefixesOverlap(leftRoute, rightRoute)) {
          reporter.fail(
            leftRoute,
            'api-route-conflict',
            `API route overlaps ${rightGroup}: ${rightRoute}`,
          );
        }
      }
    }
  }
}

for (const marketing of config.routes.publicMarketing) {
  for (const utility of config.routes.publicUtility) {
    if (marketing === utility) {
      reporter.fail(marketing, 'route-conflict', 'Public marketing and utility routes overlap');
    }
  }
}

const privatePrefixes = [...config.routes.privatePages, ...config.routes.privateApis];
for (const publicRoute of [
  ...config.routes.publicMarketing,
  ...config.routes.publicUtility,
  ...(config.routes.dynamicPublic ?? []),
]) {
  for (const prefix of privatePrefixes) {
    if (publicRoute === prefix || (prefix !== '/' && publicRoute.startsWith(`${prefix}/`))) {
      reporter.fail(publicRoute, 'private-overlap', `Public route overlaps private prefix ${prefix}`);
    }
  }
}

if (config.brand?.logoUrl && !config.brand.companyName) {
  reporter.fail('/', 'schema', 'logoUrl requires brand.companyName');
}
if (config.softwareApp && !config.projectName) {
  reporter.fail('/', 'schema', 'softwareApp requires projectName');
}

const appDir = path.join(root, 'src/app');
const pagesDir = path.join(root, 'src/pages');
const files = [
  ...walkFiles(appDir, name => /^(?:page|route)\.(?:tsx|ts|jsx|js)$/.test(name)),
  ...walkFiles(pagesDir, name => /\.(?:tsx|ts|jsx|js|mdx)$/.test(name)),
];
const discovered = files.map(file => fileToAppRoute(path.relative(root, file)));
const frameworkPatterns = files.map((file) => {
  let value = path.relative(root, file).replaceAll('\\', '/');
  value = value.replace(/^src\/app\//, '').replace(/^app\//, '');
  value = value.replace(/\/page\.(tsx|ts|jsx|js)$/, '');
  value = value.replace(/\/route\.(ts|js)$/, '');
  value = value.replace(/\/\([^/]+\)/g, '').replace(/\/{2,}/g, '/');
  value = value.replace(/^\/+|\/+$/g, '');
  return value ? `/${value}` : '/';
});

function frameworkRouteMatches(pathname, routePattern) {
  const pathSegments = pathname.split('/').filter(Boolean);
  const patternSegments = routePattern.split('/').filter(Boolean);
  let pathIndex = 0;

  for (const segment of patternSegments) {
    if (segment.startsWith('[[...') && segment.endsWith(']]')) {
      return true;
    }
    if (segment.startsWith('[...') && segment.endsWith(']')) {
      return pathIndex < pathSegments.length;
    }
    if (pathIndex >= pathSegments.length) {
      return false;
    }
    if (!segment.startsWith('[') && segment !== pathSegments[pathIndex]) {
      return false;
    }
    pathIndex += 1;
  }

  return pathIndex === pathSegments.length;
}

function routePatternExists(pathname, routes) {
  return routeExists(pathname, routes) || routes.some(route => frameworkRouteMatches(pathname, route));
}

const seoInfrastructureRoutes = new Set([
  normalizePathname(config.articles.feedPath, config.url.trailingSlash),
]);

for (const route of discovered) {
  const normalizedRoute = normalizePathname(route, config.url.trailingSlash);
  if (seoInfrastructureRoutes.has(normalizedRoute)) {
    continue;
  }

  const representativePath = normalizedRoute.replaceAll('*', '__dynamic__');
  const routeClass = classifyPath(representativePath, config);
  const isApiRoute = representativePath.startsWith('/api/');
  const isApiClass = apiClasses.has(routeClass);

  if (routeClass === 'unknown') {
    reporter.fail(
      normalizedRoute,
      'route-classification',
      'Framework route is not registered in src/config/seo.ts',
    );
    continue;
  }

  if (isApiRoute && !isApiClass) {
    reporter.fail(
      normalizedRoute,
      'api-route-classification',
      `API route is classified as ${routeClass} instead of an API class`,
    );
  }
  if (!isApiRoute && isApiClass) {
    reporter.fail(
      normalizedRoute,
      'route-classification',
      `Non-API route is classified as ${routeClass}`,
    );
  }
}

const articlePaths = new Set();
for (const article of config.articles.publications) {
  for (const issue of validateArticlePublication(article, config)) {
    reporter.fail(article.slug, `article-${issue.code}`, issue.message);
  }
  const articlePath = articlePathFor(article, config);
  if (articlePaths.has(articlePath)) {
    reporter.fail(articlePath, 'article-duplicate', 'Article path is registered more than once');
  }
  articlePaths.add(articlePath);
  if (!routePatternExists(articlePath, [...discovered, ...frameworkPatterns])) {
    reporter.fail(articlePath, 'article-route-existence', 'Article registry entry has no matching framework route');
  }
}
if (!routeExists(config.articles.feedPath, discovered)) {
  reporter.fail(
    config.articles.feedPath,
    'rss-route-existence',
    'Configured article feed has no matching framework route',
  );
}

for (const group of [
  'publicMarketing',
  'publicUtility',
  'publicApis',
  'privatePages',
  'privateApis',
  'webhookApis',
  'systemApis',
]) {
  for (const route of config.routes[group]) {
    if (!route.includes('*') && !routeExists(route, discovered)) {
      reporter.fail(route, 'route-existence', `Configured ${group} route does not match a framework route`);
    }
  }
}

if (isProductionDeployEnv(deployEnv) && config.siteUrl.startsWith('http://') && !/^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/i.test(config.siteUrl)) {
  reporter.fail('/', 'site-url', 'Production SITE_URL must use HTTPS', 'https://', config.siteUrl);
}

const report = reporter.write(root);
if (report.failCount > 0) {
  console.error(`SEO pre-build failed with ${report.failCount} issue(s). See reports/seo-audit.txt`);
  process.exit(1);
}

console.log(`SEO pre-build passed (${discovered.length} framework routes discovered).`);
