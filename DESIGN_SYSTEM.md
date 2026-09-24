# Sage Prime Design System

This repository uses one primary component foundation and one project-owned visual system.

## Component foundation

Primary:
- Tailwind CSS
- shadcn/ui
- Radix UI
- Lucide
- CVA

Do not mix in MUI, Chakra, Ant Design, Bootstrap, React Icons, Font Awesome, or another full UI kit.

Specialist libraries may be added only for a real missing capability such as charts, maps, motion or carousels.

## Reuse order

1. Reuse an existing StealthRDP product component.
2. Reuse a canonical src/components/ui primitive.
3. Add the correct shadcn/Radix primitive.
4. Create a reusable StealthRDP component.
5. Use bespoke route markup only when it is genuinely route-specific.

## Layout system

Page → Section → Container → Layout → Component → Element

- Section owns vertical spacing.
- Container owns max width and horizontal padding.
- Layout owns grid/flex columns and gap.
- Component owns internal padding.
- Elements do not add arbitrary page margins.

Canonical marketing geometry lives in src/styles/stealth-v3.css.
Do not invent a new container width, section rhythm or breakpoint inside individual pages.

## Tokens

All product colours use tokens from src/styles/global.css.
Brand colour is allowed.
Status colours remain semantic.

Use the shared type, radius and spacing scales.
Avoid arbitrary visual values inside JSX when an existing token or product class exists.

## Marketing components

The public site is not a dashboard.

Custom marketing components are expected for hero, pricing, infrastructure, regions, proof/reviews and final CTA.

A card must represent a real content object. Do not wrap every section in a card.

## Accessibility

Keep semantic landmarks, visible focus styles, keyboard-safe primitives, reduced-motion handling, non-colour status labels, responsive controls and tables.

## Visual QA

Material frontend changes require desktop and mobile review.
Storybook accessibility and screenshot regression remain blocking checks.
Intentional visual baseline changes must be reviewed before updating references.

## SEO

Protected SEO article styles remain in src/styles/global.css.
Visual work must not remove or bypass the SEO pipeline.


## shadcn registry usage

The official shadcn component library and the open-source shadcn Registry Directory may be used when they improve a real product surface.

Rules:
- review third-party registry code before adding it.
- adapt the component to StealthRDP tokens and layout ownership.
- do not import a second general-purpose UI kit.
- prefer components with no new runtime dependency when an equivalent exists.
- registry code is an implementation starting point, not a visual identity.
- paid or proprietary template code must not be copied into this repository.

Current shared patterns include Button, Badge, Card, Separator, Accordion, Tabs, Tooltip and ButtonGroup.
