# StealthRDP v2 Security and Privacy

The website is public-facing, but its backend, data, logs, deployment, and build chain remain security boundaries.

The machine-readable source of truth is `security.contract.json`; `pnpm check:security` enforces deterministic rules.

## Public-by-default surface

Marketing pages are public. WHMCS remains the only customer identity source.

The explicitly requested Citadel customer subsystem at `/citadel/app` is separate from marketing.
WHMCS login is deferred: there is no session-issuing route, credential form, development bypass or
alternative identity provider. Every customer API denies requests without a valid encrypted session.

## Citadel customer boundary

- `src/features/citadel/{session,http,upstream,projection,operations}.ts` are server-only.
- A future WHMCS OIDC callback must validate authorization code + S256 PKCE, state, nonce, signed ID
  token issuer/audience/expiry, and verified email before minting a user-scoped Citadel credential.
  It must verify the minted principal via `/api/v1/auth/me` before invoking `sealSession`.
- The cookie is AES-256-GCM encrypted, bound to its name with authenticated additional data, and
  uses a random IV, httpOnly, Secure, SameSite=Lax, host-only scope and a maximum 15-minute lifetime.
  `SESSION_SECRET` must contain a base64-encoded 32-byte random key. No token enters a browser DTO.
- Each data request rechecks the Citadel user principal and organisation via the customer credential.
  The browser organisation identifier must equal the verified principal's organisation. Domain
  reads and changes also require membership in that organisation's current user-scoped domain list.
- Mutations require matching Origin and an unpredictable session-bound CSRF header. Members are
  read-only; logout is permitted for every authenticated role. Logout revokes the Citadel session
  where reachable and always clears the local cookie after a valid CSRF check.
- Routes use the existing bounded process-local rate limiter (aggregate and subject buckets).
  Distributed deployment limits also require a platform/WAF rule before customer access is enabled.
- Browser calls are restricted to explicit customer endpoint/method allowlists. No admin proxy,
  browser-supplied bearer credentials, tenant-override headers or arbitrary upstream query exists.
  Upstream redirects are rejected, requests time out after eight seconds, and responses are bounded
  to 1 MiB. Display projection drops unknown fields, credential fields, HTML and log query strings.
- Errors never include upstream response bodies or credentials. Responses use private/no-store,
  noindex and no-referrer headers. Customer routes are excluded from robots and sitemap output.
- Non-production environments cannot contact the production Citadel origin. They require a separate
  HTTPS `CITADEL_API_BASE_URL`; production platform keys must not be configured in preview/local.
- Marketing tracking is mounted only in the marketing layout, outside the customer layout.
- The confidential handoff and its key are not committed. The remaining integration constraints
  and unsupported payloads are recorded in `docs/citadel-dashboard.md`.

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
