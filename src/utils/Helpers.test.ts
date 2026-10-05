import { describe, expect, it } from 'vitest';
import { routing } from '@/libs/I18nRouting';
import { getI18nPath } from './Helpers';

describe('Helpers', () => {
  describe('I18n path helper', () => {
    it('keeps path unchanged when locale is default', () => {
      const url = '/random-url';
      const locale = routing.defaultLocale;

      expect(getI18nPath(url, locale)).toBe(url);
    });

    /* English keeps its indexed URLs (localePrefix 'as-needed'); German and Spanish pages live
       under their language prefix. */
    it('prefixes German and Spanish paths and keeps English unprefixed', () => {
      const url = '/random-url';

      expect(getI18nPath(url, 'en')).toBe(url);
      expect(getI18nPath(url, 'de')).toBe('/de/random-url');
      expect(getI18nPath('/', 'es')).toBe('/es');
    });
  });
});
