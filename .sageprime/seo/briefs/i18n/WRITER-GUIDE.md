# Writing German and Spanish resources

Read this before writing a German (`de`) or Spanish (`es`) version of a Help Center article, Citadel doc
or blog post. Also read `AGENTS.md`, `PRODUCT_FACTS.md`, the keyword plan `plan.json` (your page's entry)
and the English original.

## Where the file goes

| English original | German | Spanish |
|---|---|---|
| `src/content/docs/<file>.md` | `src/content/docs/de/<file>.md` | `src/content/docs/es/<file>.md` |
| `src/content/guides/<slug>.md` | `src/content/guides/de/<slug>.md` | `src/content/guides/es/<slug>.md` |

Same file name as the English original. The URL keeps the English slug: `/de/docs/...`, `/es/blog/....html`.

## Front matter

Copy the English front matter, then:

- Translate: `title`, `sidebarTitle`, `summary` (docs) or `excerpt` (blog).
- Keep unchanged: `order`, `category`, `date`, `relatedSlugs`, `sources` (titles, URLs, publishers,
  dates), `author`, `readingTime`, `sourceUrl`, `sourceTitle`, `migration`, `illustration` paths.
- Add:
  - `translationOf: <English file name without .md>`
  - `locale: de` or `locale: es`
  - `publishAt: <YYYY-MM-DD>` (the date you are given)
  - `primaryKeyword: <from plan.json>`

## The text

- **Write for the market, not word for word.** Natural German or Spanish a native IT writer would use.
  German: formal "Sie". Spanish (Spain): informal "tú", as on the rest of the site.
- **Keywords:** put the primary keyword in the title, in the summary/excerpt, in the first paragraph and in
  one heading, naturally. Use supporting keywords where they fit. Never stuff.
  The title must still describe what the page really is: never rename a product doc after a broader search
  term, and never repeat a keyword in a heading just to place it. If a keyword reads forced, leave it out
  and say so in your report.
- **Keep everything that carries meaning, exactly:**
  - every heading level and section, in the same order;
  - every step, list item, table row and callout (`:::info`, `:::tip`, `:::warn` blocks stay, with the
    text translated);
  - every code block, command, file path, setting name, menu path that appears in software that is not
    localized, IP/port, URL and version number, unchanged (translate code comments only);
  - every link target, every image and every citation marker (`[1]`, `<a href="#source-1">` …).
- **UI labels:** if the software has a localized interface (Windows, macOS), give the localized label and
  the English one in parentheses the first time, e.g. „Remotedesktopverbindung" (Remote Desktop
  Connection). StealthRDP client area and Citadel panel labels stay in English, in quotes.
- **Links:** links to `/plans`, `/windows-vps`, `/linux-vps`, `/faq`, `/about`, `/status`, `/privacy`,
  `/citadel`, `/` get the language prefix (`/de/plans`). Links to `/docs/...`, `/citadel/docs/...` and
  `/blog/...` also get the prefix; the site sends readers to English automatically while a translation is
  not live yet. External links stay as they are.
- **Facts:** only what `PRODUCT_FACTS.md` and the English original say. Never mention a German or Spanish
  data centre (locations: Amsterdam (EU) and Phoenix (USA)). Never say a Windows licence is included.
  Microsoft's Mac and iOS Remote Desktop app is now called "Windows App" (formerly Microsoft Remote
  Desktop).
- **Policy pages** (introduction, use of service, termination, payment terms, user responsibilities)
  start with this callout, then the translated text:
  - de: `:::info` / „Diese Übersetzung dient nur der Information. Rechtlich verbindlich ist die [englische Fassung](/docs/<slug>)." / `:::`
  - es: `:::info` / «Esta traducción es solo informativa. La versión legalmente vinculante es la [versión en inglés](/docs/<slug>).» / `:::`

## Before you hand back

Run the parity check and fix every failure:

```bash
node scripts/check-translation.mjs <path to your file>
```

It compares your file with the English original: sections, steps, code blocks, links, images, callouts,
citation markers and front matter.

## What happens after you hand back

- The page goes live on its `publishAt` day (UTC), not when it is merged: `node scripts/i18n-publish.mjs`
  adds every due translation to `src/content/i18n/published-routes.json` and the next build serves it
  (CONTRIBUTING.md, recipe 13). Before that day the URL returns 404.
- The build fails on a broken file, so check the front matter: put a value that contains `: ` in quotes
  (`summary: "Paso 1: ..."`), keep `publishAt` as `YYYY-MM-DD`, and keep the file name of the English
  original.
- Prefixed links (`/de/docs/...`) to pages that are not live in your language yet are sent to the
  English page automatically; you do not need to change them later.
