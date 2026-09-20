import fs from 'node:fs';

const readJson = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const fail = (errors) => {
  for (const error of errors) console.error(`[stack-contract] ${error}`);
  process.exitCode = 1;
};

const contract = readJson('stack.contract.json');
const pkg = readJson('package.json');
const components = readJson('components.json');
const errors = [];

if (pkg.packageManager !== `${contract.packageManager.name}@${contract.packageManager.version}`) {
  errors.push(`packageManager must be ${contract.packageManager.name}@${contract.packageManager.version}`);
}
if (pkg.engines?.node !== contract.runtime.node) {
  errors.push(`Node engine must remain ${contract.runtime.node}`);
}

const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
for (const name of contract.requiredDependencies) {
  if (!pkg.dependencies?.[name]) errors.push(`missing required dependency: ${name}`);
}
for (const name of contract.requiredDevDependencies) {
  if (!pkg.devDependencies?.[name]) errors.push(`missing required devDependency: ${name}`);
}
for (const name of contract.forbiddenDependencies) {
  if (allDeps[name]) errors.push(`forbidden dependency detected: ${name}`);
}
for (const forbiddenPath of contract.forbiddenPaths ?? []) {
  if (fs.existsSync(forbiddenPath)) errors.push(`forbidden SaaS path exists: ${forbiddenPath}`);
}
for (const requiredPath of contract.requiredFiles) {
  if (!fs.existsSync(requiredPath)) errors.push(`missing required architecture file: ${requiredPath}`);
}
for (const requiredPath of contract.seo.requiredFiles) {
  if (!fs.existsSync(requiredPath)) errors.push(`missing required SEO file: ${requiredPath}`);
}

if (pkg.scripts?.build !== contract.seo.buildScript) {
  errors.push('build script must preserve SEO pre-build -> app build -> SEO post-build order');
}
if (pkg.scripts?.['seo:pre-build'] !== contract.seo.preBuildScript) {
  errors.push('seo:pre-build script differs from the protected SEO contract');
}
if (pkg.scripts?.['seo:post-build'] !== contract.seo.postBuildScript) {
  errors.push('seo:post-build script differs from the protected SEO contract');
}

if (components.style !== 'new-york' || components.rsc !== true || components.tsx !== true) {
  errors.push('components.json must preserve the canonical shadcn new-york RSC/TSX setup');
}
if (components.aliases?.ui !== '@/components/ui' || components.iconLibrary !== 'lucide') {
  errors.push('components.json must preserve @/components/ui and Lucide');
}

const dbSource = fs.readFileSync('src/utils/DBConnection.ts', 'utf8');
for (const expected of ["drizzle-orm/node-postgres", "from 'pg'", 'Env.DATABASE_URL']) {
  if (!dbSource.includes(expected)) errors.push(`database boundary is missing expected runtime marker: ${expected}`);
}
if (dbSource.includes('@neondatabase/serverless')) {
  errors.push('Neon serverless driver is not part of the locked runtime; production Neon uses the pg + Drizzle boundary');
}
if (contract.database.productionProvider !== 'neon') errors.push('production database provider must remain Neon');
if (contract.database.orm !== 'drizzle-orm') errors.push('ORM must remain Drizzle');
if (contract.database.localProvider !== 'pglite') errors.push('local database provider must remain PGlite');

if (errors.length) fail(errors);
else console.log('[stack-contract] OK');
