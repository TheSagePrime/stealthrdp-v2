import fs from 'node:fs';

const contract = JSON.parse(fs.readFileSync('stack.contract.json', 'utf8'));
const design = JSON.parse(fs.readFileSync('design.contract.json', 'utf8'));
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const css = fs.readFileSync('src/styles/global.css', 'utf8');
const postBuildRunner = fs.readFileSync('scripts/seo-post-build-runner.mjs', 'utf8');
const errors = [];

if (pkg.scripts?.build !== contract.seo.buildScript) errors.push('SEO build pipeline changed');
if (pkg.scripts?.['seo:pre-build'] !== contract.seo.preBuildScript) errors.push('SEO pre-build command changed');
if (pkg.scripts?.['seo:post-build'] !== contract.seo.postBuildScript) errors.push('SEO post-build command changed');

for (const file of contract.seo.requiredFiles) {
  if (!fs.existsSync(file)) errors.push(`protected SEO file missing: ${file}`);
}
for (const className of design.protectedSeoStyles) {
  if (!css.includes(`.${className}`)) errors.push(`protected SEO article style missing: .${className}`);
}
for (const marker of [
  "process.env.SEO_AUDIT_LOCAL !== 'true'",
  "hostname.endsWith('.invalid')",
  'failures.every(isSyntheticClerkFailure)',
]) {
  if (!postBuildRunner.includes(marker)) {
    errors.push(`SEO synthetic Clerk exception lost fail-closed guard: ${marker}`);
  }
}

if (errors.length) {
  for (const error of errors) console.error(`[seo-contract] ${error}`);
  process.exitCode = 1;
} else {
  console.log('[seo-contract] OK');
}
