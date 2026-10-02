# StealthRDP v2 Security and Privacy

The website is public-facing, but its backend, data, logs, deployment, and build chain remain security boundaries.

The machine-readable source of truth is `security.contract.json`; `pnpm check:security` enforces deterministic rules.

## Public-by-default surface

Pages are public. There are no logins or customer data on this site; WHMCS holds them.

There is no default identity provider, tenant model, or billing identity. Do not reintroduce those concepts casually.

## Server-only data

Database connections, logging credentials, rate-limit state, same-origin helpers, and sensitive response helpers remain server-only.

Public/SEO surfaces must not directly import the database connection or schema. Expose only the minimum project-specific data needed by a public page or tool, through a server-owned boundary.

## Database

Production uses Neon PostgreSQL through Drizzle and `pg`.

- Production non-local connections require `sslmode=require` or stronger.
- Pool size and timeouts are bounded.
- Readiness probes are cached briefly and coalesced.
- PGlite remains local development infrastructure.

## Public tools and APIs

Free tools may use API Route Handlers. Expensive or mutation endpoints should deliberately apply the existing rate-limit, same-origin, validation, and sensitive-response helpers where appropriate.

Do not assume that "public" means "unlimited" or "safe to mutate."

## Observability

Sentry PII and replay default off. Client telemetry is opt-in. Better Stack credentials remain server-only. Browser-to-terminal logging and source-map upload are explicit opt-ins.

## HTTP and browser security

The starter preserves CSP, HSTS in production, frame denial, referrer policy, permissions policy, COOP, and `nosniff`.

The base CSP intentionally contains no Clerk, Polar, or Stripe origins.

The CSP is in `next.config.ts` (protected). Third-party hosts are kept in one `tagHosts` object and
each host is there because a browser test of the live site showed the tags need it:

- `script-src`: the sGTM container, DataFast, Google Tag Manager, Google Ads remarketing, the Meta
  pixel and its Conversions API parameter builder path, the Yandex verification template path.
- `connect-src`: Sentry, sGTM, DataFast, Google Analytics, Google Ads collection endpoints.
- `frame-src`: YouTube, the sGTM service-worker frame, `www.facebook.com` (Meta pixel fallback).
- `form-action`: `'self'` and `www.facebook.com` (Meta pixel fallback).

To add a host: reproduce the block in the browser console, add only that host (with a path when the
host is shared, such as an S3 bucket or a CDN), and explain it in the pull request. Do not add
wildcards that cover a whole platform.

## Tracking and consent

- Trackers load only through `src/components/site/TrackingConsent.tsx`, and only in production.
- EU, EEA, UK and Switzerland: nothing loads before the visitor selects Accept. When the country is
  unknown, the site treats the visitor as EU.
- Other countries: tags load by default, and "Cookie settings" in the footer lets the visitor opt out.
- The privacy page names every tool that receives visitor data. A new tool needs a privacy-page
  update in the same pull request.
- In GTM, the Meta pixel tag should require `ad_storage` consent.

## Supply chain

- pnpm is canonical.
- CI uses frozen installs.
- production dependencies are audited.
- GitHub Actions remain pinned to immutable commit SHAs.
- releases use the exact successfully tested SHA.
- likely live secrets/private keys are rejected by repository checks.

## SEO safety

SEO/public frontend code may consume approved read-only evidence, but must not mutate backend systems or expose raw sensitive backend records.
