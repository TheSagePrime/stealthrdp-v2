import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProductionJsonLd } from '@/components/seo/ProductionJsonLd';
import { isoDate } from './structured-data';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('structured data', () => {
  it('converts article dates to ISO and drops values it cannot read', () => {
    expect(isoDate('Mar 3, 2025')).toBe('2025-03-03');
    expect(isoDate('2026-09-27')).toBe('2026-09-27');
    expect(isoDate('March 2025')).toBeUndefined();
  });

  it('renders only in production, so the preview never publishes it', () => {
    vi.stubEnv('APP_ENV', 'preview');

    expect(ProductionJsonLd({ data: { '@type': 'Thing' } })).toBeNull();

    vi.stubEnv('APP_ENV', 'production');

    expect(ProductionJsonLd({ data: { '@type': 'Thing' } })).not.toBeNull();
  });
});
