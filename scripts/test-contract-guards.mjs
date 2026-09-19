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
const badSurfacePath = 'src/features/__contract-probe.tsx';
const duplicatePrimitivePath = 'src/components/button.tsx';
const seoRunnerPath = 'scripts/seo-post-build-runner.mjs';
const packageOriginal = fs.readFileSync(packagePath, 'utf8');
const uiOriginal = fs.readFileSync(uiProbePath, 'utf8');
const seoRunnerOriginal = fs.readFileSync(seoRunnerPath, 'utf8');

try {
  const pkg = JSON.parse(packageOriginal);
  pkg.dependencies = { ...pkg.dependencies, '@mui/material': '0.0.0-contract-probe' };
  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');
  expectFailure('scripts/check-stack-contract.mjs', 'forbidden UI dependency');

  fs.writeFileSync(packagePath, packageOriginal);
  fs.writeFileSync(uiProbePath, uiOriginal + '\n// contract probe #ff00ff\n');
  expectFailure('scripts/check-design-contract.mjs', 'hardcoded product color');

  fs.writeFileSync(uiProbePath, uiOriginal);
  fs.writeFileSync(
    badSurfacePath,
    'export const Probe = () => <button className="backdrop-blur-xl shadow-2xl">Bad</button>;\n',
  );
  expectFailure('scripts/check-design-contract.mjs', 'raw control and AI-slop decoration');

  fs.rmSync(badSurfacePath, { force: true });
  fs.writeFileSync(
    duplicatePrimitivePath,
    "export { Button } from './ui/button';\n",
  );
  expectFailure('scripts/check-design-contract.mjs', 'duplicate canonical primitive');

  fs.rmSync(duplicatePrimitivePath, { force: true });
  const seoPkg = JSON.parse(packageOriginal);
  seoPkg.scripts.build = 'next build';
  fs.writeFileSync(packagePath, JSON.stringify(seoPkg, null, 2) + '\n');
  expectFailure('scripts/check-seo-contract.mjs', 'SEO pipeline bypass');

  fs.writeFileSync(packagePath, packageOriginal);
  fs.writeFileSync(seoRunnerPath, seoRunnerOriginal.replace(
    'failures.every(isSyntheticClerkFailure)',
    'failures.some(isSyntheticClerkFailure)',
  ));
  expectFailure('scripts/check-seo-contract.mjs', 'partial SEO failure suppression');
} finally {
  fs.writeFileSync(packagePath, packageOriginal);
  fs.writeFileSync(uiProbePath, uiOriginal);
  fs.writeFileSync(seoRunnerPath, seoRunnerOriginal);
  fs.rmSync(badSurfacePath, { force: true });
  fs.rmSync(duplicatePrimitivePath, { force: true });
}

if (!process.exitCode) console.log('[contract-self-test] all rejection probes passed');
