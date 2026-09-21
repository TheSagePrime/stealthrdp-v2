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

## Self-hosted fonts

`public/fonts/` carries three typefaces, used by the home page through `@font-face`
declarations in `src/styles/stealth.css`. All three are licensed under the SIL Open Font
License 1.1 (OFL-1.1). The OFL permits bundling and self-hosting, including in commercial
products. Keep the licence notice with the files when redistributing.

| File | Family | Upstream | Licence |
|---|---|---|---|
| `space-grotesk-latin.woff2` | Space Grotesk | https://github.com/floriankarsten/space-grotesk | OFL-1.1 |
| `ibm-plex-sans-latin.woff2` | IBM Plex Sans | https://github.com/IBM/plex | OFL-1.1 |
| `jetbrains-mono-latin.woff2` | JetBrains Mono | https://github.com/JetBrains/JetBrainsMono | OFL-1.1 |

Files were retrieved from the Google Fonts CDN (latin subset) on 2026-09-21.
The full OFL text is available at https://openfontlicense.org/.

## Distribution rule

Keep this notice and all required upstream notices when distributing products.
Legal review is required before public distribution.
