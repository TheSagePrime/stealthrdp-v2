import { describe, expect, it } from 'vitest';
import manifest from '@/content/i18n/published-routes.json';
import { buildPublishManifest, isIsoDay, readTranslationSources, utcDay } from './translation-sources';

/* src/content/i18n/published-routes.json is written by scripts/i18n-publish.mjs. It must list
   exactly the translations whose publishAt is on or before its own date: a translation that became
   due without the script being run, a withdrawn file, or a hand-edited entry fails here. */
describe('the committed publish list', () => {
  const sources = readTranslationSources();

  it('has a valid date that is not in the future', () => {
    expect(isIsoDay(manifest.generatedAt)).toBe(true);
    expect(manifest.generatedAt <= utcDay()).toBe(true);
  });

  it('matches the translation files for its date (run `node scripts/i18n-publish.mjs` if not)', () => {
    expect(manifest).toEqual(buildPublishManifest(sources, manifest.generatedAt));
  });

  it('lists only translations that were due on its date', () => {
    for (const [url, file] of Object.entries(manifest.sources as Record<string, string>)) {
      const source = sources.find(item => item.path === url);

      expect(source?.file).toBe(file);
      expect(source!.publishAt <= manifest.generatedAt).toBe(true);
    }
  });
});
