## Summary

Describe what changed and why.

## Architecture

- [ ] No canonical stack changes
- [ ] No protected architecture files changed
- [ ] If protected architecture files changed, owner review is complete and the `architecture-approved` label may be applied
- [ ] No mandatory auth, tenant, dashboard, or billing subsystem was introduced
- [ ] Neon/Drizzle/PGlite remain generic data capabilities rather than identity/tenant assumptions

## Frontend

- [ ] Existing shadcn/Radix primitives were reused before creating new primitives
- [ ] Theme tokens are used instead of arbitrary component colors
- [ ] Mobile and desktop behavior were reviewed where relevant
- [ ] Accessibility/keyboard/focus behavior was preserved
- [ ] Storybook accessibility/component tests pass
- [ ] Visual baseline changes were reviewed and intentional

## Security / Privacy

- [ ] Public APIs/tools have deliberate validation and abuse controls where needed
- [ ] No secrets or private records were exposed to public surfaces
- [ ] Security headers/CSP were preserved
- [ ] No obsolete SaaS provider origins were added to CSP
- [ ] No GitHub Action was changed back to a mutable tag
- [ ] `pnpm check:security` and `pnpm test:security` pass

## SEO

- [ ] SEO infrastructure was not changed as collateral work
- [ ] The pre-build -> Next build -> post-build audit sequence remains intact
- [ ] Robots, sitemap, canonical/metadata, article/RSS, research contracts, and protected SEO styles remain intact

## Data / Platform

- [ ] Neon remains the production PostgreSQL provider
- [ ] Drizzle remains the ORM
- [ ] PGlite remains local-only
- [ ] No tenant/user ownership model was added by default
- [ ] No secret was added to source control

## Verification

- [ ] `pnpm check:architecture`
- [ ] `pnpm test:contracts`
- [ ] `pnpm test:security`
- [ ] `pnpm typegen`
- [ ] `pnpm check:types`
- [ ] `pnpm check:oxlint`
- [ ] `pnpm check:format`
- [ ] `pnpm test`
- [ ] `pnpm storybook:test`
- [ ] `pnpm test:visual`
- [ ] `pnpm build`
