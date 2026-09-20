# Sage Prime Web Starter

The canonical Sage Prime foundation for **public traffic websites**.

Use this repository for content-heavy sites, free tools, calculators, generators, checkers, guides, and other public properties whose primary job is to earn attention and organic traffic. A site may monetize later, promote Sage Prime SaaS products, use affiliates/ads/leads, or remain non-commercial.

## What this starter is

- Public-facing by default
- SEO and content infrastructure first
- Built to host useful free tools
- Database-capable without requiring accounts
- Strongly tested and deployable on Coolify
- Neutral about monetization

## What this starter is not

The default foundation intentionally has **no authentication provider, no organizations/tenants, no SaaS dashboard, and no billing provider**. Those are product assumptions, not requirements for a traffic website.

If a child site genuinely needs a protected subsystem later, add it as an explicit architecture change rather than carrying SaaS baggage into every project.

## Canonical stack

The machine-readable source of truth is `stack.contract.json`.

- Next.js App Router, React, strict TypeScript
- Tailwind CSS 4, shadcn/ui, Radix, Lucide
- Neon PostgreSQL + Drizzle ORM
- PGlite for local development
- pnpm
- Coolify-compatible deployment
- next-intl
- Vitest, Playwright, Storybook
- Optional Sentry and Better Stack observability

## SEO

SEO is a protected subsystem:

```text
SEO pre-build validation
→ Next.js production build
→ SEO post-build audit
```

The starter includes metadata/canonical helpers, robots, sitemap, RSS/article infrastructure, internal-link validation, structured-data helpers, project identity, research-artifact contracts, and deterministic SEO checks.

## Database

Neon/Drizzle/PGlite stay in the web starter because public sites and free tools may need persistence for content metadata, tool data, forms, leads, attribution, redirects, or other project-specific uses.

The database is a **capability**, not a tenant/user model. The default schema contains no owner/tenant identity.

## Security and privacy

Public does not mean unprotected. The starter preserves CSP and security headers, server-only boundaries, safe logging defaults, production DB TLS requirements, bounded DB pools, dependency auditing, immutable GitHub Actions, secret scanning checks, health/readiness endpoints, and public-output privacy boundaries.

## Local setup

Requirements:

- Node.js `>=22`
- pnpm `10.34.5`

```bash
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

Production `DATABASE_URL` should use Neon PostgreSQL with TLS. Local development uses PGlite.

## Verification

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

Read `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `SECURITY.md`, `AGENTS.md`, and `skills/web-builder/SKILL.md` before autonomous implementation.
