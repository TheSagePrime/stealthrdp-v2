import type { TranslatedLocale } from '../../config/i18n';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { AllLocales } from '../../config/i18n';
import { articlePath, blogArticles, docPublicSlug, docsArticles } from './articles';

/* German and Spanish versions of Help Center articles, Citadel docs and blog posts
   (.sageprime/seo/briefs/i18n/WRITER-GUIDE.md):

     src/content/docs/<de|es>/<English file name>.md
     src/content/guides/<de|es>/<English slug>.md

   Each file copies the English front matter, translates title/sidebarTitle/summary/excerpt and adds
   `translationOf`, `locale`, `publishAt` (YYYY-MM-DD) and `primaryKeyword`. The page keeps the
   English URL under /de or /es. A translation is published once `publishAt` is on or before the
   publish date (UTC); scripts/i18n-publish.mjs records the published ones in
   src/content/i18n/published-routes.json, which src/config/i18n.ts reads.

   This module reads and checks the files and computes that list. Every mistake throws, so a bad
   file fails the build and the tests: a translation without its English original, a `locale` or
   `translationOf` that does not match the path, a missing or impossible `publishAt`.
   Relative imports only: scripts/i18n-publish.mjs loads this module outside Next.js. */

type TranslationKind = 'docs' | 'guides';
export type TranslationSection = 'help' | 'citadel' | 'blog';

export type TranslationSource = {
  kind: TranslationKind;
  section: TranslationSection;
  locale: TranslatedLocale;
  /* The English file name without extension: the doc slug or the guide slug. */
  slug: string;
  /* Relative to the project root, e.g. src/content/docs/de/windows-licensing.md. */
  file: string;
  /* The English (unprefixed) URL of the page, e.g. /docs/windows-licensing. */
  route: string;
  /* The URL of this translation, e.g. /de/docs/windows-licensing. */
  path: string;
  publishAt: string;
  /* Position of the English original in its list, for sorting. */
  order: number;
  meta: Record<string, unknown>;
  body: string;
};

export type PublishManifest = {
  /* The day (UTC) the list was computed for. Every listed translation has publishAt <= this date. */
  generatedAt: string;
  /* Per language: the published translated pages and the index pages of their sections. */
  routes: Record<TranslatedLocale, string[]>;
  /* Translated URL -> its file, so a test can check every entry against its publishAt. */
  sources: Record<string, string>;
};

/* The English page of each original a translation may point to. */
export type EnglishIndex = Record<TranslationKind, Map<string, { route: string; section: TranslationSection; order: number }>>;

export const translationLocales = AllLocales.filter((locale): locale is TranslatedLocale => locale !== 'en');

const kinds: TranslationKind[] = ['docs', 'guides'];
const FRONT_MATTER = /^---\n([\s\S]*?\n)---\n([\s\S]*)$/;
const ISO_DAY = /^(\d{4})-(\d{2})-(\d{2})$/;

/* Index page of each section; /resources exists in a language once any translation is published. */
const sectionIndexRoutes: Record<TranslationSection, string> = {
  help: '/docs',
  citadel: '/citadel/docs',
  blog: '/blog',
};

export function isIsoDay(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }
  const match = ISO_DAY.exec(value);
  if (!match) {
    return false;
  }
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return date.getUTCFullYear() === Number(match[1])
    && date.getUTCMonth() === Number(match[2]) - 1
    && date.getUTCDate() === Number(match[3]);
}

/* Today's date in UTC, the publish date of a build. */
export function utcDay(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function isPublishedOn(publishAt: string, day: string): boolean {
  return publishAt <= day;
}

function localizedTranslationPath(route: string, locale: TranslatedLocale): string {
  return `/${locale}${route}`;
}

function englishIndex(): EnglishIndex {
  const docs = new Map(docsArticles.map((article, order) => {
    const slug = docPublicSlug(article);
    const citadel = article.slug.startsWith('citadel-');
    return [article.slug, {
      route: citadel ? `/citadel/docs/${slug.replace(/^citadel-/, '')}` : `/docs/${slug}`,
      section: citadel ? 'citadel' as const : 'help' as const,
      order,
    }];
  }));
  const guides = new Map(blogArticles.map((article, order) => [article.slug, { route: articlePath(article), section: 'blog' as const, order }]));
  return { docs, guides };
}

/* Parses and checks one translation file. `file` is relative to the project root. */
export function parseTranslation(file: string, source: string, english: EnglishIndex): TranslationSource {
  const fail = (message: string): never => {
    throw new Error(`${file}: ${message} (see .sageprime/seo/briefs/i18n/WRITER-GUIDE.md)`);
  };
  const location = /^src\/content\/(docs|guides)\/([a-z]{2})\/([^/]+)\.md$/.exec(file);
  if (!location) {
    return fail('a translation is src/content/{docs,guides}/{de,es}/<English file name>.md');
  }
  const [, kind, folderLocale, slug] = location as unknown as [string, TranslationKind, string, string];
  if (!(translationLocales as string[]).includes(folderLocale)) {
    return fail(`"${folderLocale}" is not a translation language (${translationLocales.join(', ')})`);
  }
  const locale = folderLocale as TranslatedLocale;
  const original = english[kind].get(slug);
  if (!original) {
    return fail(`no English original src/content/${kind}/${slug}.${kind === 'docs' ? 'md' : '{md,html}'}`);
  }

  const match = FRONT_MATTER.exec(source);
  if (!match) {
    return fail('no front matter');
  }
  let meta: Record<string, unknown> = {};
  try {
    meta = (parse(match[1]!) ?? {}) as Record<string, unknown>;
  } catch (error) {
    fail(`front matter is not valid YAML: ${error instanceof Error ? error.message.split('\n')[0] : String(error)}`);
  }
  if (meta.translationOf !== slug) {
    fail(`translationOf must be "${slug}", the English file name`);
  }
  if (meta.locale !== locale) {
    fail(`locale must be "${locale}", the folder it is in`);
  }
  if (!isIsoDay(meta.publishAt)) {
    fail(`publishAt must be a real date written YYYY-MM-DD, got ${JSON.stringify(meta.publishAt ?? null)}`);
  }
  const description = kind === 'docs' ? 'summary' : 'excerpt';
  for (const key of ['title', description, 'primaryKeyword']) {
    if (typeof meta[key] !== 'string' || !(meta[key] as string).trim()) {
      fail(`${key} is missing`);
    }
  }

  return {
    kind,
    section: original.section,
    locale,
    slug,
    file,
    route: original.route,
    path: localizedTranslationPath(original.route, locale),
    publishAt: meta.publishAt as string,
    order: original.order,
    meta,
    body: match[2]!,
  };
}

/* Every translation file of every language, checked, in the order of the English originals. */
export function readTranslationSources(root: string = process.cwd(), english: EnglishIndex = englishIndex()): TranslationSource[] {
  const sources: TranslationSource[] = [];
  for (const kind of kinds) {
    const kindFolder = path.join(root, 'src/content', kind);
    if (!fs.existsSync(kindFolder)) {
      continue;
    }
    for (const entry of fs.readdirSync(kindFolder, { withFileTypes: true })) {
      // Language folders only; English files sit directly in the kind folder.
      if (!entry.isDirectory()) {
        continue;
      }
      const folder = path.join(kindFolder, entry.name);
      for (const name of fs.readdirSync(folder).sort()) {
        const file = `src/content/${kind}/${entry.name}/${name}`;
        if (!name.endsWith('.md')) {
          throw new Error(`${file}: translations are Markdown files (.md)`);
        }
        sources.push(parseTranslation(file, fs.readFileSync(path.join(root, file), 'utf8'), english));
      }
    }
  }
  return sources.sort((a, b) => a.kind.localeCompare(b.kind) || a.order - b.order || a.locale.localeCompare(b.locale));
}

/* The publish list for one day: every translation with publishAt on or before `day`, plus the index
   page of each section that has one, and /resources once a language has any. */
export function buildPublishManifest(sources: TranslationSource[], day: string): PublishManifest {
  if (!isIsoDay(day)) {
    throw new Error(`publish date must be YYYY-MM-DD, got ${day}`);
  }
  const routes = Object.fromEntries(translationLocales.map(locale => [locale, new Set<string>()])) as Record<TranslatedLocale, Set<string>>;
  const files: Record<string, string> = {};
  for (const source of sources) {
    if (!isPublishedOn(source.publishAt, day)) {
      continue;
    }
    const list = routes[source.locale];
    list.add(source.route);
    list.add(sectionIndexRoutes[source.section]);
    list.add('/resources');
    files[source.path] = source.file;
  }
  return {
    generatedAt: day,
    routes: Object.fromEntries(translationLocales.map(locale => [locale, [...routes[locale]].sort()])) as Record<TranslatedLocale, string[]>,
    sources: Object.fromEntries(Object.entries(files).sort(([a], [b]) => a.localeCompare(b))),
  };
}

/* Fails when the committed publish list names a translation that does not exist, points to another
   file, or was not due on the list's date. The build calls this, so a hand-edited or stale list
   cannot publish a page early or publish a page without its file. */
export function checkPublishManifest(sources: TranslationSource[], manifest: PublishManifest): void {
  const byPath = new Map(sources.map(source => [source.path, source]));
  for (const [url, file] of Object.entries(manifest.sources)) {
    const source = byPath.get(url);
    if (!source || source.file !== file) {
      throw new Error(`src/content/i18n/published-routes.json lists ${url} (${file}), but that translation does not exist. Run node scripts/i18n-publish.mjs.`);
    }
    if (!isPublishedOn(source.publishAt, manifest.generatedAt)) {
      throw new Error(`src/content/i18n/published-routes.json lists ${url}, but its publishAt ${source.publishAt} is after the list's date ${manifest.generatedAt}. Run node scripts/i18n-publish.mjs.`);
    }
  }
  const expected = buildPublishManifest(sources.filter(source => source.path in manifest.sources), manifest.generatedAt);
  for (const locale of translationLocales) {
    if (JSON.stringify(manifest.routes[locale] ?? []) !== JSON.stringify(expected.routes[locale])) {
      throw new Error(`src/content/i18n/published-routes.json: the ${locale} routes do not match its sources. Run node scripts/i18n-publish.mjs.`);
    }
  }
}
