import { spawn } from 'node:child_process';

function run(command, args) {
  return spawn(command, args, {
    env: process.env,
    stdio: 'inherit',
  });
}

const database = run('pglite-server', ['-m', '100', '--run', 'pnpm run db:migrate']);
const build = run('next', ['build']);

let databaseFailed = false;
database.once('error', () => {
  databaseFailed = true;
});
database.once('exit', (code) => {
  databaseFailed = code !== null && code !== 0;
});

build.once('error', (error) => {
  console.error(error);
  database.kill('SIGTERM');
  process.exitCode = 1;
});

build.once('exit', (code, signal) => {
  database.kill('SIGTERM');
  process.exitCode = databaseFailed || signal ? 1 : (code ?? 1);
});
