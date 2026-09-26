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

    /* The public site publishes one locale with localePrefix 'never', so a
       non-default locale must not gain a /fr segment: indexed URLs stay stable. */
    it('keeps the published path unprefixed for every locale', () => {
      const url = '/random-url';
      const locale = 'fr';

      expect(getI18nPath(url, locale)).toBe(url);
    });
  });
});
