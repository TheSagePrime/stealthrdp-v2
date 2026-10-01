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

export function checkoutUrl(plan: Plan, cycle: BillingCycle): string {
  const value = new URL(plan.purchaseUrl);
  value.searchParams.set('billingcycle', billingCycles[cycle]?.urlKey ?? cycle);
  return value.toString();
}
