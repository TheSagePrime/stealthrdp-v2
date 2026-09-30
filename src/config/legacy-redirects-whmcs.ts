import type { Redirect } from 'next/dist/lib/load-custom-routes';

const DASH = 'https://dash.stealthrdp.com';
const DASH_LOGIN = `${DASH}/index.php?rp=/login`;
const DASH_PASSWORD_RESET = `${DASH}/index.php?rp=/password/reset`;

// Old WHMCS-era URLs that used to live on the marketing domain. The client area now
// lives on dash.stealthrdp.com; store, announcement and knowledge-base links map to
// their marketing-site equivalents. Mirrors the v1 site's proxy rules.
export const whmcsLegacyRedirects: Redirect[] = [
  { source: '/index.php', destination: '/', permanent: true },
  { source: '/index.html', destination: '/', permanent: true },
  { source: '/dash/login.php', destination: DASH_LOGIN, permanent: true },
  { source: '/dash/index.php/knowledgebase/:path*', destination: '/docs', permanent: true },
  { source: '/dash/index.php/user/password/:path*', destination: DASH_PASSWORD_RESET, permanent: true },
  {
    source: '/dash/index.php',
    has: [{ type: 'query', key: 'rp', value: '/store/.*' }],
    destination: '/plans',
    permanent: true,
  },
  {
    source: '/dash/index.php',
    has: [{ type: 'query', key: 'rp', value: '/announcements/.*' }],
    destination: '/blog',
    permanent: true,
  },
  {
    source: '/dash/index.php',
    has: [{ type: 'query', key: 'rp', value: '/knowledgebase/.*' }],
    destination: '/docs',
    permanent: true,
  },
  {
    source: '/dash/index.php',
    has: [{ type: 'query', key: 'rp', value: '/password/reset.*' }],
    destination: DASH_PASSWORD_RESET,
    permanent: true,
  },
];
