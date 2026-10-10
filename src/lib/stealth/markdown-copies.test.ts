import { describe, expect, it } from 'vitest';
import { citadelCopy } from '@/content/i18n/citadel';
import { linuxVpsCopy } from '@/content/i18n/linux-vps';
import { plansCopy } from '@/content/i18n/plans';
import { pricingCopy } from '@/content/i18n/pricing';
import { windowsVpsCopy } from '@/content/i18n/windows-vps';
import { checkoutUrl } from '@/lib/stealth/checkout';
import { citadelPlans } from '@/lib/stealth/citadel-plans';
import { plans } from '@/lib/stealth/content';
import { findPageCopy, pageCopySlugs } from '@/lib/stealth/markdown-copies';
import { linuxDistros, windowsVersions } from '@/lib/stealth/os-catalog';
import { getSeoConfig } from '@/libs/seo/config';

const en = pricingCopy.en;
const cycles = ['monthly', 'quarterly', 'semiannual', 'annual', 'biannual'] as const;

describe('product page Markdown copies', () => {
  it('serves the four product pages', () => {
    expect(pageCopySlugs().sort()).toEqual(['citadel', 'linux-vps', 'plans', 'windows-vps']);
  });

  it('returns nothing for an unknown slug', () => {
    expect(findPageCopy('not-a-page')).toBeUndefined();
  });

  it.each([
    ['plans', plansCopy.en.meta.title, plansCopy.en.meta.description],
    ['windows-vps', windowsVpsCopy.en.meta.title, windowsVpsCopy.en.meta.description],
    ['linux-vps', linuxVpsCopy.en.meta.title, linuxVpsCopy.en.meta.description],
    ['citadel', citadelCopy.en.meta.title, citadelCopy.en.meta.description],
  ])('%s starts with the page title and carries the page description', (slug, title, description) => {
    const markdown = findPageCopy(slug)!;

    expect(markdown.startsWith(`# ${title}\n`)).toBe(true);
    expect(markdown).toContain(description);
    expect(markdown).toContain(`${getSeoConfig().siteUrl}/${slug}`);
  });

  it('lists every plan, its specs, its checkout link and every price from the catalogue', () => {
    const markdown = findPageCopy('plans')!;

    for (const plan of plans) {
      expect(markdown).toContain(`[${plan.name}](${checkoutUrl(plan, 'monthly', 'en')})`);
      expect(markdown).toContain(plan.specs.ram);
      expect(markdown).toContain(plan.specs.storage);

      for (const cycle of cycles) {
        expect(markdown).toContain(en.money(plan.pricing[cycle].amount));
      }
    }
  });

  it('has one plans table per region with the plan rows of that region', () => {
    const markdown = findPageCopy('plans')!;

    for (const region of ['USA', 'EU'] as const) {
      expect(markdown).toContain(`### ${en.regionNames[region]} plans`);

      const rowsInRegion = plans.filter(plan => plan.location === region).length;
      const section = markdown.split(`### ${en.regionNames[region]} plans`)[1]!.split(/\n\n#{2,3} /)[0]!;
      const planRows = section.split('\n').filter(line => line.startsWith('| [')).length;

      expect(planRows).toBe(rowsInRegion);
    }
  });

  it('lists the Windows versions and Linux distributions from the shared lists', () => {
    const windows = findPageCopy('windows-vps')!;
    const linux = findPageCopy('linux-vps')!;

    for (const version of windowsVersions) {
      expect(windows).toContain(`Windows Server ${version}`);
    }
    for (const distro of linuxDistros) {
      expect(linux).toContain(`| ${distro.name} |`);
    }
  });

  it('lists the Citadel plans with their checkout links and prices from the page data', () => {
    const markdown = findPageCopy('citadel')!;

    citadelPlans.forEach((plan, index) => {
      expect(markdown).toContain(`[${citadelCopy.en.plansSection.order}](${plan.checkout})`);
      expect(markdown).toContain(`${citadelCopy.en.plans[index]!.priceLabel}${citadelCopy.en.plansSection.perMonth}`);
    });
  });
});
