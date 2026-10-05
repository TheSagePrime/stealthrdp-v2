# SEO change log

One entry per change that affects search. Newest first. Each entry: date, what changed, which pages,
why, and when to measure it (see `.claude/skills/measurement-discipline`). Judge a change on Search
Console clicks, at least 60 days after it went live.

## 2026-10-05 — German and Spanish core pages live

- Pages: `/de`, `/es` and under each `/plans`, `/windows-vps`, `/linux-vps`, `/faq`, `/about`,
  `/status`, `/privacy`, `/citadel` (18 new URLs).
- What: language routing behind a publish list (`localizedRoutes`), hreflang with `x-default`,
  sitemap entries per language, a language switch in the header and footer, WHMCS checkout in the
  visitor's language. Titles and H1s follow the keyword maps (DE: "vps server", "windows vserver",
  "vserver mieten", "linux vserver", "ddos schutz"; ES: "servidor vps", "vps windows", "vps barato",
  "vps linux", "protección ddos").
- English pages: unchanged except the hreflang tags and the language switch (built HTML compared).
- Not yet translated, linked as English: guides, Help Center, Citadel docs, the resource index pages,
  `/rdp-vps`, `/vps-hosting-minecraft`. They follow in batches every 2-3 days.
- Measure: Search Console, filter by URL prefix `/de/` and `/es/` and by country (Germany, Austria,
  Switzerland; Spain). First check of indexing after 2 weeks; clicks from 2026-12-05 (60 days).
  Baseline: 0 German and Spanish URLs.

## 2026-10-05 — German and Spanish research and keyword maps

- Added `keyword-map-de-de.json`, `keyword-map-es-es.json` and `research/international-de-es-2026-10.md`.
- No live page changed. Why: plan the `/de` and `/es` versions from local search data.

## 2026-10-01 to 2026-10-04 — US English keyword map applied (about 40 commits)

- Pages: `/plans`, `/windows-vps`, `/linux-vps`, `/rdp-vps`, `/citadel` and its docs, 17 blog guides, 8
  Help Center docs, `/about`.
- What: titles, H1s, sections and FAQs rewritten to the 106 keywords in `keyword-map-us-en.json`;
  unsupported claims removed; data centers named (Phoenix, Amsterdam); page dates derived from content
  changes (2026-10-04).
- Why: the site had almost no non-brand search traffic (5 clicks in 28 days).
- Baseline (Search Console, 2026-09-04 to 2026-10-02): non-brand clicks 5, non-brand impressions about
  600, non-brand average position about 17 (from about 30 a month earlier).
- Measure: from 2026-12-01 (60 days). Many changes landed together, so measure the set, not single
  pages.
