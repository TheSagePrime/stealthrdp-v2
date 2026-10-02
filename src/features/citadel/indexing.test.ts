import { afterEach, describe, expect, it, vi } from 'vitest';
import robots from '@/app/robots';

afterEach(() => vi.unstubAllEnvs());

describe('Citadel indexing exclusions', () => {
  it('disallows dashboard and API routes while preserving public Citadel pages', () => {
    vi.stubEnv('VERCEL_ENV', 'production');
    vi.stubEnv('SITE_URL', 'https://www.stealthrdp.com');
    const rules = robots().rules;

    expect(rules).toMatchObject({ allow: '/', disallow: ['/api/', '/citadel/app', '/en/citadel/app'] });
  });

  it('retains the complete preview crawl ban', () => {
    vi.stubEnv('VERCEL_ENV', 'preview');
    vi.stubEnv('SITE_URL', 'https://preview.antah.de');

    expect(robots().rules).toEqual({ userAgent: '*', disallow: '/' });
  });
});
