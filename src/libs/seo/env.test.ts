import { describe, expect, it } from 'vitest';
import { resolveDeployEnv } from './env';

describe('resolveDeployEnv', () => {
  it('prefers Vercel environment over APP_ENV when Vercel supplies one', () => {
    expect(resolveDeployEnv({
      APP_ENV: 'preview',
      VERCEL_ENV: 'production',
      NODE_ENV: 'development',
    })).toBe('production');
  });

  it('falls back to development', () => {
    expect(resolveDeployEnv({})).toBe('development');
  });
});
