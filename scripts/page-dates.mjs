#!/usr/bin/env node
/* Records when the words on each public page last changed, in src/content/page-dates.json.
   The sitemap lastmod, dateModified in structured data and the visible "Updated" line on guides
   and docs read that file. Google stops trusting lastmod on a site whose dates move without real
   changes, so a page's date only moves when its fingerprint does: the text of its sources with
   markup, class names, imports and comments removed.

   pnpm page-dates          update the file (the pre-commit hook runs this)
   pnpm check:page-dates    fail when the file is stale (CI runs this)
   pnpm page-dates --keep-dates
                            refresh fingerprints but keep every date. Only for code changes that
                            change no page's words (a refactor, a new prop), and only after the
                            built HTML of every affected page was compared and found unchanged. */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse } from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = relative => pathToFileURL(path.join(root, relative)).href;
const manifestFile = 'src/content/page-dates.json';

const marketing = 'src/app/[locale]/(marketing)';
/* The words of a page in one language: shared components plus that language's copy files in
   src/content/i18n/<language>/. Each language version keeps its own date. */
const copy = (locale, name) => `src/content/i18n/${locale}/${name}`;
const osPage = locale => ['src/components/site/os/OsSections.tsx', 'src/components/site/os/OsSession.tsx', 'src/components/site/PricingExplorer.tsx', 'src/content/plans.json', copy(locale, 'os.tsx'), copy(locale, 'pricing.ts')];
const citadelComponents = fs.readdirSync(path.join(root, 'src/components/site/citadel'))
  .filter(file => file.endsWith('.tsx'))
  .map(file => `src/components/site/citadel/${file}`);

/* Every indexable page that is not a guide or a doc declares the files its words come from.
   A new marketing route fails the check until it is listed here or in pagesWithoutDates. */
const marketingSourcesFor = locale => ({
  '/': [`${marketing}/page.tsx`, 'src/components/site/HomeHero.tsx', 'src/components/site/HomePricing.tsx', 'src/content/plans.json', 'src/content/testimonials.json', copy(locale, 'home.ts'), copy(locale, 'pricing.ts')],
  '/plans': [`${marketing}/plans/page.tsx`, ...osPage(locale), copy(locale, 'plans.tsx')],
  '/windows-vps': [`${marketing}/windows-vps/page.tsx`, ...osPage(locale), copy(locale, 'windows-vps.tsx')],
  '/linux-vps': [`${marketing}/linux-vps/page.tsx`, ...osPage(locale), copy(locale, 'linux-vps.tsx')],
  '/citadel': [`${marketing}/citadel/page.tsx`, ...citadelComponents],
  '/about': [`${marketing}/about/page.tsx`, 'src/components/site/about/AboutMap.tsx', 'src/content/testimonials.json', copy(locale, 'about.ts')],
  '/faq': [`${marketing}/faq/page.tsx`, 'src/components/site/FaqExplorer.tsx', locale === 'en' ? 'src/content/faqs.json' : copy(locale, 'faqs.ts'), copy(locale, 'faq.ts')],
  '/privacy': [`${marketing}/privacy/page.tsx`],
  '/rdp-vps': [`${marketing}/rdp-vps/page.tsx`, 'src/content/rdp-vps.ts'],
});
const marketingSources = marketingSourcesFor('en');

/* Live status data and index pages: their own content rarely changes, and every guide and doc
   they list already carries its own date in the sitemap. */
const pagesWithoutDates = new Set(['/status', '/blog', '/docs', '/resources', '/citadel/docs']);

export async function pageSources() {
  const { articlePath, blogArticles, citadelDocsArticles, docPublicSlug, helpDocsArticles } = await import(src('src/lib/stealth/articles.ts'));
  const { defaultSeoConfig } = await import(src('src/config/seo.ts'));
  const { AllLocales, routeLocales } = await import(src('src/config/i18n.ts'));
  const sources = new Map(Object.entries(marketingSources));
  /* German and Spanish versions of the pages published in those languages. */
  for (const locale of AllLocales.filter(item => item !== 'en')) {
    for (const [route, files] of Object.entries(marketingSourcesFor(locale))) {
      if (routeLocales(route).includes(locale)) {
        sources.set(`/${locale}${route === '/' ? '' : route}`, files);
      }
    }
  }

  for (const article of blogArticles) {
    sources.set(articlePath(article), [`src/content/guides/${article.slug}.html`]);
  }
  for (const article of helpDocsArticles) {
    sources.set(`/docs/${docPublicSlug(article)}`, [`src/content/docs/${article.slug}.md`]);
  }
  for (const article of citadelDocsArticles) {
    sources.set(`/citadel/docs/${docPublicSlug(article).replace(/^citadel-/, '')}`, [`src/content/docs/${article.slug}.md`]);
  }

  const { publicMarketing, dynamicPublic = [] } = defaultSeoConfig.routes;
  const undeclared = [...publicMarketing, ...dynamicPublic].filter(route => !sources.has(route) && !pagesWithoutDates.has(route));
  return { sources, undeclared };
}

/* The words of one source file, without the parts that never reach a reader as content. */
export function pageText(file, source) {
  if (file.endsWith('.html') || file.endsWith('.md')) {
    const [, frontMatter = '', body = source] = /^---\n([\s\S]*?\n)---\n([\s\S]*)$/.exec(source) ?? [];
    const meta = parse(frontMatter) ?? {};
    const words = [meta.title, meta.excerpt, meta.summary, JSON.stringify(meta.sources ?? []), body.replace(/<[^>]+>/g, ' ')];
    return words.join('\n').replace(/\s+/g, ' ').trim();
  }
  if (file.endsWith('.json')) {
    return JSON.stringify(JSON.parse(source));
  }
  return source
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/^\s*\/\/.*$/gm, ' ')
    .replace(/^import[\s\S]*?from\s+['"][^'"]+['"];?$/gm, ' ')
    .replace(/className=(?:"[^"]*"|'[^']*'|\{`[^`]*`\}|\{"[^"]*"\}|\{'[^']*'\})/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function fingerprint(files) {
  const text = files.map(file => pageText(file, fs.readFileSync(path.join(root, file), 'utf8'))).join('\n');
  return crypto.createHash('sha256').update(text).digest('hex').slice(0, 16);
}

async function main() {
  const check = process.argv.includes('--check');
  const keepDates = process.argv.includes('--keep-dates');
  const { sources, undeclared } = await pageSources();
  if (undeclared.length) {
    console.error(`[page-dates] declare the source files of ${undeclared.join(', ')} in scripts/page-dates.mjs`);
    process.exit(1);
  }

  const previous = JSON.parse(fs.readFileSync(path.join(root, manifestFile), 'utf8'));
  const today = new Date().toISOString().slice(0, 10);
  const next = {};
  const changed = [];
  for (const [publicPath, files] of [...sources].sort(([a], [b]) => a.localeCompare(b))) {
    const current = fingerprint(files);
    const entry = previous[publicPath];
    if (entry?.fingerprint === current) {
      next[publicPath] = entry;
    } else if (keepDates && entry) {
      next[publicPath] = { updated: entry.updated, fingerprint: current };
      changed.push(publicPath);
    } else {
      next[publicPath] = { updated: today, fingerprint: current };
      changed.push(publicPath);
    }
  }
  const removed = Object.keys(previous).filter(publicPath => !(publicPath in next));

  if (check) {
    if (changed.length || removed.length) {
      console.error(`[page-dates] ${manifestFile} is stale for: ${[...changed, ...removed].join(', ')}`);
      console.error('[page-dates] run `pnpm page-dates` and commit the result.');
      process.exit(1);
    }
    console.log(`[page-dates] ${sources.size} page dates are current`);
    return;
  }

  fs.writeFileSync(path.join(root, manifestFile), `${JSON.stringify(next, null, 2)}\n`);
  for (const publicPath of changed) {
    console.log(keepDates && previous[publicPath]
      ? `[page-dates] ${publicPath} fingerprint refreshed, date kept`
      : `[page-dates] ${publicPath} updated ${today}`);
  }
  for (const publicPath of removed) {
    console.log(`[page-dates] ${publicPath} removed`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
