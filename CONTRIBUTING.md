# How to change the site

Step-by-step recipes for the common changes. Each recipe says which files to touch and what not to
touch. Read [AGENTS.md](AGENTS.md) first. Check every product claim against
[PRODUCT_FACTS.md](PRODUCT_FACTS.md).

Run `pnpm build` after any recipe. The build runs the SEO pre-build check, the Next.js build and the
SEO post-build audit; the audit crawls every public page and fails on missing titles, canonicals,
broken internal links and similar errors.

**Page dates are automatic.** `src/content/page-dates.json` records when the words on each page last
changed. It feeds the sitemap `lastmod`, `dateModified` in structured data and the "Updated" line on
guides and docs. The pre-commit hook runs `pnpm page-dates`, which moves a page's date only when its
text changes, not on markup, class name or formatting edits. CI runs `pnpm check:page-dates` and
fails when the file is stale; if you committed without the hook, run `pnpm page-dates` and commit
the file. Never type a date into it, and never change front matter `date` to signal an update.
Only when a change moves code but no words (a refactor, a new prop) run `pnpm page-dates --keep-dates`
before you commit, and only after you compared the built HTML of every affected page and found it
unchanged. It refreshes the fingerprints and keeps every date.

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
   date: 2026-10-01 # ISO publication date; updates are dated automatically
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
   date: Oct 1, 2026 # first publication; updates are dated automatically
   summary: One sentence, used as the meta description.
   relatedSlugs: [] # file names (without .md) of related articles
   ---
   ```

2. Write the body in standard Markdown (GitHub-flavoured: tables and task lists work). Start with
   the first paragraph; the page adds the title and the date. Use `##`/`###` headings: they form
   the "On this page" list. Commands go in fenced code blocks with a language (` ```bash `): they
   are highlighted and get a copy button.
3. Add the file name (without `.md`) to a collection in `helpCollections` in
   `src/lib/stealth/help-center.ts`. The collections build the Help Center home page and the docs
   sidebar; an article in no collection does not appear in either.
4. If the article is a policy or account page that must not be indexed, add its path to
   `noindexDocPaths` in `src/lib/stealth/routes.ts`.

**Formatting beyond plain Markdown.** These work in Help Center articles and Citadel docs. Each one
was checked in the browser; use the exact syntax.

- **Numbered steps.** `###` headings that start with a number and a dot become a step timeline. Use
  the same heading level for every step, in order. A heading without a number ends the timeline.

  ````md
  ### 1. Install the panel

  Run the installer as root.

  ### 2. Open the panel

  Visit the panel in a browser.
  ````

  Any existing article with numbered `###` headings shows a timeline, so do not number headings you
  do not want as steps.

- **Code tabs.** Put two or more code blocks one after another, each with a `tab="Name"` after the
  language. They become one tabbed block, with the first tab open.

  ````md
  ```bash tab="Ubuntu"
  sudo apt update
  ```

  ```bash tab="AlmaLinux"
  sudo dnf update
  ```
  ````

- **File titles.** Put `title="..."` after the language. The bar above the code shows the title with
  an icon: a terminal icon for `bash`, a file icon for other languages.

  ````md
  ```apache title=".htaccess"
  RewriteEngine On
  ```
  ````

- **Line highlights.** Use the comment style of the language. A marker on a line of its own affects
  the line below it; a marker at the end of a line affects that line.

  - `// [!code ++]` or `# [!code ++]`: the next line is added (green, with a `+`).
  - `// [!code --]` or `# [!code --]`: the next line is removed (red, with a `-`).
  - `// [!code highlight]` or `# [!code highlight]` at the end of a line: the line is highlighted.

  The marker line itself is not shown. The examples above show the marker in shell and in
  JavaScript.

- **Callouts.** A `:::info`, `:::warn` or `:::tip` block. Leave a blank line before and after the
  block. Text inside is Markdown. A tip shows a lightbulb.

  ```md
  :::warn
  Back up the file before you change it.
  :::
  ```

Raw HTML in these articles is dropped, so write Markdown. Every article's Markdown is also served at
`/docs-md/<slug>` (the "Copy Markdown" and "Open" buttons use it); nothing needs registering for that.

Old articles have numeric file names (`1737944013-use-of-service.md`); `docsPublicSlugs` in
`src/lib/stealth/articles.ts` maps them to their public URLs. Do not rename them — the URLs are indexed.

## 3. Add a Citadel doc

URL: `/citadel/docs/<name>`.

1. Create `src/content/docs/citadel-<name>.md`. The `citadel-` prefix sends it to the Citadel docs.
2. Use the same front matter as a Help Center article, with a category that starts with `Citadel:`,
   for example `"Citadel: Start here"`.
3. Add the file name to a collection in `citadelCollections` in `src/lib/stealth/help-center.ts`, so
   it appears on the Citadel docs home page and in the sidebar.
4. Optional illustration: put the SVG in `public/citadel-docs/` and add the `illustration` block
   (copy it from `citadel-overview.md`).

## 4. Add or edit a FAQ

1. Edit `src/content/faqs.json`. Each entry needs `_id` (unique), `question`, `answer`, `category`,
   `displayOrder` and `isPublished: true`.
2. Use one of the existing categories: `Account Management`, `Pricing & Billing`, `Services & Plans`,
   `Technical Support & Security`.
3. The `/faq` page and its FAQPage structured data update on their own.
4. Update the FAQ count in `src/lib/stealth/migration.test.ts`.

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
4. Do not type stock numbers. Stock is read live from WHMCS every 15 minutes on incoming requests.

Do not change how plan cards look. Plan-card styles are frozen by the owner.

## 7. Add a marketing page

1. Create `src/app/[locale]/(marketing)/<route>/page.tsx`. Copy a similar page (for example
   `about/page.tsx`) and keep its structure:
   - first line `/* eslint-disable better-tailwindcss/no-unknown-classes */` when you use the global
     `sr-*`/`srv-*` classes;
   - `export const metadata = createPageMetadata({ path: '/<route>', title, description, ogImage })`
     (title up to about 60 characters, description 70–160). A page that will also exist in German
     or Spanish uses `generateMetadata` with `localizedPageMetadata` instead (recipe 12);
   - one `<h1>`; sections use `sr-container` for width and gutters;
   - `await requirePageLocale('/<route>')` at the top of the page function, so `/de/<route>` and
     `/es/<route>` return 404 until the page is published in that language.
2. Add `'/<route>'` to `routes.publicMarketing` in `src/config/seo.ts`. This puts it in the sitemap
   and the SEO audit. A page that must not be indexed goes in `publicUtility` instead.
   Then list the files its words come from in `marketingSources` in `scripts/page-dates.mjs`, so
   its sitemap date updates with its content. `pnpm check:page-dates` fails until you do.
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

1. Add or rename the monitor in UptimeRobot. `/status` and `/api/uptime` show every monitor of the
   account, with its UptimeRobot name, on the next one-minute refresh (with shared server caching for 60 seconds). No code change is needed.
2. Names decide the group (`groupFor()` in `src/lib/stealth/uptime.ts`): `USA …` goes to USA servers,
   `EU …` or a name with `NL` to Europe servers, everything else to Platform. A new region needs a
   new group there and in `groupOrder`.
3. The data comes from the UptimeRobot API with `UPTIMEROBOT_API_KEY` (Vercel, production only, use a
   read-only key). Without the key (preview, local) it comes from the public status page, which has no
   response times and only the latest incident per service.
4. Refresh `src/content/uptime.json` (the last fallback) from the public feed now and then. Copy the
   values; never invent them.

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

## 12. Write or publish a page in German or Spanish

English stays at the root (`/plans`); German lives under `/de` and Spanish under `/es`. A language
version exists only when the page is in the publish list, so a half-done page never goes live.

1. **Words live in copy files, not in the page.** `src/content/i18n/en/<page>.ts(x)` holds the English
   words and exports the type (`export type PlansCopy = typeof plans`). `de/` and `es/` hold the same
   shape. `src/content/i18n/<page>.ts` maps each language to its copy. Pages and components read
   `copy[locale]`. Client components get plain strings: write templates as `'{count} left'` and fill
   them with `fill()` from `src/lib/stealth/i18n.ts`, not as functions.
2. **Write from research, not line by line.** Use the page's entry in
   `.sageprime/seo/keyword-map-de-de.json` or `keyword-map-es-es.json` for the title, H1 and sections.
   Every claim must still be in [PRODUCT_FACTS.md](PRODUCT_FACTS.md). German says "Sie", Spanish
   (Spain) says "tú". "günstig", "barato" and "económico" are allowed; "cheap" stays banned in English.
3. **Links.** Use `localeHref('/x', locale)`: it returns `/de/x` when that page is published in German
   and the English URL otherwise. Label a link to an English-only page with `linkLabel()` from
   `src/lib/stealth/link-label.ts`, which adds "(Englisch)" or "(en inglés)" while the target is not
   translated. Quote reviews as written and mark them `lang="en"`.
4. **Numbers.** Prices with `formatEuro(amount, locale)` (`4,59 €`). Write a literal amount with a
   non-breaking space (`5\u00A0€`) so the sign never wraps alone.
5. **Publish.** Add the route to `localizedRoutes` in `src/config/i18n.ts`. That one list turns on the
   page, its hreflang tags, its sitemap entry and the language switch. List the copy file among the
   page's sources in `scripts/page-dates.mjs` (`copy(locale, '<file>')`).
6. **Check.** `pnpm build` must pass with 0 audit failures; the audit checks every hreflang set and
   that unpublished language URLs return 404. Compare the English HTML with a build from `main`: an
   English page may only gain its hreflang tags and the language switch. Look at the new page on
   desktop and mobile; German words are long, so check buttons, tags and chart labels.
7. **Log it.** Add an entry to `.sageprime/seo/changelog.md`.

