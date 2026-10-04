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

The website links into WHMCS for authentication, registration, billing and account management.
The owner explicitly requested a separate Citadel customer interface at `/citadel/app`.
WHMCS OpenID Connect owns its identity: `/api/citadel/auth/start` and `/api/citadel/auth/callback`
implement the authorization-code + S256 PKCE flow and the callback is the only session-issuing
route. Live PKCE, nonce and verified-email support is not yet confirmed against the provider, so the
sign-in fails closed and the open gates are recorded in `docs/citadel-dashboard.md`.

## Citadel customer interface

`src/app/[locale]/(customer)/citadel/app` renders the customer shell separately from the marketing
layout. Existing shadcn primitives and design tokens are reused. Marketing trackers, footer and
floating support controls are not mounted in this subsystem. The route and API responses are
noindex, no-referrer and private/no-store, robots-disallowed, and never added to the public sitemap.

`src/app/api/citadel/` is a server-owned boundary. It decrypts the short-lived host-only session,
checks CSRF for mutations, revalidates the user and their organisation with Citadel, checks domain
membership, then forwards only an allowlisted customer operation using the customer's credential.
It does not forward the platform key or arbitrary browser-supplied paths, headers, bodies or queries.
Only allowlisted display and editing DTOs are returned to the browser. There is no local customer database.

`src/app/api/citadel/auth/{start,callback}` are the only identity routes. Start seals a single-use
state, nonce and S256 PKCE verifier into a host-only transaction cookie and redirects to WHMCS.
Callback validates the transaction, verifies the signed ID token and the email, mints a user-scoped
credential with the operator-only platform key on the server, verifies it against `/api/v1/auth/me`,
and only then seals the 15-minute session. Failed attempts return one public failure code. See
`docs/citadel-dashboard.md` for the flow and the open live-test gates.

The handoff's User schema has one current organisation per user, and no customer organisation
listing/switching endpoint. The UI therefore exposes that verified organisation only. It must never
enumerate the fleet-wide admin organisation endpoint to populate a customer selector.

The OpenAPI omits most payload schemas. Read-only live API and signed-in customer-portal inspection
confirmed the data fields and control bodies; strict validators now support domain/origin edits,
protection policy, incident/schedule configuration, cache, speed limits, branding, email alerts,
webhooks and key revocation. Traffic charts, filters and pagination use validated query fields.
Nested resource identifiers must be present in the current customer collection before mutation.
Fleet-wide bans/unlock, identity/team changes, key creation and organisation switching remain
unavailable. Branding is edited as escaped text without executing HTML or expanding CSP.
See `docs/citadel-dashboard.md` for the verified scope, staging checks and scheduler limitation.

## Stack

Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4, shadcn/ui + Radix, next-intl
(one locale, `en`), fumadocs (Help Center layout), CSS Modules plus global CSS layers, pnpm, Node 24 LTS.
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
   - rewrites every page to the `en` locale (next-intl).
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
src/app/llms.txt, llms-full.txt  AI-agent summaries (production only)
src/app/rss.xml, search-index.json
src/components/site/             StealthRDP components (header, footer, pricing, status, citadel/, os/, home/ …)
src/components/ui/               shadcn/Radix primitives — reuse, do not fork
src/content/                     all editable content (see "Data")
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
| Guides (blog) | `guides/<slug>.html` (front matter + HTML) | `src/lib/stealth/articles.ts` |
| Help Center and Citadel docs | `docs/<slug>.md`, `docs/citadel-<name>.md` | `src/lib/stealth/articles.ts` |
| FAQ | `faqs.json` | `content.ts` |
| Reviews | `testimonials.json`, `reviews.json` | `content.ts` |
| Status fallback snapshot | `uptime.json` | `/status` |
| RDP VPS guide | `rdp-vps.ts` | `/rdp-vps` |
| AI-agent summary | `llms.md` | `/llms.txt` |
| Archive (not rendered) | `features.json` | migration test only |

Checkout links are built by `checkoutUrl()` in `src/lib/stealth/checkout.ts`.

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
- AI search: `robots.txt` allows all crawlers and sets `Content-Signal: ai-train=no, search=yes,
  ai-input=yes`; `/llms.txt` and `/llms-full.txt` give plain-text summaries.

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
