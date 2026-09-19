import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

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

const portalPath = 'src/app/api/polar/portal/route.ts';
const sentryPath = 'src/instrumentation-client.ts';
const securityRoutingPath = 'src/features/security/routing.ts';
const proxyPath = 'src/proxy.ts';
const apiProbePath = 'src/app/api/__security-probe/route.ts';
const portalOriginal = fs.readFileSync(portalPath, 'utf8');
const sentryOriginal = fs.readFileSync(sentryPath, 'utf8');
const securityRoutingOriginal = fs.readFileSync(securityRoutingPath, 'utf8');
const proxyOriginal = fs.readFileSync(proxyPath, 'utf8');

try {
  expectFailure(
    'client-controlled Polar customer ID',
    () => fs.writeFileSync(portalPath, portalOriginal + "\n// searchParams.get('customerId')\n"),
    () => fs.writeFileSync(portalPath, portalOriginal),
  );

  expectFailure(
    'billing session exposed as GET',
    () => fs.writeFileSync(portalPath, portalOriginal.replace('export async function POST', 'export async function GET')),
    () => fs.writeFileSync(portalPath, portalOriginal),
  );

  expectFailure(
    'billing session without same-origin guard',
    () => fs.writeFileSync(portalPath, portalOriginal.replace('isSameOriginMutation(request)', 'true')),
    () => fs.writeFileSync(portalPath, portalOriginal),
  );

  expectFailure(
    'organization billing without role authorization',
    () => fs.writeFileSync(portalPath, portalOriginal.replace('principal.canManageBilling', 'true')),
    () => fs.writeFileSync(portalPath, portalOriginal),
  );

  expectFailure(
    'sensitive billing redirect without no-store helper',
    () => fs.writeFileSync(portalPath, portalOriginal.replace('sensitiveRedirect(portalUrl)', 'Response.redirect(portalUrl, 303)')),
    () => fs.writeFileSync(portalPath, portalOriginal),
  );

  expectFailure(
    'unsafe Sentry PII collection',
    () => fs.writeFileSync(sentryPath, sentryOriginal.replace('sendDefaultPii: false', 'sendDefaultPii: true')),
    () => fs.writeFileSync(sentryPath, sentryOriginal),
  );

  expectFailure(
    'public API omitted from the explicit security routing boundary',
    () => fs.writeFileSync(securityRoutingPath, securityRoutingOriginal.replace("'/api/health', ", '')),
    () => fs.writeFileSync(securityRoutingPath, securityRoutingOriginal),
  );

  expectFailure(
    'synthetic CI auth response enabled outside reserved .invalid origins',
    () => fs.writeFileSync(proxyPath, proxyOriginal.replace(
      "return site.hostname.endsWith('.invalid');",
      'return true;',
    )),
    () => fs.writeFileSync(proxyPath, proxyOriginal),
  );

  fs.mkdirSync('src/app/api/__security-probe', { recursive: true });
  expectFailure(
    'API route without resource-level authentication',
    () => fs.writeFileSync(apiProbePath, "export function GET() { return Response.json({ ok: true }); }\n"),
    () => fs.rmSync('src/app/api/__security-probe', { recursive: true, force: true }),
  );
} finally {
  fs.writeFileSync(portalPath, portalOriginal);
  fs.writeFileSync(sentryPath, sentryOriginal);
  fs.writeFileSync(securityRoutingPath, securityRoutingOriginal);
  fs.writeFileSync(proxyPath, proxyOriginal);
  fs.rmSync('src/app/api/__security-probe', { recursive: true, force: true });
}

if (!process.exitCode) console.log('[security-self-test] all rejection probes passed');
