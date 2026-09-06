import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export function createReporter() {
  const findings = [];

  const add = (severity, route, check, reason, expected = '', actual = '') => {
    findings.push({ severity, route, check, reason, expected, actual });
  };

  return {
    fail: (route, check, reason, expected = '', actual = '') => add('FAIL', route, check, reason, expected, actual),
    warn: (route, check, reason, expected = '', actual = '') => add('WARN', route, check, reason, expected, actual),
    pass: (route, check, reason, expected = '', actual = '') => add('PASS', route, check, reason, expected, actual),
    findings: () => findings,
    write(root) {
      const dir = path.join(root, 'reports');
      mkdirSync(dir, { recursive: true });
      const fails = findings.filter(item => item.severity === 'FAIL');
      const warns = findings.filter(item => item.severity === 'WARN');
      const report = {
        result: fails.length ? 'FAIL' : 'PASS',
        failCount: fails.length,
        warnCount: warns.length,
        findings,
      };
      writeFileSync(path.join(dir, 'seo-audit.json'), `${JSON.stringify(report, null, 2)}\n`);
      const lines = [
        `SEO audit: ${report.result}`,
        `FAIL: ${fails.length}`,
        `WARN: ${warns.length}`,
        '',
        ...findings.map(item => `[${item.severity}] ${item.route} · ${item.check} · ${item.reason}`),
      ];
      writeFileSync(path.join(dir, 'seo-audit.txt'), `${lines.join('\n')}\n`);
      return report;
    },
  };
}

export function walkFiles(dir, matcher, output = []) {
  if (!existsSync(dir)) {
    return output;
  }
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.next', 'coverage', 'reports', 'test-results'].includes(entry.name)) {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, matcher, output);
      continue;
    }
    if (statSync(full).isFile() && matcher(entry.name, full)) {
      output.push(full);
    }
  }
  return output;
}

export function fileToAppRoute(relativePath) {
  let value = relativePath.replaceAll('\\', '/');
  value = value.replace(/^src\/app\//, '').replace(/^app\//, '');
  value = value.replace(/^src\/pages\//, '').replace(/^pages\//, '');
  value = value.replace(/\/page\.(tsx|ts|jsx|js)$/, '');
  value = value.replace(/\/route\.(ts|js)$/, '');
  value = value.replace(/\.(tsx|ts|jsx|js|mdx|md|astro|html)$/, '');
  value = value.replace(/\/index$/, '');
  value = value.replace(/\/\([^/]+\)/g, '');
  value = value.replace(/\[locale\]\/?/g, '');
  value = value.replace(/\[\[\.{3}[^\]]+\]\]\/?/g, '');
  value = value.replace(/\[\.{3}[^\]]+\]\/?/g, '');
  value = value.replace(/\[[^\]]+\]/g, '*');
  value = value.replace(/\/{2,}/g, '/').replace(/^\/+|\/+$/g, '');
  if (!value || value === 'page' || value === '*') {
    return '/';
  }
  return `/${value}`.replace(/\/\*/g, '/*');
}

export function routeExists(registered, discovered) {
  const target = registered.replace(/\/$/, '') || '/';
  return discovered.some((item) => {
    const route = item.replace(/\/$/, '') || '/';
    if (route === target) {
      return true;
    }
    if (target !== '/' && route.startsWith(`${target}/`)) {
      return true;
    }
    if (route.endsWith('/*')) {
      const prefix = route.slice(0, -2);
      return target === prefix || target.startsWith(`${prefix}/`);
    }
    return false;
  });
}
