#!/usr/bin/env node
/* Tells IndexNow (Bing, Yandex, Seznam, Naver and others; ChatGPT search and Copilot read Bing)
   which pages changed in a production deploy, so they recrawl them soon instead of waiting.

   A page counts as changed when its date in src/content/page-dates.json moved or it is new.
   Those dates only move when a page's words change, so formatting and code changes submit
   nothing. A changed guide or doc also submits its index page (/blog, /docs, /citadel/docs).
   Only URLs in the live sitemap are submitted, so noindex pages never are.

   node scripts/indexnow.mjs <base> <head>   submit pages changed between two commits
   node scripts/indexnow.mjs --all           submit every URL in the sitemap once
   --dry-run                                 print the URLs and submit nothing

   The key file public/<key>.txt proves ownership of the host; it carries over from the v1 site.
   .github/workflows/indexnow.yml runs this after each successful production deploy. */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const host = 'www.stealthrdp.com';
const key = 'd6725e43a76b47b39052a3f5c4ee06bf';
const manifestFile = 'src/content/page-dates.json';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const all = args.includes('--all');
const [base, head] = args.filter(arg => !arg.startsWith('--'));

/* A commit from before the file existed has no dates, so every page in the other one is new. */
const manifestAt = (commit) => {
  try {
    return JSON.parse(execFileSync('git', ['show', `${commit}:${manifestFile}`], { cwd: root, encoding: 'utf8' }));
  } catch {
    return {};
  }
};

if (fs.readFileSync(path.join(root, 'public', `${key}.txt`), 'utf8').trim() !== key) {
  console.error(`[indexnow] public/${key}.txt must contain the key`);
  process.exit(1);
}

/* The same URL form as the sitemap: no trailing slash, the home page is the bare host. */
const urlFor = page => `https://${host}${page === '/' ? '' : page}`;

const sitemapResponse = await fetch(`https://${host}/sitemap.xml`);
if (!sitemapResponse.ok) {
  console.error(`[indexnow] could not read the sitemap: HTTP ${sitemapResponse.status}`);
  process.exit(1);
}
const sitemap = new Set([...(await sitemapResponse.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]));

let urlList;
if (all) {
  urlList = [...sitemap];
} else if (base && head) {
  for (const commit of [base, head]) {
    try {
      execFileSync('git', ['rev-parse', '--verify', '--quiet', `${commit}^{commit}`], { cwd: root });
    } catch {
      console.error(`[indexnow] unknown commit: ${commit}`);
      process.exit(1);
    }
  }
  const before = manifestAt(base);
  const after = manifestAt(head);
  const changed = Object.keys(after).filter(page => before[page]?.updated !== after[page].updated);
  const indexes = ['/citadel/docs', '/docs', '/blog'];
  const listed = changed
    .map(page => indexes.find(index => page.startsWith(`${index}/`)))
    .filter(Boolean);
  urlList = [...new Set([...changed, ...listed])].map(urlFor).filter(url => sitemap.has(url));
} else {
  console.error('[indexnow] usage: node scripts/indexnow.mjs <base> <head> | --all [--dry-run]');
  process.exit(1);
}
urlList.sort();

if (urlList.length === 0) {
  console.log('[indexnow] no page changed; nothing to submit');
  process.exit(0);
}

console.log(`[indexnow] ${urlList.length} URL(s):\n${urlList.join('\n')}`);
if (dryRun) {
  process.exit(0);
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList }),
});

/* 200 and 202 both mean accepted; 202 while the key is still being checked. */
if (response.status !== 200 && response.status !== 202) {
  console.error(`[indexnow] submission failed: HTTP ${response.status} ${await response.text()}`);
  process.exit(1);
}
console.log(`[indexnow] accepted (HTTP ${response.status})`);
