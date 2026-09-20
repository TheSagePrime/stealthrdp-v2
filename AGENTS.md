<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version may contain APIs, conventions, and file structure newer than model training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing code and heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Sage Prime contracts

Before changing application code, read:

- `stack.contract.json`
- `design.contract.json`
- `security.contract.json`
- `ARCHITECTURE.md`
- `DESIGN_SYSTEM.md`
- `SECURITY.md`
- `skills/web-builder/SKILL.md`

The repository contracts are authoritative. Do not weaken a checker just to make a change pass.

### Canonical architecture

Keep Next.js + React + strict TypeScript + Tailwind + shadcn/ui + Radix + Lucide + Neon PostgreSQL + Drizzle, with PGlite locally, pnpm packages, and Coolify-compatible deployment.

The default web starter must remain free of mandatory authentication, tenant/organization models, SaaS dashboards, and billing providers.

### Public-web purpose

Optimize for public discovery, useful content, free tools, crawlability, internal linking, speed, structured data, and safe promotion of separate commercial products.

Database capability is allowed and expected when useful; do not turn persistence into a SaaS identity model unless a child project explicitly requires that architecture.

### Security and privacy

Keep secrets server-only. Preserve privacy-safe observability defaults, CSP/security headers, DB TLS, bounded resource usage, dependency auditing, pinned GitHub Actions, and public-output privacy boundaries.

### Frontend

Reuse existing `src/components/ui` primitives. Use shared theme tokens, preserve responsive/accessibility behavior, and keep Storybook/visual regression coverage.

### SEO

SEO is protected. Preserve route classification, metadata/canonical helpers, robots/sitemap, article/RSS publishing helpers, project identity, research contracts, SEO styles, pre-build validation, and post-build audit.

### Verification

Before handoff run:

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
