# Third-party notices

This repository contains Sage Prime code and adapted open-source foundation
code. First-party ownership does not remove upstream license obligations.

## Adapted source

The original foundation was adapted from the MIT-licensed
`ixartz/SaaS-Boilerplate` project.

The applicable notice is retained here:

```text
MIT License

Copyright (c) 2026 Remi W.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Direct dependencies

Direct runtime dependencies include Next.js, React, Drizzle ORM,
PostgreSQL client packages, Zod, next-intl, LogTape, Radix primitives, Lucide,
and optional Sentry integration.

Authentication and subscription-billing providers are not part of the default web starter.

Their license texts remain in installed package metadata.
Regenerate this notice after dependency changes.

## Distribution rule

Keep this notice and all required upstream notices when distributing products.
Legal review is required before public distribution.
## DashboardBlocks

The status primitives and Service List, Uptime Bars, and Incident blocks in
`src/components/dashboardblocks/` are copied from DashboardBlocks' official registry
and adapted for StealthRDP data, localization, theme tokens, and existing icons:
https://www.dashboardblocks.com/docs/components/status

MIT License

Copyright (c) 2025 dashboardblocks

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Shadcnblocks Navbar 1 (free block)

`src/components/shadcnblocks/navbar1.tsx` adapts Navbar 1's desktop navigation,
action grouping and mobile sheet layout for StealthRDP. Copyright Shadcnblocks.com.
Source: https://www.shadcnblocks.com/r/navbar1.json
Component: https://www.shadcnblocks.com/block/navbar1

Used under the Free Blocks / End products permission in
https://www.shadcnblocks.com/terms (accessed 8 October 2026), which permits
installation, modification and retention in this end product's public repository.
This block is not represented as MIT-licensed or redistributed as a component library.
The adaptation uses existing project primitives and native modal behavior, removes
demo content and unused nested menus, and uses project icons, tokens and translations.

## Shadcnblocks Contact 7 (free block)

`src/components/shadcnblocks/contact7.tsx` adapts Contact 7's information-only
contact grid. Copyright Shadcnblocks.com.
Source: https://www.shadcnblocks.com/r/contact7.json
Component: https://www.shadcnblocks.com/block/contact7

Used under the Free Blocks / End products permission in
https://www.shadcnblocks.com/terms (accessed 8 October 2026), permitting installation,
modification and retention in this end product's public repository. This is not
represented as MIT-licensed or redistributed as a component library. The adaptation
uses existing shadcn Card and Button primitives, project icons, tokens, translations
and real support channels instead of demo office and phone details.

## Dashboardblocks footer adaptations

The footer composes adapted Page Header and ChoiceCards primitives from:
https://www.dashboardblocks.com/r/page-header.json
https://www.dashboardblocks.com/r/onboarding.json

`footer-header.tsx` keeps the heading/actions layout, uses a brand element instead
of a page h1, and removes unused primitives. `footer-navigation.tsx` adapts the
choice-card icon/content hierarchy into navigation groups, replacing form choices
with links and unboxed semantic navigation groups. Both are covered by the
Dashboardblocks MIT notice above. No Flowbite runtime or components remain.


## flag-icons — language flags

Source: https://github.com/lipis/flag-icons (GB, DE and ES SVGs).

```text
The MIT License (MIT)

Copyright (c) 2013 Panayiotis Lipiridis

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```


## Microsoft Fluent UI System Color Icons

Source: https://github.com/microsoft/fluentui-system-icons . Selected unmodified color SVG artwork, distributed via Iconify fluent-color data, hosted locally.

```text
MIT License

Copyright (c) 2020 Microsoft Corporation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```
