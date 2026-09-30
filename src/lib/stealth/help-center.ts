import type { DocArticle } from '@/lib/stealth/content';
import { docPublicSlug } from '@/lib/stealth/content';

export type HelpCollection = {
  title: string;
  description: string;
  slugs: string[];
};

export const helpCollections: HelpCollection[] = [
  {
    title: 'Getting started',
    description: 'Access, rebuild, and first server-management tasks.',
    slugs: [
      '1737943955-introduction',
      '1737945157-how-do-i-log-into-windows',
      '1740916941-how-to-rebuild-a-server',
      '1740917234-how-to-reset-server-change-or-reset-client-area-password',
    ],
  },
  {
    title: 'Windows & RDP',
    description: 'Windows access, evaluation, licensing, and management fixes.',
    slugs: [
      'windows-licensing',
      '1737944563-how-to-re_activate-and-extend-your-180_day-windows-trial',
      '1737944952-server-stops-randomly',
      '1742181117-step_by_step-guide-to-fix-win_rm-and-install-net-framework',
    ],
  },
  {
    title: 'Networking & VPN',
    description: 'VPN setup, TUN/TAP, and network-level configuration.',
    slugs: [
      '1737946054-how-to-setup-your-vpn-on-linux-server-using-outline',
      '1737946390-setup-tun-tap-for-open_vpn',
    ],
  },
  {
    title: 'Web hosting & panels',
    description: 'Control panels, HTTPS, and common website administration tasks.',
    slugs: [
      '1737946569-install-fast-panel-in-linux-good-web-hosting-free-panel',
      '1737946470-how-to-install-centos-web-panel-cwp-free-web-panel',
      '1737946490-how-to-install-direct-admin-in-a-linux-server',
      '1737946509-install-cpanel-and-whm-in-linux-you-need-a-license',
      '1737946534-install-cyber-panel-with-open_lite_speed-in-linux',
      '1737945947-how-to-force-https-using-htaccess',
      '1737945988-why-you-should-redirect-all-http-traffic-to-https',
      '1737946010-10-ways-to-optimize-your-word_press-website-for-speed',
    ],
  },
  {
    title: 'Account, billing & policies',
    description: 'Service rules, payment terms, responsibilities, and termination.',
    slugs: [
      '1737944013-use-of-service',
      '1737944184-payment-terms',
      '1737944204-user-responsibilities',
      '1737944110-termination-of-service',
    ],
  },

];

export const citadelCollections: HelpCollection[] = [
  {
    title: 'Citadel: Start here',
    description: 'Connect Cloudflare, understand protection, and activate your first site.',
    slugs: [
      'citadel-getting-started',
      'citadel-overview',
      'citadel-cloudflare-setup',
    ],
  },
  {
    title: 'Citadel: Domains',
    description: 'Manage protected hostnames, origins, DNS, and health.',
    slugs: [
      'citadel-domains',
      'citadel-domain-overview',
      'citadel-origin',
      'citadel-health',
      'citadel-dns',
    ],
  },
  {
    title: 'Citadel: Protection',
    description: 'Choose challenge levels, bypasses, branding, caching, and incident controls.',
    slugs: [
      'citadel-security',
      'citadel-challenge-levels',
      'citadel-branding',
      'citadel-allowlists',
      'citadel-cache',
      'citadel-insights',
    ],
  },
  {
    title: 'Citadel: Traffic',
    description: 'Investigate request logs, analytics, bandwidth, and speed limits.',
    slugs: [
      'citadel-logs',
      'citadel-analytics',
      'citadel-bandwidth',
    ],
  },
  {
    title: 'Citadel: Account',
    description: 'Manage your team, alerts, billing, and support.',
    slugs: [
      'citadel-settings',
      'citadel-billing-support',
    ],
  },
];

export function helpCollectionId(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function articlesForCollection(
  collection: HelpCollection,
  articles: DocArticle[],
): DocArticle[] {
  return collection.slugs
    .map(slug => articles.find(article => article.slug === slug))
    .filter((article): article is DocArticle => Boolean(article));
}

export function helpCollectionForArticle(article: DocArticle): HelpCollection | undefined {
  return helpCollections.find(collection => collection.slugs.includes(article.slug));
}

export function helpArticleHref(article: DocArticle): string {
  return `/docs/${docPublicSlug(article)}`;
}

export function citadelArticleHref(article: DocArticle): string {
  return `/citadel/docs/${docPublicSlug(article).replace(/^citadel-/, '')}`;
}

export function citadelCollectionForArticle(article: DocArticle): HelpCollection | undefined {
  return citadelCollections.find(collection => collection.slugs.includes(article.slug));
}
