import type { BillingCycle } from './content';
import { describe, expect, it } from 'vitest';
import featuresJson from '../../content/features.json';
import { articlePath, blogArticles, citadelDocsArticles, helpDocsArticles, indexableDocPublicPaths } from './articles';
import { billingCycles, checkoutUrl, faqs, plans, reviews, testimonials, uptime } from './content';
import { noindexDocPaths } from './routes';

const coreIndexablePaths = [
  '/',
  '/plans',
  '/windows-vps',
  '/linux-vps',
  '/status',
  '/blog',
  '/faq',
  '/about',
  '/docs',
  '/vps-hosting-minecraft',
];

/* Blog slugs that were indexable on the v1 site. Later additions (the VPS use-case
   articles, Citadel docs, Discord reviews) are new content, not v1 URLs. */
const v1BlogSlugs = [
  '5-ways-to-optimize-your-rdp-performance-for-remote-work',
  '7-best-tools-for-server-uptime-monitoring-2025',
  '7-tips-for-securing-your-remote-desktop-connection',
  '8-signs-you-need-to-upgrade-your-vps-resources',
  'common-vps-hosting-issues-and-their-solutions',
  'common-vps-performance-bottlenecks',
  'ddos-protection-for-vps-essential-setup-checklist',
  'designing-automated-high-availability-vps',
  'how-to-set-up-automated-backups-for-vps-hosting',
  'top-6-vps-management-tools-for-small-businesses',
  'windows-vs-linux-vps-which-os-best-fits-your-business',
];

const expectedNoindexDocs = [
  '/docs/use-of-service',
  '/docs/termination-of-service',
  '/docs/payment-terms',
  '/docs/user-responsibilities',
  '/docs/server-stops-randomly',
  '/docs/how-to-reset-server-change-or-reset-client-area-password',
];

/* The live WHMCS catalog read on 2026-09-26: 7 USA tiers + 6 EU tiers,
   Starter included. Order matches src/content/plans.json. */
const expectedPlans = [
  'Starter USA',
  'Bronze USA',
  'Silver USA',
  'Gold USA',
  'Platinum USA',
  'Diamond USA',
  'Emerald USA',
  'Starter EU',
  'Bronze EU',
  'Silver EU',
  'Gold EU',
  'Platinum EU',
  'Diamond EU',
];

describe('StealthRDP public-site migration contract', () => {
  it('preserves the production content corpus', () => {
    expect(plans.map(plan => plan.name)).toEqual(expectedPlans);
    expect(faqs).toHaveLength(21);
    expect(testimonials).toHaveLength(13);
    expect(reviews).toHaveLength(48);
    expect(blogArticles).toHaveLength(17);
    expect(helpDocsArticles).toHaveLength(22);
    expect(citadelDocsArticles).toHaveLength(19);
    expect(uptime.monitors).toHaveLength(9);
    expect(featuresJson).toHaveLength(16);
  });

  it('preserves the 37 indexable public URLs', () => {
    const articlePaths = blogArticles
      .filter(article => v1BlogSlugs.includes(article.slug))
      .map(articlePath);

    const paths = [...coreIndexablePaths, ...articlePaths, ...indexableDocPublicPaths];

    expect(new Set(paths).size).toBe(37);
    expect(paths).toHaveLength(37);
    expect(articlePaths).toHaveLength(v1BlogSlugs.length);
    expect(articlePaths.every(path => path.endsWith('.html'))).toBe(true);
    expect(indexableDocPublicPaths).toHaveLength(16);
  });

  it('preserves the six existing noindex-follow documentation routes', () => {
    expect([...noindexDocPaths]).toEqual(expectedNoindexDocs);
    expect(indexableDocPublicPaths.some(path => expectedNoindexDocs.includes(path))).toBe(false);
  });

  it('keeps plan checkout on the StealthRDP billing boundary', () => {
    expect(plans.length).toBeGreaterThan(0);
    expect(new Set(plans.map(plan => plan.name)).size).toBe(plans.length);

    for (const plan of plans) {
      const checkout = new URL(checkoutUrl(plan, 'monthly'));

      expect(checkout.hostname).toBe('dash.stealthrdp.com');
      expect(checkout.searchParams.get('billingcycle')).toBe('monthly');
    }
  });

  it('publishes every WHMCS billing cycle with its own interval and checkout key', () => {
    const suffixByCycle: Record<BillingCycle, string> = {
      monthly: '/mo',
      quarterly: '/3mo',
      semiannual: '/6mo',
      annual: '/yr',
      biannual: '/2yr',
    };

    for (const plan of plans) {
      for (const [cycle, suffix] of Object.entries(suffixByCycle) as [BillingCycle, string][]) {
        const price = plan.pricing[cycle];

        expect(price, `${plan.name} is missing the ${cycle} price`).toBeDefined();
        expect(price.amount, `${plan.name} ${cycle} amount`).toBeGreaterThan(0);
        expect(price.suffix, `${plan.name} ${cycle} interval`).toBe(suffix);
        expect(
          checkoutUrl(plan, cycle),
          `${plan.name} ${cycle} browser cycle`,
        ).toContain(`billingcycle=${billingCycles[cycle].urlKey}`);
      }
    }
  });
});
