# Sage Prime Starter

The canonical Sage Prime foundation for new product repositories.

This repository provides reusable application infrastructure without imposing
product-specific copy, pricing, data, or visual direction.

## Included

- Next.js App Router and TypeScript
- Clerk authentication and localized sign-in flows
- Workspace and organization access
- PostgreSQL and Drizzle database layer
- Polar billing boundaries
- Internationalization with English and French locales
- Protected dashboard routes
- Health and readiness routes
- Vitest and Playwright test structure
- Docker and GitHub Actions checks
- Reusable technical SEO pre-build and post-build validation

## Local setup

Requirements:

- Node.js `>=22`
- pnpm `10.34.5`

Install dependencies:

```bash
pnpm install --frozen-lockfile
```

Copy the environment template:

```bash
cp .env.example .env
```

Start development:

```bash
pnpm dev
```

## Required environment

Application runtime:

```text
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
DATABASE_URL
```

Production SEO/deployment:

```text
APP_ENV=production
SITE_URL=https://your-canonical-domain.example
```

`SITE_URL` must be the canonical origin only. Do not include a path, query, or fragment.
Production non-local `SITE_URL` values must use HTTPS.

Keep `.env` and `.env.production` outside Git.
Use Coolify environment variables for deployed applications.

## Checks

```bash
pnpm typegen
pnpm check:types
pnpm check:oxlint
pnpm check:format
pnpm test
pnpm build
```

`pnpm build` runs the complete production build chain:

```text
SEO pre-build -> Next.js build -> SEO post-build runtime crawl
```

The post-build audit crawls the freshly built application locally while still validating metadata, canonicals, robots, sitemap, and other SEO output against `SITE_URL`. It must not depend on the public production hostname being reachable during image construction.

SEO reports are written to:

```text
reports/seo-audit.txt
reports/seo-audit.json
```

Blocking post-build findings are also printed to the build log.

## Database

Generate and apply migrations explicitly:

```bash
pnpm db:generate
pnpm db:migrate
```

Production migrations require a reviewed release step.

## Product usage

Create a new product from this repository.
Replace the foundation homepage with the product-approved surface.
Keep authentication, workspace, billing, health, deployment, and SEO boundaries intact.

Update `src/config/seo.ts` when the product adds or removes public marketing, utility, private, dynamic, or article routes.
Do not copy fictional metrics into production.
Do not commit secrets or provider credentials.

## Ownership

Sage Prime owns the original code and product configuration in this repository.
See `LICENSE`, `OWNERSHIP.md`, and `THIRD_PARTY_NOTICES.md`.

Third-party dependencies retain their own licenses and notices.
