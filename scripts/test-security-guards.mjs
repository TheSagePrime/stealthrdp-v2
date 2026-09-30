import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

function expectFailure(label, mutate, restore) {
  mutate();
  const result = spawnSync(process.execPath, ['scripts/check-security-contract.mjs'], { encoding: 'utf8' });
  restore();
  if (result.status === 0) {
    console.error(`[security-self-test] expected rejection was not detected: ${label}`);
    process.exitCode = 1;
    return;
  }
  console.log(`[security-self-test] rejected as expected: ${label}`);
}

const packagePath = 'package.json';
const marketingPath = 'src/app/[locale]/(marketing)/page.tsx';
const sentryPath = 'src/instrumentation-client.ts';
const proxyPath = 'src/proxy.ts';
const dbPath = 'src/utils/DBConnection.ts';
const packageOriginal = fs.readFileSync(packagePath, 'utf8');
const marketingOriginal = fs.readFileSync(marketingPath, 'utf8');
const sentryOriginal = fs.readFileSync(sentryPath, 'utf8');
const proxyOriginal = fs.readFileSync(proxyPath, 'utf8');
const dbOriginal = fs.readFileSync(dbPath, 'utf8');

try {
  expectFailure(
    'SaaS auth dependency reintroduced',
    () => {
      const pkg = JSON.parse(packageOriginal);
      pkg.dependencies = { ...pkg.dependencies, '@clerk/nextjs': '0.0.0-security-probe' };
      fs.writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
    },
    () => fs.writeFileSync(packagePath, packageOriginal),
  );

  expectFailure(
    'backend DB import from public marketing surface',
    () => fs.writeFileSync(marketingPath, `${marketingOriginal}\nimport { db } from '@/libs/DB';\n`),
    () => fs.writeFileSync(marketingPath, marketingOriginal),
  );

  expectFailure(
    'unsafe Sentry PII collection',
    () => fs.writeFileSync(sentryPath, sentryOriginal.replace('sendDefaultPii: false', 'sendDefaultPii: true')),
    () => fs.writeFileSync(sentryPath, sentryOriginal),
  );

  expectFailure(
    'synthetic SEO audit enabled on real origins',
    () => fs.writeFileSync(proxyPath, proxyOriginal.replace(/return site\.hostname\.endsWith\('\.invalid'\)[^;]*;/, 'return true;')),
    () => fs.writeFileSync(proxyPath, proxyOriginal),
  );

  expectFailure(
    'production DB TLS requirement weakened',
    () => fs.writeFileSync(dbPath, dbOriginal.replace('sslmode=require or stronger', 'TLS optional')),
    () => fs.writeFileSync(dbPath, dbOriginal),
  );
} finally {
  fs.writeFileSync(packagePath, packageOriginal);
  fs.writeFileSync(marketingPath, marketingOriginal);
  fs.writeFileSync(sentryPath, sentryOriginal);
  fs.writeFileSync(proxyPath, proxyOriginal);
  fs.writeFileSync(dbPath, dbOriginal);
}

if (!process.exitCode) {
  console.log('[security-self-test] all rejection probes passed');
}
