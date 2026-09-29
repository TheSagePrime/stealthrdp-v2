import { describe, expect, it } from 'vitest';
import { parseSiteUrl, resolveSiteUrl } from './site-url';

describe('parseSiteUrl', () => {
  it('accepts localhost HTTP outside production', () => {
    const site = parseSiteUrl('http://localhost:3000');

    expect(site.origin).toBe('http://localhost:3000');
  });

  it('rejects HTTP in production', () => {
    expect(() => parseSiteUrl('http://example.com', { production: true })).toThrow(/localhost|HTTPS/);
  });
  it('uses the canonical StealthRDP origin when production SITE_URL is absent', () => {
    expect(resolveSiteUrl({ VERCEL_ENV: 'production' }, 'production').origin)
      .toBe('https://www.stealthrdp.com');
  });
});
