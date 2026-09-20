#!/usr/bin/env node
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const child = spawn(
  process.execPath,
  ['--experimental-loader', './scripts/seo-ts-loader.mjs', 'scripts/seo-post-build-v2.mjs'],
  {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
  },
);

const exitCode = await new Promise((resolve) => {
  child.on('exit', code => resolve(code ?? 1));
  child.on('error', () => resolve(1));
});

process.exit(exitCode);
