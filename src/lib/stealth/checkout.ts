import type { BillingCycle, Plan } from './content';

/* Billing cycles and the WHMCS checkout link. Kept apart from content.ts so
   client components can build checkout links without bundling the content
   JSON. WHMCS urlKeys: annually, semiannually, biennially; monthly and
   quarterly keep their own name. */
export const billingCycles: Record<BillingCycle, { label: string; urlKey: string }> = {
  monthly: { label: 'Monthly', urlKey: 'monthly' },
  quarterly: { label: 'Quarterly', urlKey: 'quarterly' },
  semiannual: { label: 'Semi-annual', urlKey: 'semiannually' },
  annual: { label: 'Annual', urlKey: 'annually' },
  biannual: { label: 'Biannual', urlKey: 'biennially' },
};

/* Button labels for the billing switch. Phones show the short form; screen readers always get the full one. */
export const cycleLabels: Record<BillingCycle, { full: string; short: string }> = {
  monthly: { full: 'Monthly', short: '1 mo' },
  quarterly: { full: 'Quarterly', short: '3 mo' },
  semiannual: { full: '6-month', short: '6 mo' },
  annual: { full: 'Annual', short: '1 yr' },
  biannual: { full: '2-year', short: '2 yr' },
};

/* WHMCS language names. German and Spanish visitors land in a checkout in their language when
   WHMCS has that language enabled; WHMCS ignores the parameter otherwise. */
const whmcsLanguages: Record<string, string> = { de: 'german', es: 'spanish' };

export function checkoutUrl(plan: Plan, cycle: BillingCycle, locale = 'en'): string {
  const value = new URL(plan.purchaseUrl);
  value.searchParams.set('billingcycle', billingCycles[cycle]?.urlKey ?? cycle);
  const language = whmcsLanguages[locale];
  if (language) {
    value.searchParams.set('language', language);
  }
  return value.toString();
}
