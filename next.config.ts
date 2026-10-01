import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import createNextIntlPlugin from 'next-intl/plugin';
import { whmcsLegacyRedirects } from './src/config/legacy-redirects-whmcs';
import { isProductionDeployEnv, resolveDeployEnv } from './src/libs/seo/env';
import './src/libs/Env';

/* Hosts that the tags in the server-side GTM container (sgtm.stealthrdp.com) load:
   Google Ads conversion and remarketing, the Meta pixel (with its Conversions API parameter
   builder) and the Yandex verification template.
   The Google list follows developers.google.com/tag-platform/security/guides/csp. */
const tagHosts = {
  script: 'https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com https://connect.facebook.net https://capi-automation.s3.us-east-2.amazonaws.com/public/client_js/ https://cdn.jsdelivr.net/gh/yandex/',
  connect: 'https://analytics.google.com https://*.g.doubleclick.net https://ad.doubleclick.net https://www.google.com https://www.googleadservices.com https://*.googletagmanager.com https://www.facebook.com https://connect.facebook.net',
  frame: 'https://sgtm.stealthrdp.com https://td.doubleclick.net https://www.googletagmanager.com',
};

const csp = [
  'default-src \'self\'',
  'base-uri \'self\'',
  'object-src \'none\'',
  'frame-ancestors \'none\'',
  'form-action \'self\'',
  'img-src \'self\' data: blob: https:',
  'font-src \'self\' data: https:',
  'style-src \'self\' \'unsafe-inline\'',
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? ' \'unsafe-eval\'' : ''} https://sgtm.stealthrdp.com https://datafa.st https://www.googletagmanager.com https://*.googletagmanager.com ${tagHosts.script}`,
  `connect-src 'self' https://*.sentry.io https://sgtm.stealthrdp.com https://datafa.st https://*.google-analytics.com https://*.analytics.google.com ${tagHosts.connect}`,
  `frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com ${tagHosts.frame}`,
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

// Preserve every meaningful legacy production URL during the V2 cutover.
// Keep these separate from the small canonical route list so they can be retired only
// after search engines and external links have fully converged on the new URLs.
const productionSeoRedirects = [
  ['/vps-hosting-minecraft/index.html', '/vps-hosting-minecraft'],
  ['/blog/5-ways-to-optimize-your-rdp-performance-for-remote-work', '/blog/5-ways-to-optimize-your-rdp-performance-for-remote-work.html'],
  ['/blog/7-best-tools-for-server-uptime-monitoring-2025', '/blog/7-best-tools-for-server-uptime-monitoring-2025.html'],
  ['/blog/common-vps-hosting-issues-and-their-solutions', '/blog/common-vps-hosting-issues-and-their-solutions.html'],
  ['/blog/top-6-vps-management-tools-for-small-businesses', '/blog/top-6-vps-management-tools-for-small-businesses.html'],
  ['/blog/windows-vs-linux-vps-which-os-best-fits-your-business', '/blog/windows-vs-linux-vps-which-os-best-fits-your-business.html'],
  ['/docs/1737944563-how-to-re_activate-and-extend-your-180_day-windows-trial.html', '/docs/how-to-re-activate-and-extend-your-180-day-windows-trial'],
  ['/docs/1737944563-how-to_re_activate-and-extend-your-180_day-windows-trial.html', '/docs/how-to-re-activate-and-extend-your-180-day-windows-trial'],
  ['/docs/1737946054-how-to-setup-your-vpn-on-linux-server-using-outline.html', '/docs/how-to-setup-your-vpn-on-linux-server-using-outline'],
  ['/docs/1737946569-install-fast-panel-in-linux-good-web-hosting-free-panel.html', '/docs/install-fast-panel-in-linux-good-web-hosting-free-panel'],
  ['/docs/1737944013-use-of-service.html', '/docs/use-of-service'],
  ['/docs/1737946470-how-to-install-centos-web-panel-cwp-free-web-panel.html', '/docs/how-to-install-centos-web-panel-cwp-free-web-panel'],
  ['/docs/1737946390-setup-tun-tap-for-open_vpn.html', '/docs/setup-tun-tap-for-open-vpn'],
  ['/docs/1737943955-introduction.html', '/docs/introduction'],
  ['/docs/1737944110-termination-of-service.html', '/docs/termination-of-service'],
  ['/docs/1737944184-payment-terms.html', '/docs/payment-terms'],
  ['/docs/1737944204-user-responsibilities.html', '/docs/user-responsibilities'],
  ['/docs/1737944952-server-stops-randomly.html', '/docs/server-stops-randomly'],
  ['/docs/1737945157-how-do-i-log-into-windows.html', '/docs/how-do-i-log-into-windows'],
  ['/docs/1737945947-how-to-force-https-using-htaccess.html', '/docs/how-to-force-https-using-htaccess'],
  ['/docs/1737945988-why-you-should-redirect-all-http-traffic-to-https.html', '/docs/why-you-should-redirect-all-http-traffic-to-https'],
  ['/docs/1737946010-10-ways-to-optimize-your-word_press-website-for-speed.html', '/docs/10-ways-to-optimize-your-word-press-website-for-speed'],
  ['/docs/1737946490-how-to-install-direct-admin-in-a-linux-server.html', '/docs/how-to-install-direct-admin-in-a-linux-server'],
  ['/docs/1737946509-install-cpanel-and-whm-in-linux-you-need-a-license.html', '/docs/install-cpanel-and-whm-in-linux-you-need-a-license'],
  ['/docs/1737946534-install-cyber-panel-with-open_lite_speed-in-linux.html', '/docs/install-cyber-panel-with-open-lite-speed-in-linux'],
  ['/docs/1737948398-frequently-asked-questions-fa_qs.html', '/faq'],
  ['/docs/1740916941-how-to-rebuild-a-server.html', '/docs/how-to-rebuild-a-server'],
  ['/docs/1740917234-how-to-reset-server-change-or-reset-client-area-password.html', '/docs/how-to-reset-server-change-or-reset-client-area-password'],
  ['/docs/1742181117-step_by_step-guide-to-fix-win_rm-and-install-net-framework.html', '/docs/step-by-step-guide-to-fix-win-rm-and-install-net-framework'],
  ['/docs/10-ways-to-optimize-your-word-press-website-for-speed.html', '/docs/10-ways-to-optimize-your-word-press-website-for-speed'],
  ['/docs/how-to-re-activate-and-extend-your-180-day-windows-trial.html', '/docs/how-to-re-activate-and-extend-your-180-day-windows-trial'],
  ['/docs/how-to-setup-your-vpn-on-linux-server-using-outline.html', '/docs/how-to-setup-your-vpn-on-linux-server-using-outline'],
  ['/docs/install-fast-panel-in-linux-good-web-hosting-free-panel.html', '/docs/install-fast-panel-in-linux-good-web-hosting-free-panel'],
  ['/docs/use-of-service.html', '/docs/use-of-service'],
  ['/docs/how-to-install-centos-web-panel-cwp-free-web-panel.html', '/docs/how-to-install-centos-web-panel-cwp-free-web-panel'],
  ['/docs/setup-tun-tap-for-open-vpn.html', '/docs/setup-tun-tap-for-open-vpn'],
  ['/docs/introduction.html', '/docs/introduction'],
  ['/docs/termination-of-service.html', '/docs/termination-of-service'],
  ['/docs/payment-terms.html', '/docs/payment-terms'],
  ['/docs/user-responsibilities.html', '/docs/user-responsibilities'],
  ['/docs/server-stops-randomly.html', '/docs/server-stops-randomly'],
  ['/docs/how-do-i-log-into-windows.html', '/docs/how-do-i-log-into-windows'],
  ['/docs/how-to-force-https-using-htaccess.html', '/docs/how-to-force-https-using-htaccess'],
  ['/docs/why-you-should-redirect-all-http-traffic-to-https.html', '/docs/why-you-should-redirect-all-http-traffic-to-https'],
  ['/docs/how-to-install-direct-admin-in-a-linux-server.html', '/docs/how-to-install-direct-admin-in-a-linux-server'],
  ['/docs/install-cpanel-and-whm-in-linux-you-need-a-license.html', '/docs/install-cpanel-and-whm-in-linux-you-need-a-license'],
  ['/docs/install-cyber-panel-with-open-lite-speed-in-linux.html', '/docs/install-cyber-panel-with-open-lite-speed-in-linux'],
  ['/docs/frequently-asked-questions-fa-qs.html', '/faq'],
  ['/docs/how-to-rebuild-a-server.html', '/docs/how-to-rebuild-a-server'],
  ['/docs/how-to-reset-server-change-or-reset-client-area-password.html', '/docs/how-to-reset-server-change-or-reset-client-area-password'],
  ['/docs/step-by-step-guide-to-fix-win-rm-and-install-net-framework.html', '/docs/step-by-step-guide-to-fix-win-rm-and-install-net-framework'],
  ['/docs/windows-licensing.html', '/docs/windows-licensing'],
  ['/server-status', '/status'],
  ['/server-status/', '/status'],
  ['/features', '/'],
  ['/features/', '/'],
  ['/features.html', '/'],
  ['/security.txt', '/.well-known/security.txt'],
  ['/rdp-vps/index.html', '/rdp-vps'],
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
      ...[...legacyRedirects, ...productionSeoRedirects].map(([source, destination]) => ({
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
        ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }]
        : []),
      /* Non-production deploys (preview, staging, dev) must never be indexed, even by
         crawlers that ignore robots.txt. This uses the shared deploy-env resolver, so
         the header can never contradict the SEO layer's environment classification. */
      ...(isProductionDeployEnv(resolveDeployEnv(process.env))
        ? []
        : [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]),
    ];

    /* Production only: point AI agents at llms.txt, and tell caches that "/" also answers
       Accept: text/markdown (see src/proxy.ts). */
    const homeHeaders = isProductionDeployEnv(resolveDeployEnv(process.env))
      ? [{
          source: '/',
          headers: [
            { key: 'Link', value: '</llms.txt>; rel="describedby"; type="text/markdown"' },
            { key: 'Vary', value: 'Accept' },
          ],
        }]
      : [];

    return [{ source: '/:path*', headers }, ...homeHeaders];
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
