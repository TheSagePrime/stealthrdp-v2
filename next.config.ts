import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import createNextIntlPlugin from 'next-intl/plugin';
import { v1LegacyRedirects } from './src/config/legacy-redirects';
import { whmcsLegacyRedirects } from './src/config/legacy-redirects-whmcs';
import { isProductionDeployEnv, resolveDeployEnv } from './src/libs/seo/env';
import './src/libs/Env';

const csp = [
  'default-src \'self\'',
  'base-uri \'self\'',
  'object-src \'none\'',
  'frame-ancestors \'none\'',
  'form-action \'self\'',
  'img-src \'self\' data: blob: https:',
  'font-src \'self\' data: https:',
  'style-src \'self\' \'unsafe-inline\'',
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? ' \'unsafe-eval\'' : ''}`,
  'connect-src \'self\' https://*.sentry.io',
  'frame-src \'self\' https://www.youtube.com https://www.youtube-nocookie.com',
  'worker-src \'self\' blob:',
  ...(process.env.NODE_ENV === 'production' ? ['upgrade-insecure-requests'] : []),
].join('; ');

const legacyRedirects = [
  ['/plans.html', '/plans'],
  ['/about.html', '/about'],
  ['/faq.html', '/faq'],
  ['/privacy.html', '/privacy'],
  ['/status.html', '/status'],
  ['/docs.html', '/docs'],
  ['/blog.html', '/blog'],
  ['/windows-vps/index.html', '/windows-vps'],
  ['/linux-vps/index.html', '/linux-vps'],
  ['/minecraft-vps', '/vps-hosting-minecraft'],
  ['/docs/frequently-asked-questions-fa-qs', '/faq'],
] as const;

const baseConfig: NextConfig = {
  devIndicators: {
    position: 'bottom-right',
  },
  poweredByHeader: false,
  reactStrictMode: true,
  reactCompiler: process.env.NODE_ENV === 'production',
  logging: {
    browserToTerminal: process.env.BROWSER_TO_TERMINAL_ENABLED === 'true',
  },
  async redirects() {
    return [
      ...[...legacyRedirects, ...v1LegacyRedirects].map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
      ...whmcsLegacyRedirects,
    ];
  },
  async headers() {
    const headers = [
      { key: 'Content-Security-Policy', value: csp },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
      { key: 'Permissions-Policy', value: 'camera=(), geolocation=(), microphone=()' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      ...(process.env.NODE_ENV === 'production'
        ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000' }]
        : []),
      /* Non-production deploys (preview, staging, dev) must never be indexed, even by
         crawlers that ignore robots.txt. This uses the shared deploy-env resolver, so
         the header can never contradict the SEO layer's environment classification. */
      ...(isProductionDeployEnv(resolveDeployEnv(process.env))
        ? []
        : [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]),
    ];

    return [{ source: '/:path*', headers }];
  },
  outputFileTracingIncludes: {
    '/': ['./migrations/**/*'],
  },
};

let configWithPlugins = createNextIntlPlugin('./src/libs/I18n.ts')(baseConfig);

if (process.env.ANALYZE === 'true') {
  configWithPlugins = withBundleAnalyzer()(configWithPlugins);
}

if (
  process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true'
  && process.env.SENTRY_SOURCE_MAP_UPLOAD_ENABLED === 'true'
) {
  configWithPlugins = withSentryConfig(configWithPlugins, {
    org: process.env.SENTRY_ORGANIZATION,
    project: process.env.SENTRY_PROJECT,
    silent: !process.env.CI,
    widenClientFileUpload: false,
    webpack: {
      reactComponentAnnotation: {
        enabled: false,
      },
      treeshake: {
        removeDebugLogging: true,
      },
    },
    telemetry: false,
  });
}

const nextConfig = configWithPlugins;
export default nextConfig;
