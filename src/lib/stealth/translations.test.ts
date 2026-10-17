import { describe, expect, it, vi } from 'vitest';
import { GET as markdownCopy } from '@/app/docs-md/[slug]/[page]/route';
import { routeLocales } from '@/config/i18n';
import { defaultSeoConfig, resolveSeoSite } from '@/config/seo';
import { docsTree } from '@/lib/stealth/docs-tree';
import { createArticleMetadata } from '@/libs/seo/articles';
import { createPageMetadata } from '@/libs/seo/metadata';
import {
  findTranslatedDoc,
  findTranslatedGuide,
  publishedTranslationEntries,
  translatedDocMetadata,
  translatedDocs,
  translatedGuideJsonLd,
  translatedGuideMetadata,
  translationSitemapEntries,
} from './translations';

/* Three German translations of real English pages: an article and a blog post that are published,
   and an article whose publishAt has not come yet. */
vi.mock('@/content/i18n/published-routes.json', () => ({
  default: {
    generatedAt: '2026-10-10',
    routes: {
      de: ['/blog', '/blog/vps-for-trading.html', '/docs', '/docs/windows-licensing', '/resources'],
      es: [],
    },
    sources: {
      '/de/blog/vps-for-trading.html': 'src/content/guides/de/vps-for-trading.md',
      '/de/docs/windows-licensing': 'src/content/docs/de/windows-licensing.md',
    },
  },
}));

vi.mock('./translation-sources', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./translation-sources')>();
  const files: Record<string, string> = {
    'src/content/docs/de/windows-licensing.md': [
      '---',
      'order: 1',
      'title: Windows-Lizenzen für Ihren VPS',
      'sidebarTitle: Windows-Lizenzen',
      'category: Windows',
      'date: Oct 1, 2026',
      'summary: Welche Windows-Lizenz Ihr StealthRDP VPS braucht und was die Testversion abdeckt.',
      'relatedSlugs: [1737945157-how-do-i-log-into-windows]',
      'translationOf: windows-licensing',
      'locale: de',
      'publishAt: 2026-10-01',
      'primaryKeyword: windows vps lizenz',
      '---',
      'Lesen Sie [Verbinden](/de/docs/how-do-i-log-into-windows) und den [Ratgeber](/de/blog/vps-for-trading.html).',
      '',
    ].join('\n'),
    'src/content/docs/de/1737945157-how-do-i-log-into-windows.md': [
      '---',
      'order: 2',
      'title: Mit Windows verbinden',
      'category: Windows',
      'date: Jan 27, 2025',
      'summary: So verbinden Sie sich per Remotedesktop mit Ihrem Windows VPS.',
      'translationOf: 1737945157-how-do-i-log-into-windows',
      'locale: de',
      'publishAt: 2026-12-01',
      'primaryKeyword: remotedesktopverbindung einrichten',
      '---',
      'Noch nicht veröffentlicht.',
      '',
    ].join('\n'),
    'src/content/guides/de/vps-for-trading.md': [
      '---',
      'order: 2',
      'title: "Forex VPS für Trading: Was ein Server leisten kann"',
      'excerpt: Ein Forex VPS hält MT4, MT5 oder einen Trading-Bot online. Eine Strategie verbessert er nicht.',
      'category: VPS Use Cases',
      'author: StealthRDP Team',
      'date: 2026-09-27',
      'readingTime: 7',
      'sources:',
      '  - title: Quelle',
      '    url: https://example.com/source',
      'translationOf: vps-for-trading',
      'locale: de',
      'publishAt: 2026-10-09',
      'primaryKeyword: forex vps',
      '---',
      '## Was ein VPS leistet',
      '',
      'Text <a class="seo-article-citation" href="#source-1" aria-label="Source 1">[1]</a> und [Lizenzen](/de/docs/windows-licensing).',
      '',
    ].join('\n'),
  };
  /* The files go into a scratch project; the English originals they translate are the real ones. */
  const fs = await import('node:fs');
  const os = await import('node:os');
  const path = await import('node:path');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'translations-'));
  for (const [file, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), text);
  }
  const sources = actual.readTranslationSources(root);
  fs.rmSync(root, { recursive: true, force: true });
  return { ...actual, readTranslationSources: () => sources };
});

const config = { ...defaultSeoConfig, siteUrl: 'https://www.stealthrdp.com', environment: { deployEnv: 'production' as const } };
const site = resolveSeoSite(config);

describe('published translations', () => {
  it('serves only the translations in the publish list', () => {
    expect(findTranslatedDoc('de', '/docs/windows-licensing')?.title).toBe('Windows-Lizenzen für Ihren VPS');
    expect(findTranslatedDoc('de', '/docs/how-do-i-log-into-windows')).toBeUndefined();
    expect(findTranslatedDoc('es', '/docs/windows-licensing')).toBeUndefined();
    expect(findTranslatedGuide('de', '/blog/vps-for-trading.html')?.html).toContain('<h2>Was ein VPS leistet</h2>');
    expect(publishedTranslationEntries().map(entry => entry.path)).toEqual(['/de/docs/windows-licensing', '/de/blog/vps-for-trading.html']);
  });

  it('points links to unpublished translations at the English page', () => {
    const doc = findTranslatedDoc('de', '/docs/windows-licensing')!;

    expect(doc.content).toContain('[Verbinden](/docs/how-do-i-log-into-windows)');
    expect(doc.content).toContain('[Ratgeber](/de/blog/vps-for-trading.html)');
    expect(findTranslatedGuide('de', '/blog/vps-for-trading.html')!.html).toContain('href="/de/docs/windows-licensing"');
  });

  it('publishes the translated routes in the language list', () => {
    expect(routeLocales('/docs/windows-licensing')).toEqual(['en', 'de']);
    expect(routeLocales('/docs/how-do-i-log-into-windows')).toEqual(['en']);
    expect(routeLocales('/docs')).toEqual(['en', 'de']);
  });
});

describe('metadata of a translated page', () => {
  it('uses its own words, canonical and hreflang to every published language', () => {
    const metadata = translatedDocMetadata(findTranslatedDoc('de', '/docs/windows-licensing')!);

    expect(metadata.title).toBe('Windows-Lizenzen für Ihren VPS — StealthRDP');
    expect(metadata.description).toBe('Welche Windows-Lizenz Ihr StealthRDP VPS braucht und was die Testversion abdeckt.');
    expect(metadata.alternates?.canonical).toMatch(/\/de\/docs\/windows-licensing$/);
    expect(Object.keys(metadata.alternates?.languages ?? {})).toEqual(['en', 'de', 'x-default']);
    expect(metadata.other?.['content-language']).toBe('de');
  });

  it('adds hreflang to the English original automatically', () => {
    const english = createPageMetadata({ path: '/docs/windows-licensing', config });

    expect(english.alternates?.languages).toEqual({
      'en': 'https://www.stealthrdp.com/docs/windows-licensing',
      'de': 'https://www.stealthrdp.com/de/docs/windows-licensing',
      'x-default': 'https://www.stealthrdp.com/docs/windows-licensing',
    });
    expect(createPageMetadata({ path: '/docs/how-do-i-log-into-windows', config }).alternates?.languages).toBeUndefined();
  });

  it('gives a translated blog post article metadata and BlogPosting in its language', () => {
    const guide = findTranslatedGuide('de', '/blog/vps-for-trading.html')!;
    const metadata = translatedGuideMetadata(guide, config);
    const english = createArticleMetadata(config.articles.publications.find(item => item.slug === 'vps-for-trading')!, config);
    const graph = translatedGuideJsonLd(guide, config, site)['@graph'] as Record<string, unknown>[];

    expect(metadata.alternates?.canonical).toBe('https://www.stealthrdp.com/de/blog/vps-for-trading.html');
    expect(metadata.alternates?.languages).toEqual(english.alternates?.languages);
    expect(metadata.openGraph).toMatchObject({ type: 'article', locale: 'de', publishedTime: '2026-10-09' });
    expect(graph[0]).toMatchObject({
      '@type': 'BlogPosting',
      'url': 'https://www.stealthrdp.com/de/blog/vps-for-trading.html',
      'inLanguage': 'de',
      'datePublished': '2026-10-09',
    });
    expect((graph[1]!.itemListElement as { item: string }[]).map(item => item.item)).toEqual([
      'https://www.stealthrdp.com/de',
      'https://www.stealthrdp.com/de/blog',
      'https://www.stealthrdp.com/de/blog/vps-for-trading.html',
    ]);
  });
});

describe('where a translation appears', () => {
  it('is in the sitemap with its publish date and alternates, and the English post gains them too', () => {
    const entries = translationSitemapEntries(config, site);

    expect(entries.map(entry => [entry.url, entry.lastModified])).toEqual([
      ['https://www.stealthrdp.com/blog/vps-for-trading.html', config.articles.publications.find(item => item.slug === 'vps-for-trading')!.dateModified],
      ['https://www.stealthrdp.com/de/docs/windows-licensing', '2026-10-01'],
      ['https://www.stealthrdp.com/de/blog/vps-for-trading.html', '2026-10-09'],
    ]);
    expect(Object.keys(entries[2]!.alternates!.languages!)).toEqual(['en', 'de', 'x-default']);
  });

  it('is in the German sidebar under a German group, linking within the language', () => {
    const json = JSON.stringify(docsTree('de'), (key, value) => (key === 'icon' ? undefined : value));

    expect(json).toContain('"name":"Windows-Lizenzen","url":"/de/docs/windows-licensing"');
    expect(json).toContain('"name":"Windows und RDP"');
    expect(json).toContain('"url":"/de/blog/vps-for-trading.html"');
    expect(json).not.toContain('/de/docs/how-do-i-log-into-windows');
    expect(json).toContain('"url":"/citadel/docs"');
    expect(JSON.stringify(docsTree('en'), (key, value) => (key === 'icon' ? undefined : value))).not.toContain('/de/');
  });

  it('has a Markdown copy, and an unpublished translation has none', async () => {
    const get = (locale: string, page: string) => markdownCopy(new Request(`https://www.stealthrdp.com/docs-md/${locale}/${page}`), { params: Promise.resolve({ slug: locale, page }) });
    const doc = await get('de', 'windows-licensing');
    const guide = await get('de', 'guide-vps-for-trading');

    expect(doc.status).toBe(200);
    expect(doc.headers.get('X-Robots-Tag')).toBe('noindex');
    expect(await doc.text()).toMatch(/^# Windows-Lizenzen für Ihren VPS\n/);
    expect(await guide.text()).toContain('## Quellen und Referenzen');
    expect((await get('de', 'how-do-i-log-into-windows')).status).toBe(404);
    expect((await get('es', 'windows-licensing')).status).toBe(404);
  });

  it('lists the translated Help Center articles by section', () => {
    expect(translatedDocs('de', 'help').map(doc => doc.path)).toEqual(['/de/docs/windows-licensing']);
    expect(translatedDocs('de', 'citadel')).toEqual([]);
  });
});
