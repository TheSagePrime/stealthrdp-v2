import { describe, expect, it } from 'vitest';
import { defaultSeoConfig } from '../../config/seo';
import { canonicalUrlForPath, normalizePathname, stripTrackingParams } from './normalize';

describe('SEO URL normalization', () => {
  it('lowercases and strips trailing slashes', () => {
    expect(normalizePathname('/Features/', 'strip')).toBe('/features');
  });

  it('builds canonical URLs without tracking parameters', () => {
    const canonical = canonicalUrlForPath('/page?utm_source=google', {
      origin: 'https://example.com',
      protocol: 'https:',
      hostname: 'example.com',
      href: 'https://example.com/',
    }, defaultSeoConfig);

    expect(canonical).toBe('https://example.com/page');
  });

  it('drops configured tracking parameters', () => {
    const params = stripTrackingParams(new URLSearchParams('utm_source=google&ref=ok'), defaultSeoConfig.url.trackingParams);

    expect(params.get('utm_source')).toBeNull();
    expect(params.get('ref')).toBe('ok');
  });
});
