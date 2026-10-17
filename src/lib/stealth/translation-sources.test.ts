import type { EnglishIndex, TranslationSource } from './translation-sources';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  buildPublishManifest,
  checkPublishManifest,
  isIsoDay,
  isPublishedOn,
  parseTranslation,
  readTranslationSources,
  utcDay,
} from './translation-sources';

/* A small English catalogue, so the tests do not depend on the real content. */
const english: EnglishIndex = {
  docs: new Map([
    ['windows-licensing', { route: '/docs/windows-licensing', section: 'help', order: 1 }],
    ['citadel-getting-started', { route: '/citadel/docs/getting-started', section: 'citadel', order: 2 }],
  ]),
  guides: new Map([
    ['vps-for-trading', { route: '/blog/vps-for-trading.html', section: 'blog', order: 0 }],
  ]),
};

function doc(fields: Record<string, string | undefined> = {}): string {
  const front = {
    title: 'Windows-Lizenzen für Ihren VPS',
    summary: 'Welche Windows-Lizenz Ihr VPS braucht.',
    translationOf: 'windows-licensing',
    locale: 'de',
    publishAt: '2026-10-12',
    primaryKeyword: 'windows vps lizenz',
    ...fields,
  };
  const lines = Object.entries(front).filter(([, value]) => value !== undefined).map(([key, value]) => `${key}: ${value}`);
  return `---\norder: 1\n${lines.join('\n')}\n---\nText mit [Link](/de/plans).\n`;
}

function guide(locale: string, publishAt: string): string {
  return `---\norder: 0\ntitle: Trading-VPS\nexcerpt: Kurz erklärt.\ntranslationOf: vps-for-trading\nlocale: ${locale}\npublishAt: ${publishAt}\nprimaryKeyword: forex vps\n---\nBody\n`;
}

const docFile = 'src/content/docs/de/windows-licensing.md';

describe('parsing a translation', () => {
  it('reads a valid file with the English URL under the language prefix', () => {
    const source = parseTranslation(docFile, doc(), english);

    expect(source).toMatchObject({
      kind: 'docs',
      section: 'help',
      locale: 'de',
      slug: 'windows-licensing',
      route: '/docs/windows-licensing',
      path: '/de/docs/windows-licensing',
      publishAt: '2026-10-12',
    });
    expect(source.meta.title).toBe('Windows-Lizenzen für Ihren VPS');
    expect(source.body).toBe('Text mit [Link](/de/plans).\n');
  });

  it('maps Citadel docs and blog posts to their English URLs', () => {
    expect(parseTranslation('src/content/docs/es/citadel-getting-started.md', doc({ translationOf: 'citadel-getting-started', locale: 'es' }), english).path)
      .toBe('/es/citadel/docs/getting-started');
    expect(parseTranslation('src/content/guides/de/vps-for-trading.md', guide('de', '2026-10-01'), english).path)
      .toBe('/de/blog/vps-for-trading.html');
  });

  it('fails without an English original', () => {
    expect(() => parseTranslation('src/content/docs/de/no-such-article.md', doc({ translationOf: 'no-such-article' }), english))
      .toThrow(/no English original/);
  });

  it('fails when locale or translationOf do not match the path', () => {
    expect(() => parseTranslation(docFile, doc({ locale: 'es' }), english)).toThrow(/locale must be "de"/);
    expect(() => parseTranslation(docFile, doc({ translationOf: 'citadel-getting-started' }), english)).toThrow(/translationOf must be "windows-licensing"/);
    expect(() => parseTranslation('src/content/docs/fr/windows-licensing.md', doc({ locale: 'fr' }), english)).toThrow(/not a translation language/);
  });

  it.each([
    ['missing', undefined],
    ['not zero-padded', '2026-1-5'],
    ['an impossible day', '2026-02-30'],
    ['a date and time', '2026-10-12T08:00:00Z'],
    ['words', 'next monday'],
  ])('fails when publishAt is %s', (_label, publishAt) => {
    expect(() => parseTranslation(docFile, doc({ publishAt }), english)).toThrow(/publishAt must be a real date written YYYY-MM-DD/);
  });

  it('fails without a title, summary or primary keyword', () => {
    expect(() => parseTranslation(docFile, doc({ title: undefined }), english)).toThrow(/title is missing/);
    expect(() => parseTranslation(docFile, doc({ summary: undefined }), english)).toThrow(/summary is missing/);
    expect(() => parseTranslation(docFile, doc({ primaryKeyword: undefined }), english)).toThrow(/primaryKeyword is missing/);
  });

  it('fails without front matter or with broken YAML, naming the file', () => {
    expect(() => parseTranslation(docFile, 'Just text', english)).toThrow(/no front matter/);
    expect(() => parseTranslation(docFile, doc({ summary: 'Schritte: so geht es: weiter' }), english))
      .toThrow(/windows-licensing\.md: front matter is not valid YAML/);
  });
});

describe('reading the translation folders', () => {
  let root: string | undefined;

  afterEach(() => {
    if (root) {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  function project(files: Record<string, string>): string {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'translations-'));
    for (const [file, text] of Object.entries({ 'src/content/docs/english.md': '', 'src/content/guides/english.md': '', ...files })) {
      fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
      fs.writeFileSync(path.join(root, file), text);
    }
    return root;
  }

  it('reads every language folder and leaves the English files alone', () => {
    const sources = readTranslationSources(project({
      [docFile]: doc(),
      'src/content/guides/es/vps-for-trading.md': guide('es', '2026-10-01'),
    }), english);

    expect(sources.map(source => source.path)).toEqual(['/de/docs/windows-licensing', '/es/blog/vps-for-trading.html']);
  });

  it('returns nothing when no translation exists yet', () => {
    expect(readTranslationSources(project({}), english)).toEqual([]);
  });

  it('fails on a file that is not Markdown', () => {
    expect(() => readTranslationSources(project({ 'src/content/guides/de/vps-for-trading.html': '<p>x</p>' }), english))
      .toThrow(/translations are Markdown files/);
  });

  it('fails the whole read on one bad file', () => {
    expect(() => readTranslationSources(project({
      [docFile]: doc(),
      'src/content/guides/de/vps-for-trading.md': guide('es', '2026-10-01'),
    }), english)).toThrow(/vps-for-trading\.md: locale must be "de"/);
  });
});

describe('publishing by date', () => {
  const sources: TranslationSource[] = [
    parseTranslation(docFile, doc({ publishAt: '2026-10-12' }), english),
    parseTranslation('src/content/docs/es/citadel-getting-started.md', doc({ translationOf: 'citadel-getting-started', locale: 'es', publishAt: '2026-10-20' }), english),
    parseTranslation('src/content/guides/de/vps-for-trading.md', guide('de', '2026-11-01'), english),
  ];

  it('publishes a translation on its publishAt day, not before', () => {
    expect(isPublishedOn('2026-10-12', '2026-10-11')).toBe(false);
    expect(isPublishedOn('2026-10-12', '2026-10-12')).toBe(true);
    expect(isPublishedOn('2026-10-12', '2027-01-01')).toBe(true);
  });

  it('lists nothing before the first publish date', () => {
    expect(buildPublishManifest(sources, '2026-10-11')).toEqual({
      generatedAt: '2026-10-11',
      routes: { de: [], es: [] },
      sources: {},
    });
  });

  it('lists each published translation with its section index and /resources', () => {
    expect(buildPublishManifest(sources, '2026-10-12')).toEqual({
      generatedAt: '2026-10-12',
      routes: { de: ['/docs', '/docs/windows-licensing', '/resources'], es: [] },
      sources: { '/de/docs/windows-licensing': docFile },
    });
    expect(buildPublishManifest(sources, '2026-11-01').routes).toEqual({
      de: ['/blog', '/blog/vps-for-trading.html', '/docs', '/docs/windows-licensing', '/resources'],
      es: ['/citadel/docs', '/citadel/docs/getting-started', '/resources'],
    });
  });

  it('accepts a list that matches the files and its date', () => {
    expect(() => checkPublishManifest(sources, buildPublishManifest(sources, '2026-10-20'))).not.toThrow();
  });

  it('rejects a list that publishes a translation before its date', () => {
    const early = { ...buildPublishManifest(sources, '2026-11-01'), generatedAt: '2026-10-12' };

    expect(() => checkPublishManifest(sources, early)).toThrow(/vps-for-trading\.html, but its publishAt 2026-11-01 is after the list's date 2026-10-12/);
  });

  it('rejects a list that names a missing file or hand-edited routes', () => {
    const manifest = buildPublishManifest(sources, '2026-10-12');

    expect(() => checkPublishManifest(sources.slice(1), manifest)).toThrow(/that translation does not exist/);
    expect(() => checkPublishManifest(sources, { ...manifest, routes: { de: ['/docs/windows-licensing'], es: [] } })).toThrow(/de routes do not match/);
  });

  it('rejects a publish date that is not a day', () => {
    expect(() => buildPublishManifest(sources, '2026-10-32')).toThrow(/publish date must be YYYY-MM-DD/);
  });

  it('dates a build in UTC', () => {
    expect(utcDay(new Date('2026-10-10T23:30:00-05:00'))).toBe('2026-10-11');
    expect(isIsoDay('2028-02-29')).toBe(true);
    expect(isIsoDay('2027-02-29')).toBe(false);
  });
});
