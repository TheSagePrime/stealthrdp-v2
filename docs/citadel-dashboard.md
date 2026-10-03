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

## Verified API surface and remaining limits

The handoff v1 OpenAPI determines the supported paths and methods. The live v1 YAML matched the
supplied YAML byte-for-byte. With the owner's approval, read-only checks inspected the documented
organisation's resources and the signed-in customer portal. Request bodies were recovered from its
public frontend modules; they were parsed as source, not executed. No live mutation, token mint or
customer credential extraction was performed. The handoff, platform credential, downloaded modules
and private example identifiers remain outside git. Tests contain synthetic `example.invalid` data.

`validation.ts` supplies strict, bounded schemas for those confirmed mutation bodies. Unsupported
properties, duplicate/unknown queries and oversized bodies fail closed. It constructs policy update
flags on the server and checks presets against the current API options. Origin hostnames must be
part of the selected domain; backend URLs cannot contain credentials, paths, queries or fragments.
Origin health checks must select an enabled saved origin. Schedule, webhook and key removals require
membership in the current domain/customer collection. Customer API calls never include a platform
key or organisation override header. A partial upstream result is a 409 with a safe message, rather
than an unconditional success.

| Customer feature | Implemented |
| --- | --- |
| Domains | List/search, separate protection and Cloudflare DNS status, add/remove, connection refresh, protection repair |
| Origins and health | Edit hostname/backend URL/TLS via URL scheme/enabled state, add hosts, remove subdomain origin, probe saved enabled host, backend summary |
| Protection | Challenge and auto baseline, rate preset, blocklists and supported soft mode, lockdown allowlist |
| Policy | IP/CIDR/path/agent allowlists, session/ban/auto thresholds, path rules, country/ASN lists, HTTP methods and per-method overrides |
| Incident and schedules | Start/clear timed incident; create/edit/enable/disable through edit form/remove schedules |
| Delivery | Cache configuration and full/prefix purge, ordered outbound speed rules, branding shell text editor and per-page default restoration |
| Traffic/activity | Own-domain scope and time windows, historical traffic/bandwidth charts, 15-second proxy snapshots, log filters and event/log pagination |
| Organisation | Service/entitlements, notification feed, email-event/BCC settings, team metadata, webhook add/remove, key metadata/revocation |

Read projections are explicit allowlists. Editable values are returned in a separate bounded DTO.
Unknown fields, credentials and upstream errors are excluded; log query strings are dropped.
Webhook URLs are never returned. Branding HTML is escaped text in a code block/textarea: no iframe,
`srcDoc`, `dangerouslySetInnerHTML`, local execution or CSP relaxation. Metadata limits are 500
domains and 50 display rows; paginated logs/events use 25 rows, historical chart data allows up to
1,000 points within the 1 MiB upstream response cap.

Deliberate exclusions:

- **WHMCS login and token minting remain deferred.** The authenticated existing portal confirms the
  current WHMCS integration; it does not verify the required website OIDC authorization-code/PKCE
  flow. There is no password fallback or runtime session issuer.
- Fleet-wide temporary bans and unlock are not exposed, including the ban reader. The existing UI
  explicitly describes proxy-wide bans; the supplied API cannot demonstrate their tenant isolation.
- Identity/email changes and team invitations/promotions are not exposed. Identity remains WHMCS-owned.
  API-key creation is omitted; it would require a separate one-time credential delivery design.
- Organisation switching is omitted: the User schema identifies one current organisation, with no
  customer membership-list API. No admin fleet endpoint is used to discover customers.
- Schedule management stores configuration only. The existing portal says schedules are applied
  while that portal runs; this implementation does not add a background scheduler or silently run
  protection writes. Confirm operator-side execution before relying on unattended schedules.
- Protection presets can be set individually. The existing portal's composite profiles perform
  several non-atomic calls; this UI avoids presenting those as one transactional change.

All mutations require an explicit dashboard confirmation and an owner/admin role. Before enabling
customer login, exercise each write in an isolated staging organisation using minted user-scoped
credentials, including plan limits, role denial, tenant isolation, revocation and incident reversion.
The production inspection established shapes and UI semantics, not successful production writes.

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
- Before enabling login, verify the confirmed actions and response adapters with an isolated test
  organisation, including denied foreign-organisation/domain IDs and a revoked-session retry.

This PR is an integration foundation, not an enabled production customer portal. Merge/deployment
and the `architecture-approved` label remain owner actions.
