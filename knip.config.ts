import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  // Files invoked by package scripts or intentionally exported for child projects
  entry: [
    'scripts/seo-post-build-v2.mjs',
    'scripts/seo-post-build.mjs',
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
  ],
  // Files to exclude from Knip analysis
  ignore: [
    'checkly.config.ts',
    'src/components/ui/*',
    'src/libs/I18n.ts',
  ],
  // Dependencies to ignore during analysis
  ignoreDependencies: [
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
