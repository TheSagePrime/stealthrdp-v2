# Citadel customer dashboard integration

## Current implementation

`/citadel/app` is a separate customer surface using the site's components and tokens. It includes
overview/domain status, search, per-domain security/origin/delivery/activity views, service and
bandwidth, traffic, notification preferences, team, webhook and API-key metadata views. Loading,
empty, failure, expired-session and read-only-role states are included. Destructive actions require
confirmation. Registration and billing link to `dash.stealthrdp.com`.

**Customer sign-in is implemented but not yet live-verified.** `/api/citadel/auth/start` sends the
browser to WHMCS with an authorization-code + S256 PKCE request, and `/api/citadel/auth/callback`
is the only route that can create a session cookie. An ordinary visitor still gets an access-closed
page: the dashboard shows one full-document sign-in link, there is no credential form, and no public
route mints a Citadel credential. There are no runtime mock records or bypass switches.
UI tests use synthetic records in `example.invalid` exclusively through mocked browser requests.

The live gates below must pass before anyone claims a working production login. Until they do the
callback fails closed and the dashboard shows a public failure notice.

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

## WHMCS OpenID Connect sign-in

`src/app/api/citadel/auth/start` and `src/app/api/citadel/auth/callback` implement the flow in
`src/features/citadel/{login,whmcs,oidc}.ts`. WHMCS owns identity; the site has no password form and
no `ValidateLogin` fallback.

1. **Start.** The dashboard links to `/api/citadel/auth/start` as a full document navigation. A
   cross-site navigation is refused (`Sec-Fetch-Site: cross-site`) so another site cannot start a
   sign-in for this browser. The route creates a 43-character state, a 43-character nonce and an
   S256 PKCE verifier, seals all three into a single `__Host-citadel-login` cookie (host-only,
   HttpOnly, Secure, SameSite=Lax, 10 minutes), and redirects to the WHMCS authorization endpoint
   with `response_type=code`, `scope=openid profile email`, the exact registered redirect URI and
   `code_challenge_method=S256`. No secret is ever placed in a URL.
2. **Callback.** `/api/citadel/auth/callback` reads `code` and `state`. A provider `error` becomes a
   public `denied` code. The state must match the sealed transaction, and the state is consumed
   once (bounded single-use bucket plus the cleared cookie), so a replay fails with `expired`.
3. **Token exchange.** The server posts `authorization_code`, `code`, `client_id`,
   `client_secret`, `redirect_uri` and `code_verifier` from the environment only. Upstream errors
   are reduced to a generic public code; no upstream body reaches a response or a log.
4. **ID token.** The signed token must use RS256 with a key id from the provider JWKS (fetched from
   `jwks_uri`, cached five minutes, refreshed once on an unknown key id), match the configured
   issuer and client id, be valid now, live no longer than 24 hours, carry a nonce equal to the one
   this browser sent, and identify a subject. Missing claims fail closed.
5. **Verified email.** The WHMCS ID token carries no email claim, so the server calls
   `userinfo_endpoint` with the exchanged access token and requires `email_verified: true` and the
   same `sub` as the signed token. A verified `email` claim in the ID token is accepted on its own.
6. **Mint and verify.** With `CITADEL_PLATFORM_API_KEY`, the server posts the verified email to
   `/api/admin/platform/access-token`. The response must contain an `access_token` and a usable
   expiry (`expires_at` or `expires_in`); a missing expiry fails closed. The minted credential is
   then verified against `/api/v1/auth/me`, which must return `email_verified: true`,
   `auth_type: session`, UUID identifiers and the same verified email. Any mismatch revokes the
   credential (`/api/v1/auth/logout`) and fails the sign-in.
7. **Session.** Only then does the callback call `sealSession({ bearer, email, subject, expiresAt })`
   and set `sessionCookie(value, maxAge)`. Session times use Unix seconds; the helper caps the
   lifetime at 15 minutes and creates the session-bound CSRF value. The transaction cookie is
   cleared on every outcome and the browser is redirected (303) to `/citadel/app`. No credential,
   token or upstream detail appears in a URL, a JSON body, browser storage, telemetry, an exception
   message or a log.

Both routes are rate limited through the existing bounded helper (20 requests per minute each).
Failures return the dashboard with one public code only (`unconfigured`, `invalid_request`,
`denied`, `expired`, `state`, `provider`, `nonce`, `email_unverified`, `identity`, `unavailable`)
and the dashboard maps that code to plain text.

### Live-test gates

The provider metadata was read live from `https://dash.stealthrdp.com/oauth/openid-configuration.php`:

- `issuer`: `https://dash.stealthrdp.com`; `authorization_endpoint` `/oauth/authorize.php`;
  `token_endpoint` `/oauth/token.php`; `userinfo_endpoint` `/oauth/userinfo.php`;
  `jwks_uri` `/oauth/certs.php` (one RS256 key with a key id); `id_token_signing_alg_values_supported: ["RS256"]`.
- `claims_supported` lists `iss`, `aud`, `exp`, `sub` only. There is no advertised `nonce` claim,
  no advertised `email` or `email_verified` claim, `response_types_supported` is empty, and no
  `code_challenge_methods_supported` is published.

Therefore these gates stay open until a real browser sign-in confirms them against the preview
client. Until each one passes, the flow fails closed and no one may claim a working login:

1. **PKCE.** Confirm WHMCS accepts `code_challenge`/`code_challenge_method=S256` and requires the
   matching `code_verifier`, so the code cannot be redeemed without this browser transaction.
2. **Nonce.** Confirm the ID token carries a `nonce` claim equal to the value sent. A provider that
   omits it produces the public `nonce` failure; do not weaken the check.
3. **Verified email.** Confirm `userinfo` (or the ID token) returns an `email` with
   `email_verified: true` for the signed-in customer. Without it the flow reports `email_unverified`.
4. **Mint contract.** Confirm the `/api/admin/platform/access-token` response shape, including the
   documented expiry field, and that a preview key is installed for the preview deployment only.
5. **End-to-end.** Complete one sign-in on `https://preview.antah.de` with a preview client and a
   staging Citadel origin, then confirm the dashboard session, expiry, sign-out and role denial.

## Environment and deployment

- `SESSION_SECRET`: base64-encoded cryptographically random 32-byte key; store as a server secret.
  Rotating it invalidates all dashboard cookies. HTTPS is required, including customer integration
  tests; cookie Secure is never disabled for local development.
- `CITADEL_API_BASE_URL`: production defaults to `https://citadel.stealthrdp.com`. Preview/local
  require a separate HTTPS staging origin; the production hostname is rejected outside production.
  Production detection follows the existing `VERCEL_ENV` → `APP_ENV` → `NODE_ENV` policy.
- `CITADEL_PLATFORM_API_KEY`, `WHMCS_OIDC_ISSUER`, `WHMCS_OIDC_CLIENT_ID`,
  `WHMCS_OIDC_CLIENT_SECRET`, `CITADEL_LOGIN_REDIRECT_URI`: server-only sign-in configuration. A
  production platform key must never be installed in preview or local; a non-production
  environment also needs `CITADEL_PLATFORM_KEY_ALLOW_NON_PRODUCTION=true` with its own staging key.
  The redirect URI must match the URI registered on the WHMCS client byte for byte.
- Rate limits use the existing bounded in-process helper: sign-in start and callback 20/minute each,
  600/minute aggregate and 90/minute per session subject on customer requests, and one use per
  sign-in state. Set distributed platform/WAF limits before enabling customer access on multiple
  instances. No IP identity is inferred from untrusted forwarding headers.
- The CSP is unchanged. Keep browser fetches same-origin; Citadel and WHMCS connections happen on
  the server.
- Marketing trackers are outside the customer layout. The sign-in entry link and the callback
  redirect use full document navigation so previously loaded marketing scripts cannot follow
  navigation.
- Before a production release, verify the confirmed actions and response adapters with an isolated
  test organisation, including denied foreign-organisation/domain IDs and a revoked-session retry,
  and close the live-test gates above.

This PR adds the sign-in routes and keeps the customer surface gated. Live verification, deployment
and the `architecture-approved` label remain owner actions.
