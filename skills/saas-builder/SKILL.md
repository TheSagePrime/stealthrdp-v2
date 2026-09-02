---
name: sage-prime-builder
description: Build Sage Prime products from the canonical starter foundation.
---

# Sage Prime Builder

Use this repository as the canonical foundation for new Sage Prime products.

## Workflow

1. Inspect the real product repository before modifying it.
2. Keep Clerk as the authentication boundary.
3. Keep product data in Drizzle and PostgreSQL.
4. Keep workspace access server-side and fail closed.
5. Keep billing provider calls behind product-owned boundaries.
6. Replace the foundation homepage with approved product work.
7. Run typegen, typecheck, lint, format, tests, and build.
8. Push through the approved GitHub and deployment pipeline.

## Boundaries

- Product strategy and commercial claims require owner approval.
- Product-specific data must not enter the generic starter.
- Runtime secrets must remain outside Git.
- Third-party license notices must remain available.
- Do not claim live status without live evidence.
