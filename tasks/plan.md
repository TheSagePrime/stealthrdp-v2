# Sage Prime starter plan

## Foundation

- Maintain the canonical Sage Prime repository.
- Keep Clerk as the authentication boundary.
- Keep PostgreSQL and Drizzle data boundaries typed.
- Keep workspace access protected.
- Keep Polar billing behind product-owned helpers.
- Keep English and French locale support.
- Keep health, readiness, Docker, and CI checks.

## Product handoff

- Replace the foundation homepage with product-specific work.
- Preserve the reusable auth, workspace, billing, data, and deployment patterns.
- Keep product data and commercial claims out of the starter.

## Release requirements

- Run type generation and typecheck.
- Run lint and format checks.
- Run unit and integration tests.
- Run the production build.
- Review dependency notices.
- Keep secrets outside Git.
- Push through the GitHub and deployment pipeline.
