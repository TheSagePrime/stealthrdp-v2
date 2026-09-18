## What changed?

Describe the product or infrastructure change and why it is needed.

## Architecture

- [ ] No canonical stack boundary changed.
- [ ] No architecture contract changed.
- [ ] If an architecture boundary changed, the migration is intentional and owner-approved.

Architecture-sensitive areas include `stack.contract.json`, `design.contract.json`,
`package.json`, `components.json`, database/auth/billing boundaries, global design
tokens, Next.js configuration, deployment configuration, and the SEO engine.

## Frontend

- [ ] Existing product/shadcn primitives were reused before creating new primitives.
- [ ] Theme tokens are used instead of arbitrary colors.
- [ ] Mobile/responsive behavior was considered.
- [ ] Loading/empty/error/disabled states were handled where relevant.
- [ ] Material UI changes were visually inspected.

## SEO

- [ ] The existing SEO pre-build -> Next build -> post-build pipeline is intact.
- [ ] Robots, sitemap, metadata, canonical, locale, and article infrastructure were not weakened.
- [ ] Any SEO-engine change is intentional and separately explained.

## Verification

- [ ] `pnpm check:architecture`
- [ ] `pnpm check:types`
- [ ] `pnpm check:oxlint`
- [ ] `pnpm check:format`
- [ ] `pnpm test`
- [ ] `pnpm build`
- [ ] Storybook / E2E / visual checks run when relevant

## Visual evidence

For meaningful UI changes, include before/after screenshots or equivalent visual evidence.
