import { describe, expect, it } from 'vitest';
import { resolveDeployEnv } from './env';

describe('resolveDeployEnv', () => {
  it('prefers APP_ENV over Vercel and Node values', () => {
    expect(resolveDeployEnv({
      APP_ENV: 'preview',
      VERCEL_ENV: 'production',
      NODE_ENV: 'development',
    })).toBe('preview');
  });

  it('falls back to development', () => {
    expect(resolveDeployEnv({})).toBe('development');
  });
});
