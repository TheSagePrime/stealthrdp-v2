<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Sage Prime technical SEO

This starter ships reusable technical SEO infrastructure. It does not ship
keywords, landing-page copy, or brand claims for a child product.

## New project initialization

1. Clone this starter into a new product repository.
2. Inspect the real framework routes.
3. Classify public marketing routes in `src/config/seo.ts`.
4. Classify public utility routes.
5. Configure private pages and private APIs that actually exist.
6. Set production `SITE_URL`.
7. Add real brand information only when it exists.
8. Run `pnpm seo:pre-build`.
9. Run `pnpm build`.
10. Pass the post-build audit.
11. Then begin project-specific SEO research and writing.

Do not start keyword or content work before the technical configuration passes.

## Continuous SEO loop

```text
OpenSEO Research
→ Implement
→ Pre-Build Validation
→ Build
→ Static/SSR Crawl
→ SEO Audit
→ Fix
→ Repeat
```

## Roles

- Senku / #Business owns project-specific research after initialization.
- Suho / #Builder owns implementation: routes, metadata, schema, internal links.
- Hermes / CI owns enforcement: pre-build, build, post-build crawl, reports.

## Ownership

Starter kit owns the SEO engine, route classes, robots/sitemap generators,
canonical helpers, schema helpers, URL normalization, and CI gates.

Child projects own `SITE_URL`, brand identity, real routes, keywords, content,
and research.

Authentication is the security boundary. `robots.txt` is crawler guidance only.

