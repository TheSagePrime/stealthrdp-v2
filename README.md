# Sage Prime Starter

The canonical Sage Prime foundation for new product repositories.

This repository provides reusable application infrastructure without imposing product-specific copy, pricing, data, or visual direction.

## Canonical stack

The machine-readable architecture source of truth is `stack.contract.json`.

- Next.js App Router, React, and strict TypeScript
- Tailwind CSS 4 with shadcn/ui and Radix primitives
- Lucide icons
- Clerk authentication
- Neon PostgreSQL + Drizzle ORM through the locked `pg` runtime boundary
- PGlite for local development
- Polar billing
- pnpm
- Coolify-compatible deployment
- next-intl
- Vitest, Playwright, and Storybook

Do not substitute canonical providers or frameworks without an explicit architecture change.

## Contracts

The starter is self-enforcing:

- `stack.contract.json` — architecture and provider choices
- `design.contract.json` — frontend/design-system rules
- `security.contract.json` — authentication, privacy, CI, billing, DB, telemetry, and supply-chain rules
- `ARCHITECTURE.md` — architecture boundaries
- `DESIGN_SYSTEM.md` — frontend behavior and visual rules
- `SECURITY.md` — security/privacy operating model

Run `pnpm check:architecture` to validate all machine-readable contracts.

## Security and privacy

Security is enforced at application resources, not by SEO route classification.

- API Route Handlers are private by default unless explicitly allowlisted.
- Sensitive routes authenticate with Clerk inside the resource.
- Billing identity is derived server-side from the active Clerk user/organization.
- Polar products come from a server-side allowlist.
- Sentry PII/log forwarding and Session Replay default off.
- Better Stack credentials are server-only.
- CSP, HSTS, frame denial, referrer policy, permissions policy, and nosniff headers are configured.
- Production DB connections require TLS and use bounded pool/query timeouts.
- GitHub Actions use read-only CI permissions and immutable action SHAs.
- Releases run only from a successful CI run at the exact tested SHA.
- Production dependencies are audited in PR CI.

Read `SECURITY.md` before adding APIs, persisted tenant data, telemetry, billing, or third-party integrations.

## Frontend contract

The canonical frontend is Next.js + TypeScript + Tailwind + shadcn/ui + Radix + Lucide.

Design tokens live in `src/styles/global.css`; shadcn configuration lives in `components.json`. Material UI work must pass Storybook accessibility/component tests and browser screenshot regression.

Read `DESIGN_SYSTEM.md` before material UI changes.

## SEO contract

The technical SEO engine is a protected subsystem. Product work must preserve:

```text
SEO pre-build validation
→ Next.js production build
→ SEO post-build audit
```

Do not remove, bypass, or reorder those gates as collateral work.

## Local setup

Requirements:

- Node.js `>=22`
- pnpm `10.34.5`

```bash
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

## Required environment

```text
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
DATABASE_URL
```

Production `DATABASE_URL` must use Neon PostgreSQL and enforce TLS. Local development uses PGlite.

Keep runtime secrets outside Git and configure them through Coolify/runtime secret storage.

## Checks

```bash
pnpm check:architecture
pnpm test:contracts
pnpm test:security
pnpm typegen
pnpm check:types
pnpm check:oxlint
pnpm check:format
pnpm test
pnpm storybook:test
pnpm test:visual
pnpm build
```

`pnpm build` includes both SEO gates and remains the production build command.

## Database

Production: **Neon PostgreSQL**  
ORM: **Drizzle**  
Runtime driver: **node-postgres (`pg`)**  
Local: **PGlite**

```bash
pnpm db:generate
pnpm db:migrate
```

Production migrations require a reviewed release/deployment step. Tenant-owned child-product data must use the canonical tenant/data boundary and include cross-tenant isolation tests.

## Product usage

Create a new product from this repository, replace the foundation homepage with the product-approved surface, and keep authentication, data, billing, security, SEO, frontend, health, and deployment boundaries intact.

Read `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `SECURITY.md`, `AGENTS.md`, and `skills/saas-builder/SKILL.md` before autonomous implementation.

Do not add fictional metrics, product claims, or live credentials.

## Ownership

Sage Prime owns the original code and product configuration in this repository. See `LICENSE`, `OWNERSHIP.md`, and `THIRD_PARTY_NOTICES.md`.

Third-party dependencies retain their own licenses and notices.
