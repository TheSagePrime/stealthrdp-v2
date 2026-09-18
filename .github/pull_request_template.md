## Summary

Describe what changed and why.

## Architecture

- [ ] No canonical stack changes
- [ ] No protected architecture files changed
- [ ] If protected architecture files changed, owner review is complete and the `architecture-approved` label may be applied
- [ ] No new framework, ORM, auth, database, UI, icon, billing, or deployment substitute was introduced

## Frontend

- [ ] Existing product/shadcn/Radix primitives were reused before creating new UI primitives
- [ ] Theme tokens are used instead of arbitrary component colors
- [ ] Mobile and desktop behavior were reviewed where relevant
- [ ] Accessibility/keyboard/focus behavior was preserved
- [ ] Material UI changes include visual evidence where relevant
- [ ] Storybook accessibility/component tests pass
- [ ] Visual fingerprints were not changed unless rendered screenshots were reviewed and the visual change was intentional

## SEO

- [ ] SEO infrastructure was not changed as collateral work
- [ ] The pre-build -> Next build -> post-build audit sequence remains intact
- [ ] Robots, sitemap, canonical/metadata, article registry, and protected SEO styles remain intact
- [ ] Any intentional SEO architecture change is explicitly described below

## Data / Platform

- [ ] Neon remains the production PostgreSQL provider
- [ ] Drizzle remains the ORM
- [ ] PGlite remains local-only
- [ ] Clerk/Polar boundaries are preserved
- [ ] No secret was added to source control

## Verification

- [ ] `pnpm check:architecture`
- [ ] `pnpm test:contracts`
- [ ] `pnpm typegen`
- [ ] `pnpm check:types`
- [ ] `pnpm check:oxlint`
- [ ] `pnpm check:format`
- [ ] `pnpm test`
- [ ] `pnpm storybook:test`
- [ ] `pnpm test:visual`
- [ ] `pnpm build`

## Architecture / SEO changes requiring owner approval

None.
