#!/usr/bin/env node
/* Publishes German and Spanish translations by date. Reads the front matter of every translation
   (src/content/{docs,guides}/{de,es}/*.md), keeps those whose `publishAt` is on or before the
   publish date (today in UTC) and writes their URLs, with the index pages of their sections, to
   src/content/i18n/published-routes.json. src/config/i18n.ts reads that file, so the next build
   serves the pages, lists them in the sitemap, the sidebar and the search, and adds hreflang.
   A translation that is not in the file does not exist on the site: its URL returns 404.

   node scripts/i18n-publish.mjs                  update the file for today (UTC)
   node scripts/i18n-publish.mjs --date 2026-11-02  update it for another day (to preview a release)
   node scripts/i18n-publish.mjs --check          exit 1 when the file is not current for today

   Daily refresh: run the script, commit the file when it changed, and deploy (production builds
   from main). The file only changes on a day a translation goes live, and the unit test
   src/lib/stealth/translation-manifest.test.ts fails while a due translation is missing from it.
   See CONTRIBUTING.md, recipe 13. */
import fs from 'node:fs';
import { register } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
register('./seo-ts-loader.mjs', import.meta.url);

const manifestFile = 'src/content/i18n/published-routes.json';
const { buildPublishManifest, isIsoDay, readTranslationSources, utcDay } = await import(
  pathToFileURL(path.join(root, 'src/lib/stealth/translation-sources.ts')).href,
);

const args = process.argv.slice(2);
const check = args.includes('--check');
const dateIndex = args.indexOf('--date');
const day = dateIndex === -1 ? utcDay() : args[dateIndex + 1];
if (!isIsoDay(day)) {
  console.error(`[i18n-publish] --date must be YYYY-MM-DD, got ${day}`);
  process.exit(2);
}

const sources = readTranslationSources(root);
const next = buildPublishManifest(sources, day);
const previousText = fs.readFileSync(path.join(root, manifestFile), 'utf8');
const previous = JSON.parse(previousText);
const sameRoutes = (a, b) => JSON.stringify(a.routes) === JSON.stringify(b.routes) && JSON.stringify(a.sources) === JSON.stringify(b.sources);

/* Keep the file (and its date) when nothing is published or withdrawn, so a daily run only changes
   it on the day a translation goes live. The old date stays valid only while the list computed for
   it is still the same list. */
const unchanged = sameRoutes(previous, next)
  && isIsoDay(previous.generatedAt)
  && previous.generatedAt <= day
  && sameRoutes(previous, buildPublishManifest(sources, previous.generatedAt));

const published = Object.entries(next.routes).map(([locale, routes]) => `${locale}: ${routes.length} route(s)`).join(', ');
if (check) {
  if (!unchanged) {
    console.error(`[i18n-publish] ${manifestFile} is not current for ${day}. Run \`node scripts/i18n-publish.mjs\` and commit the file.`);
    process.exit(1);
  }
  console.log(`[i18n-publish] ${manifestFile} is current for ${day} (${published})`);
} else if (unchanged) {
  console.log(`[i18n-publish] nothing to publish on ${day}; ${manifestFile} unchanged (${published})`);
} else {
  fs.writeFileSync(path.join(root, manifestFile), `${JSON.stringify(next, null, 2)}\n`);
  const before = new Set(Object.keys(previous.sources ?? {}));
  const after = new Set(Object.keys(next.sources));
  for (const url of after) {
    if (!before.has(url)) {
      console.log(`[i18n-publish] published ${url}`);
    }
  }
  for (const url of before) {
    if (!after.has(url)) {
      console.log(`[i18n-publish] withdrawn ${url}`);
    }
  }
  console.log(`[i18n-publish] wrote ${manifestFile} for ${day} (${published}). Commit it and rebuild.`);
}
