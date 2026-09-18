import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

function expectFailure(script, label) {
  const result = spawnSync(process.execPath, [script], { encoding: 'utf8' });
  if (result.status === 0) {
    console.error(`[contract-self-test] expected failure was not detected: ${label}`);
    process.exitCode = 1;
    return;
  }
  console.log(`[contract-self-test] rejected as expected: ${label}`);
}

const packagePath = 'package.json';
const uiProbePath = 'src/utils/Helpers.ts';
const packageOriginal = fs.readFileSync(packagePath, 'utf8');
const uiOriginal = fs.readFileSync(uiProbePath, 'utf8');

try {
  const pkg = JSON.parse(packageOriginal);
  pkg.dependencies = { ...pkg.dependencies, '@mui/material': '0.0.0-contract-probe' };
  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');
  expectFailure('scripts/check-stack-contract.mjs', 'forbidden UI dependency');

  fs.writeFileSync(packagePath, packageOriginal);
  fs.writeFileSync(uiProbePath, uiOriginal + "\n// contract probe #ff00ff\n");
  expectFailure('scripts/check-design-contract.mjs', 'hardcoded product color');

  fs.writeFileSync(uiProbePath, uiOriginal);
  const seoPkg = JSON.parse(packageOriginal);
  seoPkg.scripts.build = 'next build';
  fs.writeFileSync(packagePath, JSON.stringify(seoPkg, null, 2) + '\n');
  expectFailure('scripts/check-seo-contract.mjs', 'SEO pipeline bypass');
} finally {
  fs.writeFileSync(packagePath, packageOriginal);
  fs.writeFileSync(uiProbePath, uiOriginal);
}

if (!process.exitCode) console.log('[contract-self-test] all rejection probes passed');
