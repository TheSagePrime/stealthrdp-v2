import { describe, expect, it } from 'vitest';
import featuresJson from '../../content/features.json';
import {
  articlePath,
  blogArticles,
  checkoutUrl,
  docsArticles,
  faqs,
  indexableDocPublicPaths,
  plans,
  reviews,
  testimonials,
  uptime,
} from './content';
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

const expectedNoindexDocs = [
  '/docs/use-of-service',
  '/docs/termination-of-service',
  '/docs/payment-terms',
  '/docs/user-responsibilities',
  '/docs/server-stops-randomly',
  '/docs/how-to-reset-server-change-or-reset-client-area-password',
];

const expectedPlans = [
  'Bronze USA',
  'Silver USA',
  'Gold USA',
  'Platinum USA',
  'Diamond USA',
  'Emerald USA',
  'Bronze EU',
  'Silver EU',
  'GOLD EU',
  'Platinum EU',
  'Diamond EU',
];

describe('StealthRDP public-site migration contract', () => {
  it('preserves the production content corpus', () => {
    expect(plans.map(plan => plan.name)).toEqual(expectedPlans);
    expect(faqs).toHaveLength(21);
    expect(testimonials).toHaveLength(6);
    expect(reviews).toHaveLength(48);
    expect(blogArticles).toHaveLength(12);
    expect(docsArticles).toHaveLength(23);
    expect(uptime.monitors).toHaveLength(9);
    expect(featuresJson).toHaveLength(16);
  });

  it('preserves the 38 currently indexable public URLs', () => {
    const articlePaths = blogArticles
      .filter(article => article.slug !== 'vps-hosting-minecraft')
      .map(articlePath);

    const paths = [...coreIndexablePaths, ...articlePaths, ...indexableDocPublicPaths];

    expect(new Set(paths).size).toBe(38);
    expect(paths).toHaveLength(38);
    expect(articlePaths).toHaveLength(11);
    expect(articlePaths.every(path => path.endsWith('.html'))).toBe(true);
    expect(indexableDocPublicPaths).toHaveLength(17);
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
});
