import { describe, expect, it } from 'vitest';
import { routeLocales } from '@/config/i18n';
import { defaultSeoConfig } from '@/config/seo';
import { hreflangAlternates } from '@/libs/seo/locale';
import { formatEuro, languageVersions, localeHref, logicalPath } from './i18n';

describe('language helpers', () => {
  it('formats euro prices the way each market writes them', () => {
    expect(formatEuro(4.59, 'en')).toBe('€4.59');
    expect(formatEuro(4.59, 'de')).toBe('4,59 €');
    expect(formatEuro(1234.5, 'es')).toBe('1234,50 €');
  });

  it('strips the language prefix from a URL', () => {
    expect(logicalPath('/de/plans')).toEqual({ path: '/plans', locale: 'de' });
    expect(logicalPath('/es')).toEqual({ path: '/', locale: 'es' });
    expect(logicalPath('/en/plans')).toEqual({ path: '/plans', locale: 'en' });
    expect(logicalPath('/plans')).toEqual({ path: '/plans', locale: 'en' });
  });

  it('keeps English-only pages on their English URL in every language', () => {
    const englishOnly = '/blog/vps-for-trading.html';

    expect(routeLocales(englishOnly)).toEqual(['en']);
    expect(localeHref(englishOnly, 'de')).toBe(englishOnly);
    expect(hreflangAlternates(englishOnly, defaultSeoConfig)).toEqual({});
    expect(languageVersions(englishOnly)).toHaveLength(1);
  });

  it('leaves external and anchor links alone', () => {
    expect(localeHref('https://dash.stealthrdp.com/cart.php', 'de')).toBe('https://dash.stealthrdp.com/cart.php');
    expect(localeHref('#plans', 'es')).toBe('#plans');
  });
});
