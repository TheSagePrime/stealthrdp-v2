# Sage Prime Web Security and Privacy

The web starter is public-facing, but its backend, data, logs, deployment, and build chain remain security boundaries.

The machine-readable source of truth is `security.contract.json`; `pnpm check:security` enforces deterministic rules.

## Public-by-default surface

Pages and free tools are expected to be publicly reachable unless a child project deliberately introduces a protected subsystem.

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

## Supply chain

- pnpm is canonical.
- CI uses frozen installs.
- production dependencies are audited.
- GitHub Actions remain pinned to immutable commit SHAs.
- releases use the exact successfully tested SHA.
- likely live secrets/private keys are rejected by repository checks.

## SEO safety

SEO/public frontend code may consume approved read-only evidence, but must not mutate backend systems or expose raw sensitive backend records.
