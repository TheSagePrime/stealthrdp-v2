import { execFileSync } from 'node:child_process';

const [base, head] = process.argv.slice(2);
if (!base || !head) {
  console.error('[governance] base and head SHAs are required');
  process.exit(2);
}

const protectedExact = new Set([
  'stack.contract.json',
  'design.contract.json',
  'ARCHITECTURE.md',
  'DESIGN_SYSTEM.md',
  'components.json',
  'package.json',
  'pnpm-lock.yaml',
  'drizzle.config.ts',
  'next.config.ts',
  'lefthook.yml',
  '.github/workflows/CI.yml',
  'scripts/check-stack-contract.mjs',
  'scripts/check-design-contract.mjs',
  'scripts/check-seo-contract.mjs',
  'skills/saas-builder/SKILL.md',
  'src/styles/global.css',
  'src/utils/DBConnection.ts'
]);
const protectedPrefixes = [
  'src/libs/seo/',
  'scripts/seo-',
  'src/features/billing/',
  'src/app/robots.',
  'src/app/sitemap.'
];

const changed = execFileSync('git', ['diff', '--name-only', base, head], { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);

const sensitive = changed.filter(file =>
  protectedExact.has(file) || protectedPrefixes.some(prefix => file.startsWith(prefix))
);

if (sensitive.length) {
  console.log('[governance] protected architecture files changed:');
  for (const file of sensitive) console.log(`- ${file}`);
  if (process.env.ARCHITECTURE_APPROVED !== 'true') {
    console.error('[governance] add the architecture-approved label after owner review before merge.');
    process.exitCode = 1;
  } else {
    console.log('[governance] architecture-approved label present.');
  }
} else {
  console.log('[governance] no protected architecture files changed');
}
