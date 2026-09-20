# Sage Prime Web Architecture

This repository is the canonical foundation for Sage Prime public web properties.

## Purpose

The default project is a public, crawlable website designed to accumulate useful content, free tools, links, brand demand, and organic traffic. Monetization is optional and may happen directly or by promoting separate SaaS products.

## Canonical stack

- Next.js App Router
- React
- strict TypeScript
- Tailwind CSS
- shadcn/ui + Radix
- Lucide
- Neon PostgreSQL
- Drizzle ORM
- pg runtime driver
- PGlite local development
- Coolify
- pnpm

## Deliberately absent SaaS assumptions

The default web foundation does not include:

- authentication providers
- sign-in/sign-up flows
- organizations or tenants
- SaaS dashboards
- subscription billing
- checkout/customer portals
- billing webhooks

Those capabilities require a deliberate architecture change if a specific child site truly needs them.

## Database boundary

Neon/Drizzle/PGlite are retained as generic infrastructure. Persistence can support content, free tools, forms, attribution, redirects, or other site-specific data. The base database model does not encode user or tenant ownership.

Direct database access remains behind server-owned boundaries so public pages and SEO code do not accidentally serialize private backend records.

## SEO is a protected subsystem

The SEO engine, route classification, metadata helpers, robots, sitemap, article/RSS infrastructure, canonical handling, research contracts, pre-build validation, and post-build audit are protected.

The production build order remains:

```text
SEO pre-build validation
→ Next.js application build
→ SEO post-build audit
```

## Enforcement

Run:

```bash
pnpm check:architecture
pnpm check
pnpm build
```

Architecture changes are explicit migrations, not incidental implementation details.
