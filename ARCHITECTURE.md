# Sage Prime Architecture

This repository is the canonical foundation for Sage Prime products. The architecture is enforced by `stack.contract.json`, `design.contract.json`, local hooks, and CI.

## Canonical stack

- Framework: Next.js App Router
- UI runtime: React
- Language: strict TypeScript
- Styling: Tailwind CSS
- Component system: shadcn/ui
- Behavior primitives: Radix UI
- Icons: Lucide
- Authentication: Clerk
- Production database: Neon PostgreSQL
- ORM: Drizzle ORM
- Runtime PostgreSQL driver: pg
- Local database: PGlite
- Billing: Polar
- Deployment: Coolify
- Package manager: pnpm

Neon is the production PostgreSQL provider. The runtime uses the standard `pg` driver through Drizzle so the application remains compatible with Coolify and standard Node.js execution. PGlite is local-only.

## Architectural boundaries

Application code must use the existing database, authentication, billing, UI, and runtime boundaries before introducing alternatives. Provider SDK calls must remain behind the existing product-owned integration layers. Client components must not access secrets.

Architecture changes are explicit migrations, not incidental implementation details. A change to an ORM, auth provider, database provider, UI system, icon library, billing provider, package manager, or deployment model requires updating the contract deliberately and reviewing the migration impact.

## SEO is a protected subsystem

The SEO engine, route classification, metadata helpers, robots, sitemap, article registry, canonical handling, pre-build validation, and post-build audit are part of the starter architecture.

The production build order must remain:

```text
SEO pre-build validation
→ Next.js application build
→ SEO post-build audit
```

Frontend or architecture cleanup must not remove or normalize away SEO-specific styles, routes, metadata behavior, or audit scripts.

## Enforcement

Run:

```bash
pnpm check:architecture
pnpm check
pnpm build
```

`check:architecture` rejects known stack drift, design-system drift, and protected SEO changes. CI repeats these checks for pull requests.
