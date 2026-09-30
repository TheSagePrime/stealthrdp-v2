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
    // Homepage and motion components kept from earlier redesigns. Not routed now.
    'src/components/launchui/*.tsx',
    'src/components/site/CitadelMotionScene.tsx',
    'src/components/site/HelpSidebar.tsx',
    'src/components/site/ResourceNav.tsx',
    'src/components/site/VpsMotionShowcase.tsx',
    'src/components/site/home/*.tsx',
    'src/lib/ease.ts',
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
