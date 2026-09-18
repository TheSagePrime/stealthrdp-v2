import fs from 'node:fs';
import path from 'node:path';

const contract = JSON.parse(fs.readFileSync('security.contract.json', 'utf8'));
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const errors = [];

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full.replaceAll('\\', '/')];
  });
}

function versionTuple(value) {
  const match = String(value).match(/(\d+)\.(\d+)\.(\d+)/);
  return match ? match.slice(1).map(Number) : null;
}

function versionAtLeast(actual, minimum) {
  const left = versionTuple(actual);
  const right = versionTuple(minimum);
  if (!left || !right) return false;
  for (let index = 0; index < 3; index += 1) {
    if (left[index] > right[index]) return true;
    if (left[index] < right[index]) return false;
  }
  return true;
}

const sourceFiles = listFiles('src').filter(file => /\.(?:ts|tsx|js|jsx)$/.test(file));
const publicApis = new Set(contract.authentication.publicApiAllowlist);

for (const route of sourceFiles.filter(file => /^src\/app\/api\/.+\/route\.ts$/.test(file))) {
  if (publicApis.has(route)) continue;

  const source = fs.readFileSync(route, 'utf8');
  if (!source.includes('getAuthenticatedPrincipal') && !/\bauth(?:\.protect)?\s*\(/.test(source)) {
    errors.push(`${route}: API Route Handler lacks resource-level authentication`);
  }
}

for (const page of contract.authentication.protectedPageFiles ?? []) {
  if (!fs.existsSync(page)) {
    errors.push(`${page}: protected page missing`);
    continue;
  }
  const source = fs.readFileSync(page, 'utf8');
  if (!source.includes('await auth.protect()')) {
    errors.push(`${page}: protected page must enforce Clerk auth at the resource boundary`);
  }
}

for (const layout of contract.authentication.protectedLayoutFiles ?? []) {
  if (!fs.existsSync(layout)) {
    errors.push(`${layout}: protected layout missing`);
    continue;
  }
  const source = fs.readFileSync(layout, 'utf8');
  if (!source.includes('await auth.protect()')) {
    errors.push(`${layout}: protected layout must enforce Clerk auth for descendant routes`);
  }
}

const webhookRoute = 'src/app/api/polar/webhook/route.ts';
if (!fs.existsSync(contract.billing.webhookReplayGuard)) {
  errors.push(`missing webhook replay guard: ${contract.billing.webhookReplayGuard}`);
}
const webhookSource = fs.readFileSync(webhookRoute, 'utf8');
if (!webhookSource.includes('withPolarWebhookReplayGuard')) {
  errors.push(`${webhookRoute}: verified webhooks must pass through replay suppression before entitlement sync`);
}
if (!webhookSource.includes(`MAX_WEBHOOK_BYTES = ${Number(contract.billing.maxWebhookBytes).toLocaleString('en-US').replaceAll(',', '_')}`)) {
  errors.push(`${webhookRoute}: webhook payload size limit must remain ${contract.billing.maxWebhookBytes} bytes`);
}

for (const route of contract.billing.sensitiveRoutes) {
  if (!fs.existsSync(route)) {
    errors.push(`${route}: sensitive billing route missing`);
    continue;
  }

  const source = fs.readFileSync(route, 'utf8');
  if (!source.includes('getAuthenticatedPrincipal')) {
    errors.push(`${route}: billing route must derive identity from the authenticated Clerk principal`);
  }
  if (!source.includes('consumeRateLimit')) {
    errors.push(`${route}: billing route must rate-limit session creation`);
  }
  if (!source.includes(`export async function ${contract.billing.sensitiveRouteMethod}`)) {
    errors.push(`${route}: billing session creation must use ${contract.billing.sensitiveRouteMethod}`);
  }
  if (contract.billing.sameOriginRequired && !source.includes('isSameOriginMutation(request)')) {
    errors.push(`${route}: billing session creation must enforce same-origin requests`);
  }
  for (const selector of contract.billing.forbiddenClientSelectors) {
    if (source.includes(`searchParams.get('${selector}')`) || source.includes(`searchParams.get("${selector}")`)) {
      errors.push(`${route}: client-controlled billing customer selector "${selector}" is forbidden`);
    }
  }
}

const envSource = fs.readFileSync('src/libs/Env.ts', 'utf8');
const loggerSource = fs.readFileSync('src/libs/Logger.ts', 'utf8');
for (const prefix of contract.privacy.forbiddenPublicEnvPrefixes) {
  if (envSource.includes(prefix) || loggerSource.includes(prefix)) {
    errors.push(`logging credential must never be browser-public: ${prefix}`);
  }
}

for (const file of contract.serverOnlyModules ?? []) {
  const source = fs.readFileSync(file, 'utf8');
  if (!source.startsWith("import 'server-only';")) {
    errors.push(`${file}: privileged module must be marked server-only`);
  }
}

const sentryServer = fs.readFileSync('src/instrumentation.ts', 'utf8');
const sentryClient = fs.readFileSync('src/instrumentation-client.ts', 'utf8');
for (const [file, source] of [
  ['src/instrumentation.ts', sentryServer],
  ['src/instrumentation-client.ts', sentryClient],
]) {
  if (source.includes('sendDefaultPii: true')) errors.push(`${file}: Sentry PII collection must default off`);
  if (source.includes('enableLogs: true')) errors.push(`${file}: Sentry log forwarding must default off`);
}
if (!sentryClient.includes(`process.env.${contract.privacy.clientTelemetryOptInEnv} === 'true'`)) {
  errors.push('client Sentry must be explicitly opt-in');
}
if (!sentryClient.includes(`process.env.${contract.privacy.replayOptInEnv} === 'true'`)) {
  errors.push('Sentry Replay must have a separate explicit opt-in');
}
for (const unsafe of ['maskAllText: false', 'maskAllInputs: false', 'blockAllMedia: false']) {
  if (sentryClient.includes(unsafe)) errors.push(`src/instrumentation-client.ts: unsafe replay setting ${unsafe}`);
}

const nextConfig = fs.readFileSync('next.config.ts', 'utf8');
if (!nextConfig.includes("browserToTerminal: process.env.BROWSER_TO_TERMINAL_ENABLED === 'true'")) {
  errors.push('next.config.ts: browser-to-terminal logging must be opt-in');
}
for (const header of [...contract.http.requiredHeaders, ...contract.http.productionRequiredHeaders]) {
  if (!nextConfig.includes(`key: '${header}'`)) errors.push(`next.config.ts: missing required security header ${header}`);
}

for (const lockfile of contract.supplyChain.forbiddenLockfiles) {
  if (fs.existsSync(lockfile)) errors.push(`forbidden non-pnpm lockfile tracked: ${lockfile}`);
}
for (const dependency of contract.supplyChain.forbiddenDependencies ?? []) {
  if (pkg.dependencies?.[dependency] || pkg.devDependencies?.[dependency]) {
    errors.push(`forbidden dependency detected by security contract: ${dependency}`);
  }
}
for (const [name, minimum] of Object.entries(contract.supplyChain.minimumDependencies)) {
  const declared = pkg.dependencies?.[name] ?? pkg.devDependencies?.[name];
  if (!declared || !versionAtLeast(declared, minimum)) {
    errors.push(`${name} must declare a security floor of at least ${minimum}; found ${declared ?? 'missing'}`);
  }
}

const playwrightConfig = fs.readFileSync('playwright.config.ts', 'utf8');
if (!playwrightConfig.includes(`trace: '${contract.privacy.e2eTracePolicy}'`)) {
  errors.push('playwright.config.ts: authenticated traces must be retained only on failure');
}

const ci = fs.readFileSync('.github/workflows/CI.yml', 'utf8');
if (!/^permissions:\s*\n\s+contents:\s+read/m.test(ci)) {
  errors.push('.github/workflows/CI.yml: default GitHub token permissions must be contents: read');
}
if (!ci.includes(`retention-days: ${contract.privacy.maxDiagnosticArtifactRetentionDays}`)) {
  errors.push('.github/workflows/CI.yml: diagnostic artifact retention exceeds privacy contract');
}
if (!ci.includes('pnpm audit --prod --audit-level high')) {
  errors.push('.github/workflows/CI.yml: production dependency audit must run in CI');
}

const release = fs.readFileSync('.github/workflows/release.yml', 'utf8');
if (!release.includes("github.event.workflow_run.conclusion == 'success'")) {
  errors.push('.github/workflows/release.yml: release must require successful CI');
}
if (!release.includes('ref: ${{ github.event.workflow_run.head_sha }}')) {
  errors.push('.github/workflows/release.yml: release must checkout the exact tested CI SHA');
}
if (contract.release?.requireCurrentMainSha
  && !release.includes('git rev-parse origin/main')
) {
  errors.push('.github/workflows/release.yml: stale successful CI must not release after main advances');
}

if (contract.supplyChain.pinGithubActionsToCommitSha) {
  for (const file of [...listFiles('.github/workflows'), ...listFiles('.github/actions')].filter(file => /\.ya?ml$/.test(file))) {
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(/^\s*uses:\s*([^\s#]+)\s*/gm)) {
      const target = match[1];
      if (target.startsWith('./')) continue;
      const revision = target.split('@')[1] ?? '';
      if (!/^[0-9a-f]{40}$/i.test(revision)) {
        errors.push(`${file}: GitHub Action must be pinned to an immutable commit SHA: ${target}`);
      }
    }
  }
}

for (const file of sourceFiles) {
  const source = fs.readFileSync(file, 'utf8');
  if (source.includes("from '@/libs/DB'")) {
    const allowed = contract.database.directDbImportAllowedPrefixes.some(prefix => file.startsWith(prefix));
    if (!allowed) errors.push(`${file}: direct DB access must stay behind the approved data boundary`);
  }
  if (source.includes("from '@/utils/DBConnection'") && file !== 'src/libs/DB.ts') {
    errors.push(`${file}: DBConnection must only be consumed by the canonical DB module`);
  }
}

const dbSource = fs.readFileSync('src/utils/DBConnection.ts', 'utf8');
if (contract.database.productionTlsRequired && !dbSource.includes('sslmode=require or stronger')) {
  errors.push('src/utils/DBConnection.ts: production database transport must enforce TLS');
}
for (const marker of [
  `max: ${contract.database.pool.max}`,
  `connectionTimeoutMillis: ${contract.database.pool.connectionTimeoutMs.toLocaleString('en-US').replaceAll(',', '_')}`,
  `query_timeout: ${contract.database.pool.queryTimeoutMs.toLocaleString('en-US').replaceAll(',', '_')}`,
]) {
  if (!dbSource.includes(marker)) errors.push(`src/utils/DBConnection.ts: missing bounded pool marker ${marker}`);
}

const readinessSource = fs.readFileSync('src/features/runtime/readiness.ts', 'utf8');
if (!readinessSource.includes(`expiresAt: now + ${Number(contract.http.readinessCacheMs).toLocaleString('en-US').replaceAll(',', '_')}`)) {
  errors.push('readiness DB probe must remain short-lived cached to bound public DB load');
}

const proxy = fs.readFileSync('src/proxy.ts', 'utf8');
if (proxy.includes('createRouteMatcher')) {
  errors.push('src/proxy.ts: deprecated Clerk createRouteMatcher must not be an authorization boundary');
}
if (proxy.includes('routes.privatePages')) {
  errors.push('src/proxy.ts: SEO privatePages must not control authentication or authorization');
}
if (!proxy.includes("'/api(.*)'") ) {
  errors.push('src/proxy.ts: all API paths must always receive Clerk middleware context');
}
if (contract.seo.forbidProductionLocalAuditProxy
  && (!proxy.includes('isProductionDeployEnv(config.environment.deployEnv)')
    || !proxy.includes("process.env.SEO_AUDIT_LOCAL !== 'true'")
    || !proxy.includes("site.hostname.endsWith('.invalid')"))) {
  errors.push('src/proxy.ts: SEO local audit proxy must be blocked on real production origins while preserving synthetic .invalid CI');
}

if (contract.seo.escapeJsonLdScriptClosing) {
  const jsonLdHelper = fs.existsSync('src/libs/seo/json-ld.ts')
    ? fs.readFileSync('src/libs/seo/json-ld.ts', 'utf8')
    : '';
  if (!jsonLdHelper.includes("replaceAll('<', '\\\\u003c')")) {
    errors.push('JSON-LD serializer must escape "<" before insertion into script tags');
  }
}

const secretPatterns = [
  /\bghp_[A-Za-z0-9]{30,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{30,}\b/,
  /\bsk_live_[A-Za-z0-9]{16,}\b/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
];
for (const file of [...sourceFiles, ...listFiles('.github'), '.env.example'].filter(file => fs.existsSync(file))) {
  const source = fs.readFileSync(file, 'utf8');
  if (secretPatterns.some(pattern => pattern.test(source))) {
    errors.push(`${file}: possible live secret/private key committed to source`);
  }
}

if (errors.length) {
  for (const error of [...new Set(errors)]) console.error(`[security-contract] ${error}`);
  process.exitCode = 1;
} else {
  console.log('[security-contract] OK');
}
