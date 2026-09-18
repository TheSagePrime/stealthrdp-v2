# Sage Prime Starter

The canonical Sage Prime foundation for new product repositories.

This repository provides reusable application infrastructure without imposing
product-specific copy, pricing, data, or visual direction.

## Canonical stack

The machine-readable source of truth is `stack.contract.json`.

- Next.js App Router, React, and strict TypeScript
- Tailwind CSS 4 with shadcn/ui and Radix primitives
- Lucide icons
- Clerk authentication and localized sign-in flows
- Neon PostgreSQL for production
- Drizzle ORM through the locked `pg` runtime boundary
- PGlite for local development and deterministic local checks
- Polar billing boundaries
- pnpm
- Coolify-compatible deployment
- Internationalization with English and French locales
- Protected dashboard routes
- Health and readiness routes
- Vitest, Playwright, and Storybook
- Docker/Coolify deployment boundaries and GitHub Actions checks

Do not substitute canonical providers or frameworks without an explicit architecture change.
The repository enforces this with `pnpm check:architecture`.

## Frontend contract

The canonical frontend is Next.js + TypeScript + Tailwind + shadcn/ui + Radix + Lucide.
Design tokens live in `src/styles/global.css`; shadcn configuration lives in
`components.json`; machine-readable design constraints live in
`design.contract.json`.

Read `DESIGN_SYSTEM.md` before making material UI changes.

## SEO contract

The technical SEO engine is a protected subsystem. Product work must preserve the
existing build order:

```text
SEO pre-build validation
→ Next.js production build
→ SEO post-build audit
```

The contract checker verifies the SEO scripts and required engine files. Do not
remove, bypass, or reorder those gates as part of unrelated product work.

## Canonical stack

The enforced foundation is Next.js + React + strict TypeScript + Tailwind CSS + shadcn/ui + Radix UI + Lucide, Clerk authentication, Neon PostgreSQL + Drizzle ORM, Polar billing, PGlite for local development, pnpm, and Coolify deployment.

The machine-readable sources of truth are `stack.contract.json` and `design.contract.json`. See `ARCHITECTURE.md` and `DESIGN_SYSTEM.md` for the human-readable rules.

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

```text
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
DATABASE_URL
```

For production, `DATABASE_URL` must be the Neon PostgreSQL connection string.
The local development scripts start PGlite and provide a local PostgreSQL-compatible
endpoint automatically.

Keep `.env` and `.env.production` outside Git.
Use Coolify environment variables for deployed applications.

## Checks

```bash
pnpm check:architecture
pnpm typegen
pnpm check:types
pnpm check:oxlint
pnpm check:format
pnpm test
pnpm build
```

`pnpm build` includes both SEO gates and must remain the production build command.

## Database

Production database provider: **Neon PostgreSQL**.
ORM: **Drizzle**.
Runtime connection boundary: **node-postgres (`pg`)**.
Local development database: **PGlite**.

Generate and apply migrations explicitly:

```bash
pnpm db:generate
pnpm db:migrate
```

Production migrations require a reviewed release step.

## Product usage

Create a new product from this repository.
Replace the foundation homepage with the product-approved surface.
Keep authentication, workspace, billing, data, SEO, health, design-system, and
deployment boundaries intact.

Read `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `AGENTS.md`, and
`skills/saas-builder/SKILL.md` before autonomous implementation.

Do not copy fictional metrics into production.
Do not commit secrets or provider credentials.

## Ownership

Sage Prime owns the original code and product configuration in this repository.
See `LICENSE`, `OWNERSHIP.md`, and `THIRD_PARTY_NOTICES.md`.

Third-party dependencies retain their own licenses and notices.
