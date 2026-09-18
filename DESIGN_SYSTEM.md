# Sage Prime Design System

The frontend foundation is intentionally constrained so AI-generated code stays consistent instead of inventing a new visual language per task.

## Foundation

Use Tailwind CSS, shadcn/ui, Radix UI primitives, Lucide icons, CVA, and the tokens in `src/styles/global.css`.

The hierarchy is:

1. Reuse an existing product component.
2. Reuse an existing `src/components/ui` primitive.
3. Add the appropriate shadcn/Radix primitive.
4. Create a reusable product component.
5. Use bespoke one-off markup only when the earlier options do not fit.

## Tokens

Colors, borders, backgrounds, foregrounds, rings, radii, and state styling should come from the existing theme tokens. Do not introduce arbitrary brand colors inside components.

Avoid:
- hardcoded hex/RGB/HSL colors in product components
- arbitrary Tailwind hex colors
- alternate icon libraries
- parallel button/input/dialog/card systems
- random gradients, glass effects, oversized radii, or decorative cards without product purpose
- inline style objects for visual design when Tailwind/tokens cover the need

## Product UI requirements

Material UI work should account for desktop and mobile states. Interactive controls must preserve keyboard behavior, focus treatment, disabled/loading behavior, and accessible semantics. Prefer Radix-backed primitives for behavior that is easy to get wrong.

A page should communicate hierarchy through typography, spacing, grouping, and content structure before decoration.

## Visual QA

Meaningful UI changes must be rendered and reviewed, not accepted from source code alone.

The starter enforces three frontend QA layers:
- Storybook component tests for canonical states
- Storybook axe accessibility checks with violations treated as errors
- Vitest browser screenshot regression at desktop/mobile and light/dark reference states

Run `pnpm storybook:test` and `pnpm test:visual` before handing off frontend changes. The visual test renders real Chromium screenshots and compares their SHA-256 fingerprints with the reviewed references in `design.contract.json`. CI stores the rendered screenshots as artifacts when a fingerprint changes. Intentional visual changes require reviewing those rendered screenshots first, then updating only the corresponding protected fingerprint in `design.contract.json` with architecture approval. Chromatic remains an optional additional cross-browser cloud layer.

## SEO compatibility

The SEO article styles in `src/styles/global.css` are protected. Design cleanup must not remove the article publication metadata, citation, sources, table, or index styles merely because they are custom CSS.
