#!/usr/bin/env node
/* Compares a German or Spanish resource (src/content/{docs,guides}/{de,es}/<file>.md) with its English
   original and fails when anything that carries meaning was lost or changed: sections, steps, list
   items, table rows, code, links, images, callouts, citation markers and the front matter that must not
   be translated. See .sageprime/seo/briefs/i18n/WRITER-GUIDE.md.

   Usage: node scripts/check-translation.mjs <file.md> [<file.md> …] */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const KEEP = ['order', 'category', 'date', 'relatedSlugs', 'sources', 'author', 'readingTime', 'sourceUrl', 'sourceTitle', 'migration', 'illustration'];
const TRANSLATE = ['title', 'summary', 'excerpt', 'sidebarTitle'];
const POLICY = ['1737943955-introduction', '1737944013-use-of-service', '1737944110-termination-of-service', '1737944184-payment-terms', '1737944204-user-responsibilities'];

function split(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error('no front matter');
  }
  return { front: match[1], body: match[2] };
}

/* Front matter as top-level key → raw text block (enough to compare values without a YAML parser). */
function frontBlocks(front) {
  const blocks = {};
  let key = null;
  for (const line of front.split('\n')) {
    const top = line.match(/^([A-Z][\w-]*):(.*)$/i);
    if (top) {
      key = top[1];
      blocks[key] = top[2].trim();
    } else if (key) {
      blocks[key] += `\n${line}`;
    }
  }
  return blocks;
}

const stripLocale = href => href.replace(/^\/(de|es)(?=\/|$)/, '') || '/';

function profile(body) {
  const lines = body.split('\n');
  const out = { headings: {}, fences: [], listItems: 0, tableRows: 0, callouts: [], links: [], images: [], citations: [] };
  let fence = null;
  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      if (fence) {
        out.fences.push(fence.join('\n'));
        fence = null;
      } else {
        fence = [];
      }
      continue;
    }
    if (fence) {
      // Comments may be translated; everything else in a code block must stay identical.
      if (!/^\s*(?:#|\/\/|--|;|REM\b|::)/i.test(line)) {
        fence.push(line.trimEnd());
      }
      continue;
    }
    const heading = line.match(/^(#{1,6})\s/);
    if (heading) {
      out.headings[heading[1].length] = (out.headings[heading[1].length] ?? 0) + 1;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(line)) {
      out.listItems += 1;
    }
    if (/^\s*\|.*\|\s*$/.test(line) && !/^\s*\|[\s:|-]+\|\s*$/.test(line)) {
      out.tableRows += 1;
    }
    const callout = line.trim().match(/^:::([a-z]+)/);
    if (callout) {
      out.callouts.push(callout[1]);
    }
  }
  const text = body.replace(/```[\s\S]*?```/g, '');
  for (const m of text.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s[^)]*)?\)|<img\s[^>]*src="([^"]+)"/g)) {
    out.images.push(m[1] ?? m[2]);
  }
  for (const m of text.matchAll(/(?<!!)\[[^\]]*\]\(([^)\s]+)(?:\s[^)]*)?\)|<a\s[^>]*href="([^"]+)"/g)) {
    const href = m[1] ?? m[2];
    if (/^#source-\d+$/.test(href)) {
      out.citations.push(href);
    } else if (!href.startsWith('#')) {
      out.links.push(stripLocale(href));
    }
  }
  for (const key of ['links', 'images']) {
    out[key].sort();
  }
  return out;
}

function check(file) {
  const errors = [];
  const rel = path.relative(process.cwd(), path.resolve(file));
  const match = rel.match(/^src\/content\/(docs|guides)\/(de|es)\/([^/]+)\.md$/);
  if (!match) {
    return [`${rel}: not a translation path (src/content/{docs,guides}/{de,es}/<file>.md)`];
  }
  const [, kind, locale, stem] = match;
  const englishPath = path.join('src/content', kind, `${stem}.md`);
  if (!fs.existsSync(englishPath)) {
    return [`${rel}: no English original at ${englishPath}`];
  }
  const en = split(fs.readFileSync(englishPath, 'utf8'));
  const tr = split(fs.readFileSync(rel, 'utf8'));
  const ef = frontBlocks(en.front);
  const tf = frontBlocks(tr.front);

  for (const key of KEEP) {
    if (key in ef && ef[key] !== tf[key]) {
      errors.push(`front matter "${key}" must stay as in English`);
    }
  }
  for (const key of TRANSLATE) {
    if (key in ef && !tf[key]) {
      errors.push(`front matter "${key}" is missing`);
    }
  }
  if (tf.translationOf !== stem) {
    errors.push(`front matter "translationOf" must be ${stem}`);
  }
  if (tf.locale !== locale) {
    errors.push(`front matter "locale" must be ${locale}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tf.publishAt ?? '')) {
    errors.push('front matter "publishAt" must be YYYY-MM-DD');
  }
  if (!tf.primaryKeyword) {
    errors.push('front matter "primaryKeyword" is missing');
  }
  /* The page title and meta description as the site renders them; the SEO audit warns above 60 and
     outside 50–160 characters, and a build must pass with 0 warnings. The suffixes are the ones in
     src/lib/stealth/translations.ts (translatedDocMetadata) and src/content/i18n/resources.ts. */
  let meta = {};
  try {
    meta = parse(tr.front) ?? {};
  } catch (error) {
    errors.push(`front matter is not valid YAML: ${String(error.message).split('\n')[0]}`);
  }
  const suffix = kind === 'guides' ? '' : stem.startsWith('citadel-') ? ` — ${{ de: 'Citadel-Doku', es: 'Docs de Citadel' }[locale]}` : ' — StealthRDP';
  const pageTitle = `${meta.title ?? ''}${suffix}`;
  if (pageTitle.length > 60) {
    errors.push(`page title "${pageTitle}" is ${pageTitle.length} characters; keep it at 60 or fewer (shorten "title")`);
  }
  const description = String(meta[kind === 'guides' ? 'excerpt' : 'summary'] ?? '');
  if (description.length < 50 || description.length > 160) {
    errors.push(`${kind === 'guides' ? 'excerpt' : 'summary'} is ${description.length} characters; keep it between 50 and 160`);
  }

  const a = profile(en.body);
  const b = profile(tr.body);
  const policy = kind === 'docs' && POLICY.includes(stem);
  const same = (label, x, y) => {
    if (JSON.stringify(x) !== JSON.stringify(y)) {
      errors.push(`${label} differ:\n    en: ${JSON.stringify(x)}\n    ${locale}: ${JSON.stringify(y)}`);
    }
  };
  same('heading counts by level', a.headings, b.headings);
  same('list item count', a.listItems, b.listItems);
  same('table row count', a.tableRows, b.tableRows);
  same('code blocks (comments excluded)', a.fences, b.fences);
  same('images', a.images, b.images);
  same('citation markers', a.citations, b.citations);
  const extraLinks = policy ? b.links.filter(l => l !== `/docs/${stem}`) : b.links;
  const extraCallouts = policy ? b.callouts.slice(1) : b.callouts;
  same('link targets (language prefix ignored)', a.links, policy ? extraLinks.concat(b.links.filter(l => l === `/docs/${stem}`).slice(1)).sort() : extraLinks);
  same('callouts', a.callouts, extraCallouts);
  if (policy && b.callouts[0] !== 'info') {
    errors.push('policy pages start with the :::info "English version is binding" notice');
  }
  return errors.map(e => `${rel}: ${e}`);
}

const files = process.argv.slice(2);
if (!files.length) {
  console.error('usage: node scripts/check-translation.mjs <file.md> [...]');
  process.exit(2);
}
let failed = 0;
for (const file of files) {
  const errors = check(file);
  if (errors.length) {
    failed += 1;
    console.log(`FAIL ${file}\n  ${errors.join('\n  ')}`);
  } else {
    console.log(`PASS ${file}`);
  }
}
process.exit(failed ? 1 : 0);
