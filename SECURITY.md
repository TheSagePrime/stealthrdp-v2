# Sage Prime Security and Privacy

Security is a repository contract, not an agent preference. The machine-readable source of truth is `security.contract.json`; `pnpm check:security` enforces objective rules in CI and local hooks.

## Authentication and authorization

Every API Route Handler is private by default unless it appears in the explicit public API allowlist.

Sensitive Route Handlers must authenticate at the resource itself. Middleware may provide Clerk session context and improve UX, but it is not the only security boundary.

Use `getAuthenticatedPrincipal()` to derive:

- the Clerk user ID
- the active Clerk organization ID, when present
- the tenant ID
- the external billing identity

Never accept a user ID, organization ID, Polar customer ID, or external customer ID from the browser when the server can derive it from the authenticated session.

## Tenant isolation

Product data must be scoped by the authenticated tenant. Direct database imports are restricted to the approved data/runtime boundaries. Feature code should receive a tenant scope rather than constructing unscoped queries.

Cross-tenant access tests are mandatory when a child product adds persistent tenant-owned data.

## Billing

Polar checkout:

- requires authentication
- accepts only product IDs configured in `POLAR_PRODUCT_IDS`
- derives `external_customer_id` from Clerk server-side
- requires the active Organization's `org:admin` role for organization billing; personal billing remains available to the signed-in user
- rate-limits checkout session creation
- rejects untrusted redirect URLs

Polar customer portal:

- requires authentication
- never accepts a customer selector from request input
- creates the customer session from the authenticated Clerk principal
- requires the active Organization's `org:admin` role for organization billing
- rate-limits session creation

Polar webhooks must remain signature-verified. The starter suppresses duplicate retries within a running application process. When a child product adds durable entitlement writes, durable idempotency must live in the same database transaction/upsert boundary as those writes.

## Privacy and telemetry

The safe default is minimum collection:

- Sentry default PII collection is off
- Sentry console/log forwarding is off
- Sentry source-map upload is a separate explicit opt-in and the application does not proxy Sentry traffic by default
- Session Replay is off unless explicitly enabled
- if Replay is enabled, text and inputs remain masked and media remains blocked
- Better Stack credentials are server-only
- forwarded structured logs are redacted for common credentials and personal identifiers
- browser-to-terminal logging is opt-in

A child product must make a deliberate privacy decision before enabling broader telemetry.

## Public frontend data boundary

Public marketing, SEO, sitemap, feed, metadata, and structured-data surfaces must never expose raw private records.

The rule is provider-agnostic and applies to every child project, whether it uses Polar, Stripe, WHMCS, a custom database, or another backend.

- backend and analytics systems may be read when a workflow has legitimate read access
- SEO/public-frontend work must never mutate backend/application state
- public marketing and SEO code must not directly import customer, billing, database, principal, entitlement, or private model layers
- never serialize raw users, customers, account records, emails tied to users, addresses, payment details, orders, invoices, subscriptions, credentials, auth/session tokens, or provider objects into public HTML, metadata, JSON-LD, feeds, sitemaps, public API responses, or client props
- use explicit public DTOs or aggregated/de-identified analytics when data must cross into a public surface
- authenticated/private product pages may show the signed-in user's own authorized data, but they remain private/noindex and are outside the public SEO surface

The security contract and rejection tests protect the generic Starter boundary. Child projects must extend the same contract when they add new backend providers or sensitive modules.

## HTTP/browser security

The starter sets a CSP and baseline browser protections, including frame denial, referrer policy, permission restrictions, content-type sniffing protection, cross-origin opener isolation, and production HSTS.

Any CSP expansion should be narrow and provider-specific.

## Secrets

Runtime secrets belong in Coolify/runtime secret storage, never Git. Only variables intentionally safe for browsers may use the `NEXT_PUBLIC_` prefix.

Do not print secrets in logs, errors, CI output, screenshots, artifacts, or telemetry.

## Supply chain and CI

- pnpm is the only package manager
- frozen lockfile installs are required
- production dependencies are audited in PR CI
- third-party GitHub Actions are pinned to immutable commit SHAs
- ordinary CI receives read-only repository permissions
- secret-bearing jobs run only from trusted repository code
- releases run only after successful CI and use the exact tested SHA

## Coolify production posture

The repository cannot enforce host/container policy without a deployment manifest, so Coolify must enforce these controls at runtime:

- terminate HTTPS and redirect plain HTTP before application traffic reaches the service
- keep Clerk, Polar, Sentry build credentials, Better Stack credentials, and `DATABASE_URL` in runtime secret storage rather than Git or image build arguments
- expose only the application HTTP port; never expose Neon/PostgreSQL or local PGlite storage as a public service
- use `/api/health` for liveness and `/api/ready` for readiness
- configure CPU/memory limits and restart policy so abuse or memory growth cannot exhaust the host
- run the application as an unprivileged user when the selected Coolify build/runtime supports it
- perform reviewed database migrations as an explicit deployment/release step rather than an uncontrolled request-time action
- preserve trusted reverse-proxy host/protocol handling so origin checks and HTTPS canonicalization see the real public application origin
- do not enable multiple application replicas until rate limiting and webhook idempotency that require cross-instance consistency have a shared/durable store

## Verification

Run:

```bash
pnpm check:security
pnpm test:security
pnpm check:architecture
pnpm test
pnpm build
```

Do not weaken security checks to make an implementation pass. If a rule genuinely needs to change, treat it as a reviewed security architecture change.
