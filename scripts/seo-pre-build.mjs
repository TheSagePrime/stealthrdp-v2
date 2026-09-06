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

const groups = ['publicMarketing', 'publicUtility', 'privatePages', 'privateApis', 'dynamicPublic'];
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

for (const marketing of config.routes.publicMarketing) {
  for (const utility of config.routes.publicUtility) {
    if (marketing === utility) {
      reporter.fail(marketing, 'route-conflict', 'Public marketing and utility routes overlap');
    }
  }
}

const privatePrefixes = [...config.routes.privatePages, ...config.routes.privateApis];
for (const publicRoute of [...config.routes.publicMarketing, ...config.routes.publicUtility, ...(config.routes.dynamicPublic ?? [])]) {
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

for (const group of ['publicMarketing', 'publicUtility', 'privatePages', 'privateApis']) {
  for (const route of config.routes[group]) {
    if (!route.includes('*') && !routeExists(route, discovered)) {
      reporter.fail(route, 'route-existence', `Configured ${group} route does not match a framework route`);
    }
  }
}

if (isProductionDeployEnv(deployEnv) && config.siteUrl.startsWith('http://')) {
  reporter.fail('/', 'site-url', 'Production SITE_URL must use HTTPS', 'https://', config.siteUrl);
}

const report = reporter.write(root);
if (report.failCount > 0) {
  console.error(`SEO pre-build failed with ${report.failCount} issue(s). See reports/seo-audit.txt`);
  process.exit(1);
}

console.log(`SEO pre-build passed (${discovered.length} framework routes discovered).`);
