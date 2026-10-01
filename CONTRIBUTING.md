# How to change the site

Step-by-step recipes for the common changes. Each recipe says which files to touch and what not to
touch. Read [AGENTS.md](AGENTS.md) first. Check every product claim against
[PRODUCT_FACTS.md](PRODUCT_FACTS.md).

Run `pnpm build` after any recipe. The build runs the SEO pre-build check, the Next.js build and the
SEO post-build audit; the audit crawls every public page and fails on missing titles, canonicals,
broken internal links and similar errors.

---

## 1. Add a blog guide

URL: `/blog/<slug>.html`. Nothing else to register: the sitemap, RSS feed, `llms-full.txt`, search
index, structured data and blog list read the folder.

1. Create `src/content/guides/<slug>.html`. Use lowercase words and hyphens for `<slug>`.
2. Start the file with front matter:

   ```yaml
   ---
   order: 18 # position in the blog list (lower = earlier)
   title: 'VPS for X: What to Check Before You Choose'
   excerpt: One or two sentences, 70–160 characters. Used as the meta description.
   category: VPS Use Cases
   author: StealthRDP Team
   date: 2026-10-01 # ISO date
   readingTime: 7 # minutes
   sources: # real, live pages only — open each link before you add it
     - title: Page title
       url: https://example.com/page
       publisher: Example
       accessedAt: 2026-10-01
   ---
   ```

3. Write the body in HTML after the second `---`. Use `<h2>`/`<h3>` (the page adds the H1 from
   `title`). Link to our pages with root paths (`/plans`, `/windows-vps`). External links use
   `target="_blank" rel="nofollow noopener noreferrer"`.
4. Copy the structure of an existing guide, for example `vps-for-trading.html`.

Do not: invent statistics, quote customers, or link to a source you did not open.

## 2. Add a Help Center article

URL: `/docs/<slug>`.

1. Create `src/content/docs/<slug>.md` with front matter:

   ```yaml
   ---
   order: 30
   title: How to do X
   category: Server management # reuse one: Server management, Windows, Web panels,
   # VPN and networking, Terms and policies
   date: Oct 1, 2026
   summary: One sentence, used as the meta description.
   relatedSlugs: [] # file names (without .md) of related articles
   ---
   ```

2. Write the body in Markdown. Commands go in fenced code blocks (they get a copy button).
3. If the article is a policy or account page that must not be indexed, add its path to
   `noindexDocPaths` in `src/lib/stealth/routes.ts`.

Old articles have numeric file names (`1737944013-use-of-service.md`); `docsPublicSlugs` in
`src/lib/stealth/articles.ts` maps them to their public URLs. Do not rename them — the URLs are indexed.

## 3. Add a Citadel doc

URL: `/citadel/docs/<name>`.

1. Create `src/content/docs/citadel-<name>.md`. The `citadel-` prefix sends it to the Citadel docs.
2. Use the same front matter as a Help Center article, with a category that starts with `Citadel:`,
   for example `"Citadel: Start here"`.
3. Optional illustration: put the SVG in `public/citadel-docs/` and add the `illustration` block
   (copy it from `citadel-overview.md`).

## 4. Add or edit a FAQ

1. Edit `src/content/faqs.json`. Each entry needs `_id` (unique), `question`, `answer`, `category`,
   `displayOrder` and `isPublished: true`.
2. Use one of the existing categories: `Account Management`, `Pricing & Billing`, `Services & Plans`,
   `Technical Support & Security`.
3. The `/faq` page and its FAQPage structured data update on their own.

## 5. Add a review

Only real reviews with a public source.

1. Add an entry to `src/content/testimonials.json` with `quote` (exact text), `publishedOn`,
   `sourceUrl` (the review page), `sourceType` and `authorName` as the source shows it.
2. Update the count in `src/lib/stealth/migration.test.ts` if the test checks the number of entries.

## 6. Change a VPS plan price or spec

1. Check the new value in the WHMCS store first.
2. Edit the plan in `src/content/plans.json` and set `source.verifiedAt` to the time you checked.
3. Keep `name` exactly as WHMCS shows it (for example `Bronze USA`): the live stock reader matches
   plans by this name (`src/lib/stealth/live-plans.ts`).
4. Do not type stock numbers. Stock is read live from WHMCS every 6 hours.

Do not change how plan cards look. Plan-card styles are frozen by the owner.

## 7. Add a marketing page

1. Create `src/app/[locale]/(marketing)/<route>/page.tsx`. Copy a similar page (for example
   `about/page.tsx`) and keep its structure:
   - first line `/* eslint-disable better-tailwindcss/no-unknown-classes */` when you use the global
     `sr-*`/`srv-*` classes;
   - `export const metadata = createPageMetadata({ path: '/<route>', title, description, ogImage })`
     (title up to about 60 characters, description 70–160);
   - one `<h1>`; sections use `sr-container` for width and gutters.
2. Add `'/<route>'` to `routes.publicMarketing` in `src/config/seo.ts`. This puts it in the sitemap
   and the SEO audit. A page that must not be indexed goes in `publicUtility` instead.
3. Link to it from `src/components/site/SiteHeader.tsx` or `SiteFooter.tsx` if visitors need to find it.
4. If it is a main page, add it to "Primary pages" in `src/content/llms.md`.
5. Structured data, if useful: add a helper in `src/lib/stealth/structured-data.ts` and render it with
   `<ProductionJsonLd data={...} />` (it renders in production only).

Keep all text server-rendered. Crawlers and AI agents read the HTML, not the result of client code.

## 8. Add a redirect

| Old URL type | File |
|---|---|
| Old marketing URL (for example `/something.html`) | `legacyRedirects` in `next.config.ts` (**protected**) |
| Old WHMCS-era URL on the marketing domain | `src/config/legacy-redirects-whmcs.ts` |
| Old URL that our own content may still link to | also `url.legacyRedirects` in `src/config/seo.ts` (the audit warns about such links) |

Use permanent (308) redirects. Never redirect to a page that redirects again.

## 9. Add or change a status monitor

1. The live list comes from the UptimeRobot public status page (`src/app/api/uptime/route.ts`).
2. Refresh the fallback snapshot in `src/content/uptime.json` with the real values and date.
3. A new region: add its group in `src/components/site/status/status-groups.ts`
   (`groupOrder` and `groupName()`).

## 10. Add a tracking tool or a new outside host

1. Add the tag in the server-side GTM container, not in the code, when you can.
2. Load the site with the browser console open and list the hosts it is blocked from.
3. Add only those hosts to `tagHosts` in `next.config.ts` (**protected**). Never add a wildcard such as
   `https:` or `*.example.com` when one host is enough.
4. Name the tool in the "Cookies, analytics & advertising" section of
   `src/app/[locale]/(marketing)/privacy/page.tsx`.
5. Tags must load through `src/components/site/TrackingConsent.tsx` so they respect consent. Never
   add a `<Script>` for a tracker anywhere else.

## 11. Change the look of something

1. Read [DESIGN.md](DESIGN.md), [DESIGN_TOKENS.md](DESIGN_TOKENS.md) and [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).
2. Use tokens from `src/styles/global.css` (colours, radii, type sizes). No hard-coded colours outside
   that file — the design contract check fails on them.
3. Component styles go in a CSS module next to the component (`Thing.module.css`). Shared marketing
   classes are in `src/styles/stealth-v3.css`.
4. Check desktop (1366 px) and mobile (375 px) before you open the pull request.
