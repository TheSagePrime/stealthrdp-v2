# StealthRDP v2 Architecture

## Purpose

StealthRDP v2 is the public product and traffic surface for StealthRDP: https://www.stealthrdp.com.
It is built on the Sage Prime public-web foundation and is separate from the billing/client backend.

## System boundaries

| System | Owns | URL |
|---|---|---|
| This repository | marketing pages, plan comparison, Windows/Linux pages, Citadel product page, Help Center, Citadel docs, guides, FAQ, status page, about, privacy, SEO, structured data, sitemap, robots, RSS, `llms.txt` | `www.stealthrdp.com` |
| WHMCS | login, checkout, billing, client accounts, tickets, service actions | `dash.stealthrdp.com` |
| Citadel panel | the Citadel protection product | `citadel.stealthrdp.com` |
| UptimeRobot | uptime monitoring (read through `/api/uptime`) | public status page |
| Server-side GTM | analytics and ad tags (GA4, Google Ads, Meta pixel, Yandex verification) | `sgtm.stealthrdp.com` |

The website links into WHMCS. It does not copy WHMCS authentication, billing or dashboard logic.

## Stack

Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4, shadcn/ui + Radix, next-intl
(`en`, `de`, `es`; see "Languages"), fumadocs (Help Center layout), CSS Modules plus global CSS layers, pnpm, Node 24 LTS.
Neon/Drizzle/PGlite stay available for future public-site data. No page reads a database today; only
the `/api/ready` probe runs `select 1` when `DATABASE_URL` is set. It is not a customer or tenant
database.

## Hosting

| Environment | Branch | Host | Notes |
|---|---|---|---|
| Production | `main` | Vercel project `stealthrdp-v2`, region iad1, Node 24 | `APP_ENV=production`, `SITE_URL=https://www.stealthrdp.com`. Domains: `www.stealthrdp.com` (primary) and `stealthrdp.com` (redirects to www). |
| Preview | `redesign/homepage-production-parity` | Coolify, `Dockerfile` (node:24-bookworm-slim) | `APP_ENV=preview`, `SITE_URL=https://preview.antah.de`. Never indexed. |
| v1 (old site) | — | Vercel project for `TheSagePrime/stealthrdp` | Locked: no domains, no builds, Vercel URLs need a Vercel login. Rollback only. |

Deploy environment detection: `VERCEL_ENV`, then `APP_ENV`, then `NODE_ENV`
(`src/libs/seo/env.ts`). Production-only output (analytics, structured data, `llms.txt`,
indexable robots) checks this, so a preview can never publish it.

## Request flow

1. **`src/proxy.ts`** (Next.js middleware) runs first:
   - redirects to the canonical origin in production (`https://www.stealthrdp.com`, trailing slash
     removed). It reads `X-Forwarded-Host`/`X-Forwarded-Proto`, so it works behind Traefik and Vercel;
   - answers `Accept: text/markdown` on `/` with `llms.txt`;
   - sets the `sr_region` cookie (`eea` or `other`) from Vercel's `x-vercel-ip-country` header for
     the consent rules;
   - routes languages with next-intl: English pages stay at the root and are rewritten to the `en`
     locale; `/de/...` and `/es/...` render German and Spanish. `/en/...` redirects to the root URL.
     No redirect by country or browser language, and no language cookie.
2. **`next.config.ts`** adds security headers (CSP, HSTS, frame denial and others) and the
   permanent redirects for old v1 and WHMCS-era URLs.
3. **The page** renders on the server. Most pages are static; pages that show stock revalidate every
   6 hours.

## Where things live

```text
src/app/[locale]/(marketing)/   one folder per page (page.tsx), plus layout.tsx (header, footer, WhatsApp)
src/app/[locale]/layout.tsx      <html>, global styles, TrackingConsent (production only)
src/app/api/                     health, ready, uptime (UptimeRobot proxy)
src/app/{sitemap,robots}.ts      sitemap and robots (protected)
src/app/llms.txt, llms-full.txt  AI-agent summaries in Markdown (production only)
src/app/docs-md/[slug]/         Markdown copies of articles, guides, FAQ and product pages (noindex)
src/app/rss.xml, search-index.json
src/components/site/             StealthRDP components (header, footer, pricing, status, citadel/, os/, home/ …)
src/components/ui/               shadcn/Radix primitives — reuse, do not fork
src/content/                     all editable content (see "Data")
src/content/i18n/<lang>/         page words per language (en, de, es); see "Languages"
src/config/i18n.ts               languages and the publish list (`localizedRoutes`)
src/lib/stealth/                 content loaders, plan stock, checkout URLs, structured data, routes
src/libs/seo/                    SEO engine: metadata, canonical URLs, articles, audits (protected)
src/config/seo.ts                route list for sitemap/audit, legacy links, brand data
src/styles/                      global.css (tokens, protected), stealth-v3.css (brand layer),
                                 resources.css (Help Center), stealth.css + surfaces.css (older layers)
scripts/                         contract checks, governance check, SEO pre/post-build
```

## Data

All content is in files under `src/content/`, reviewed through pull requests:

| Content | File(s) | Loaded by |
|---|---|---|
| VPS plans (prices, specs, regions) | `plans.json` | `src/lib/stealth/content.ts` |
| VPS stock | live from the WHMCS store pages, every 6 hours | `src/lib/stealth/live-plans.ts` |
| Guides (blog) | `guides/<slug>.md` (front matter + Markdown, rendered by `src/lib/stealth/guide-markdown.ts`) | `src/lib/stealth/articles.ts` |
| Help Center and Citadel docs | `docs/<slug>.md`, `docs/citadel-<name>.md` | `src/lib/stealth/articles.ts` |
| FAQ | `faqs.json` | `content.ts` |
| Reviews | `testimonials.json`, `reviews.json` | `content.ts` |
| Status fallback snapshot | `uptime.json` | `/status` |
| RDP VPS guide | `rdp-vps.ts` | `/rdp-vps` |
| AI-agent summary | `llms.md` | `/llms.txt` |
| Archive (not rendered) | `features.json` | migration test only |

Checkout links are built by `checkoutUrl()` in `src/lib/stealth/checkout.ts`.

## Languages

English is the default and stays at the root URLs. German (`/de`) and Spanish (`/es`) are written
from local keyword research (`.sageprime/seo/keyword-map-*.json`), not translated line by line.

- **Publish list.** `localizedRoutes` in `src/config/i18n.ts` lists the pages that exist in each
  language. A page outside the list returns 404 under `/de` or `/es` (`requirePageLocale()` in
  `src/lib/stealth/i18n-server.ts`), has no hreflang tag and is not in the sitemap. Guides and docs
  are added to the list in batches.
- **Words.** `src/content/i18n/en/<page>.ts(x)` holds the English words of a page and its type;
  `de/` and `es/` hold the same shape. Pages and components read `copy[locale]`; the shared frame
  (header, footer, cookie banner) reads `src/content/i18n/site.ts`.
- **Links.** `localeHref()` (`src/lib/stealth/i18n.ts`) keeps a visitor in their language when the
  target page is published in it, and falls back to the English URL; `linkLabel()` marks such links
  as English.
- **hreflang.** `hreflangAlternates()` (`src/libs/seo/locale.ts`) gives each published language plus
  `x-default` (English). Metadata and the sitemap use it; the post-build audit fails on a missing or
  extra language and on an unpublished language URL that does not return 404.
- **Checkout.** `checkoutUrl()` adds `language=german` or `language=spanish`, so WHMCS opens in the
  visitor's language.

## SEO pipeline

- `pnpm build` = `seo:pre-build` (config and content validation) → `next build` → `seo:post-build`
  (starts the built site and crawls every public route: status codes, titles, descriptions,
  canonicals, robots, internal links, duplicate titles).
- Routes: `src/config/seo.ts` — `publicMarketing` and `dynamicPublic` are indexable and in the
  sitemap; `publicUtility` pages are noindex. Guides, Help Center and Citadel docs are added
  automatically; `noindexDocPaths` in `src/lib/stealth/routes.ts` excludes policy pages.
- Metadata: `createPageMetadata()` (`src/libs/seo/metadata.ts`) gives title, description, canonical,
  robots, Open Graph (`og:type`, `og:site_name`), Twitter card and the RSS link.
- Structured data (production only): Organization `@id` `https://www.stealthrdp.com/#organization`,
  WebSite, Service + offers (home, plans, Windows/Linux VPS, Citadel), FAQPage, BlogPosting,
  TechArticle, BreadcrumbList. Helpers: `src/lib/stealth/structured-data.ts`, `src/libs/seo/`.
- AI search: `robots.txt` allows all crawlers, AI crawlers included, and has no `Content-Signal`
  line (no major crawler reads it, and Bing's tester reports it as an error); `/llms.txt` and
  `/llms-full.txt` give Markdown summaries, and `/docs-md/<slug>` serves noindex Markdown copies
  of every article, guide, the FAQ and the plans, Windows VPS, Linux VPS and Citadel pages
  (generated from the same data as the pages). `.github/workflows/indexnow.yml` sends pages whose
  words changed to IndexNow after each production deploy.

## Analytics, ads and consent

- Tags load only through `src/components/site/TrackingConsent.tsx`, in production:
  the server-side GTM container (`sgtm.stealthrdp.com`) and DataFast.
- EU/EEA/UK/Switzerland (`sr_region=eea`, also the default when the country is unknown): nothing
  loads until the visitor selects Accept. Other countries: tags load by default; "Cookie settings" in
  the footer opens the choice again. The choice is stored in `localStorage` (`sr-consent`).
- The CSP in `next.config.ts` allows only the hosts these tags were measured to use. See
  [SECURITY.md](SECURITY.md).

## Observability

Sentry loads only when `NEXT_PUBLIC_SENTRY_ENABLED=true` (dynamic import, PII off). Vercel keeps
runtime logs. UptimeRobot monitors the servers; `/status` shows its data.
