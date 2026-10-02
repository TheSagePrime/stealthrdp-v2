# Citadel customer dashboard integration

## Current implementation

`/citadel/app` is a separate customer surface using the site's components and tokens. It includes
overview/domain status, search, per-domain security/origin/delivery/activity views, service and
bandwidth, traffic, notification preferences, team, webhook and API-key metadata views. Loading,
empty, failure, expired-session and read-only-role states are included. Destructive actions require
confirmation. Registration and billing link to `dash.stealthrdp.com`.

**Customer login is deferred.** An ordinary visitor gets an access-closed page. No public route can
issue a cookie or mint a Citadel credential. There are no runtime mock records or bypass switches.
UI tests use synthetic records in `example.invalid` exclusively through mocked browser requests.

## Offline contract limitations

The supplied OpenAPI defines the User schema, paths and methods, but almost every resource omits
response schemas and mutation request bodies. The handoff and platform credential remain outside
the repository. No guessed setting-write payload is shipped.

The server currently accepts a domain array or `{ domains: [...] }` with a UUID `id`, hostname
(`domain`, `hostname` or `name`), optional `status`, and optional `organization_id`. These adapters
need confirmation against an isolated test account before production access. A malformed shape
fails closed with 502; an explicit foreign organisation fails with 403.

Other resources are projected through an explicit display-key allowlist. Unknown properties do not
reach the client. This is intentionally a conservative read adapter, not a complete response schema.
Confirmed response schemas must replace/extend it to ensure every live setting and metric renders.
Pagination, time-range filters, complete log searching and traffic charts need those contracts too;
the current reader bounds domain lists to 500 and display records to 50.

| Operation | Current support |
| --- | --- |
| Domain list, status and local search | Read adapter; verify live response schema |
| Domain settings, origin/backend, events/logs | Allowlisted GET projections |
| Service/bandwidth, analytics/live, notifications, team, webhooks, key metadata | Allowlisted GET projections |
| Domain connection refresh | Checked POST `/api/v1/domains/{id}/refresh` |
| Origin health probe | Checked POST `/api/v1/domains/{id}/origin-check` |
| Restore protection defaults | Checked POST `/api/v1/domains/{id}/restore-defaults` with UI confirmation |
| Remove domain | Checked DELETE `/api/v1/domains/{id}` with UI confirmation |
| Add domain, PATCH settings, origin edits, cache purge, incident/schedule/ban changes | Deferred pending payload schemas |
| Branding edits, notifications, team, webhooks and API-key creation/revocation | Deferred pending payload schemas and role rules |
| Customer organisation switching | Deferred; User has one organisation and no customer membership-list endpoint |

The four shipped mutation handlers send no body; confirm these bodyless operations against the
test account before enabling customer access. The API refuses all extra browser queries and bodies.

## Future WHMCS callback

1. Confirm WHMCS supports the required authorization-code + S256 PKCE flow. Missing discovery
   metadata alone is not proof of missing support. Register production and isolated preview clients
   with exact redirect URIs. Do not use a credential form or `ValidateLogin` fallback.
2. On the server, validate state, nonce, verifier, signed ID-token issuer, audience and expiry, then
   obtain a verified customer email. Treat signed email verification as mandatory; never use a
   browser email or a loosely matched account email.
3. Production only: use environment `CITADEL_PLATFORM_API_KEY` to POST
   `/api/admin/platform/access-token` for that verified email. Never proxy this route to a browser.
4. With the minted user credential, call `/api/v1/auth/me`. Require the same verified email,
   `email_verified: true`, `auth_type: session`, and valid UUID user/organisation identifiers.
   Determine the actual credential expiration from a documented mint response; reject a missing
   or expired expiration rather than assuming an indefinite token lifetime.
5. Call server-only `sealSession({ bearer, email, subject: principal.id, expiresAt })`, then set its
   output with `sessionCookie(value, maxAge)`. Session times use Unix seconds. This helper caps the
   lifetime at 15 minutes and creates the session-bound CSRF value. It does not authenticate an
   identity itself; only the verified callback may call it. Revoke the minted token if setup fails.
6. Redirect to `/citadel/app` via a full document navigation. No credentials or tokens in URLs,
   JSON, browser storage, telemetry, exception messages or logs. Do not add a development issuer.
7. Add login/callback-specific rate limits, replay prevention and regression tests when those
   routes are introduced. There are no login routes to rate-limit in this change.

## Environment and deployment

- `SESSION_SECRET`: base64-encoded cryptographically random 32-byte key; store as a server secret.
  Rotating it invalidates all dashboard cookies. HTTPS is required, including customer integration
  tests; cookie Secure is never disabled for local development.
- `CITADEL_API_BASE_URL`: production defaults to `https://citadel.stealthrdp.com`. Preview/local
  require a separate HTTPS staging origin; the production hostname is rejected outside production.
  Production detection follows the existing `VERCEL_ENV` → `APP_ENV` → `NODE_ENV` policy.
- `CITADEL_PLATFORM_API_KEY`, `WHMCS_OIDC_CLIENT_ID`, `WHMCS_OIDC_CLIENT_SECRET`: reserved for the
  future callback and unused in this PR. Never install a production platform key in preview/local.
- Rate limits use the existing bounded in-process helper: aggregate 600/minute and 90/minute per
  session subject. Set distributed platform/WAF limits before enabling customer access on multiple
  instances. No IP identity is inferred from untrusted forwarding headers.
- The CSP is unchanged. Keep browser fetches same-origin; Citadel connections happen on the server.
- Marketing trackers are outside the customer layout. Use full document navigation for any future
  marketing-to-customer entry link so previously loaded marketing scripts cannot follow navigation.
- Before enabling login, verify the supported actions and response adapters with an isolated test
  organisation, including denied foreign-organisation/domain IDs and a revoked-session retry.

This PR is an integration foundation, not an enabled production customer portal. Merge/deployment
and the `architecture-approved` label remain owner actions.
