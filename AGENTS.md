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
6. Define the child project configuration and verify its Project Truth Profile.
7. Choose explicit country + locale markets and resolve matching OpenSEO project data.
8. Set production `SITE_URL`.
9. Add real brand information only when it exists.
10. Register only real article routes and publications.
11. Run `pnpm seo:pre-build`.
12. Run `pnpm build`.
13. Pass the post-build audit, including article checks when configured.
14. Then begin project-specific SEO research and writing.

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

## Article publishing

A child project must complete these steps when it enables articles:

1. Add the child-owned `.sageprime/project-truth-profile.json` and validate it before research.
2. Add the child-owned `articles` registry in `src/config/seo.ts`.
3. Add a real article index route for the configured `articles.basePath`.
4. Add a real dynamic article route for each registered publication path.
5. Call `createArticleMetadata` from the article route's `generateMetadata`.
6. Use `ArticlePublicationMeta`, `ArticleJsonLd`, `ArticleSources`, and `ArticleCitation` where the approved page needs them.
7. Keep source selection, citation meaning, internal-link selection, and CTA judgment in the Senku handoff.
8. Run `pnpm seo:pre-build` and `pnpm build`.

The registry drives sitemap and `/rss.xml` inclusion through the existing routes.
The starter does not add a forced `/blog` route or fake article content.
Use one `datePublished` value per article.
Do not duplicate dates across unrelated configuration files.

Use `ProjectTruthProfile` from `src/libs/seo/project.ts` to validate the child-owned truth artifact.
Do not add product facts to the starter.

Authentication is the security boundary. `robots.txt` is crawler guidance only.

