import { describe, expect, it } from 'vitest';
import { parseSiteUrl } from './site-url';

describe('parseSiteUrl', () => {
  it('accepts localhost HTTP outside production', () => {
    const site = parseSiteUrl('http://localhost:3000');

    expect(site.origin).toBe('http://localhost:3000');
  });

  it('rejects HTTP in production', () => {
    expect(() => parseSiteUrl('http://example.com', { production: true })).toThrow(/localhost|HTTPS/);
  });

  it('rejects credentials in the URL', () => {
    for (const value of ['https://user@example.com', 'https://user:secret@example.com', 'https://:secret@example.com']) {
      expect(() => parseSiteUrl(value)).toThrow(/credentials/);
    }
  });
});
