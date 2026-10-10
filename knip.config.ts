import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  // Files invoked by package scripts or intentionally exported for child projects
  entry: [
    'scripts/seo-post-build-v2.mjs',
    'scripts/seo-post-build.mjs',
    // Run by hand and by writers: .sageprime/seo/briefs/i18n/WRITER-GUIDE.md
    'scripts/check-translation.mjs',
    // Run by hand (daily) to publish translations by date: CONTRIBUTING.md, recipe 13
    'scripts/i18n-publish.mjs',
    'src/components/ActiveLink.tsx',
    'src/components/LocaleSwitcher.tsx',
    'src/components/seo/Article.tsx',
    'src/libs/I18nNavigation.ts',
    'src/libs/seo/articles.ts',
    'src/libs/seo/locale.ts',
    'src/libs/seo/project.ts',
    'src/libs/seo/research-artifacts.ts',
    'src/templates/Logo.tsx',
    'src/utils/Helpers.ts',
    // Used by src/components/ui/orbiting-circle.tsx, which knip ignores.
    'src/lib/utils.ts',
  ],
  // Files to exclude from Knip analysis
  ignore: [
    'checkly.config.ts',
    'public/vendor/lottie/lottie_light.min.js',
    'src/components/ui/*',
    'src/libs/I18n.ts',
  ],
  // Dependencies to ignore during analysis
  ignoreDependencies: [
    '@hugeicons/core-free-icons', // Required by stack.contract.json (marketing accent icons).
    '@hugeicons/react', // Required by stack.contract.json.
    '@swc/helpers', // Keep the existing Next.js runtime helper explicit.
  ],
  // Include custom Playwright test file suffixes
  playwright: {
    entry: ['tests/**/*.@(integ|e2e).ts'],
  },
  // Binaries to ignore during analysis
  ignoreBinaries: [],
  compilers: {
    css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/g)].join('\n'),
  },
  treatConfigHintsAsErrors: true,
};

export default config;
