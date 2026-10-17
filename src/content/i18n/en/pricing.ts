import type { BillingCycle } from '../../../lib/stealth/content';

/* Words of the plan cards, billing switch and comparison table (PricingExplorer, HomePricing).
   English shows the labels stored with each plan in plans.json; other languages translate them. */

const amount = (value: number) => Number.isInteger(value) ? `${value}` : value.toFixed(2);

const pricing = {
  money: (value: number) => `€${amount(value)}`,
  /* `stored` is the plan's own label from plans.json, which is English. */
  suffix: (_cycle: BillingCycle, stored: string) => stored,
  period: (_cycle: BillingCycle, stored: string) => stored,
  discount: (stored: string) => stored,
  description: (stored: string) => stored,
  spec: (stored: string) => stored,
  effective: (perMonth: number) => ` · €${perMonth.toFixed(2)}/mo effective`,
  cycleLabels: {
    monthly: { full: 'Monthly', short: '1 mo' },
    quarterly: { full: 'Quarterly', short: '3 mo' },
    semiannual: { full: '6-month', short: '6 mo' },
    annual: { full: 'Annual', short: '1 yr' },
    biannual: { full: '2-year', short: '2 yr' },
  } as Record<BillingCycle, { full: string; short: string }>,
  cycleNames: {
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    semiannual: 'Semi-annual',
    annual: 'Annual',
    biannual: 'Biannual',
  } as Record<BillingCycle, string>,
  priceHeader: {
    monthly: 'Price per month',
    quarterly: 'Price per quarter',
    semiannual: 'Price per 6 months',
    annual: 'Price per year',
    biannual: 'Price per 2 years',
  } as Record<BillingCycle, string>,
  regionNames: { USA: 'USA', EU: 'EU' },
  regionGroup: 'Deployment region',
  billingGroup: 'Billing cycle',
  termAria: (price: string, period: string) => `from ${price} ${period}, due today`,
  noPrice: 'price at checkout',
  liveAria: (plan: string, cycle: string, price: string, period: string) => `${plan}, ${cycle}: ${price} ${period}, due today`,
  noPlan: 'No plan selected',
  mostPopular: 'Most popular',
  featured: 'Featured',
  region: 'Region:',
  traffic: 'traffic',
  dueToday: 'due today',
  standard: 'standard',
  orderNow: 'Order Now',
  orderAria: (plan: string) => `Order Now: ${plan} — opens the StealthRDP checkout at dash.stealthrdp.com`,
  see: 'See',
  outOfStockRow: 'Out of stock',
  outOfStockCard: 'Out of Stock',
  altRowAria: (plan: string, alternative: string) => `${plan} is out of stock — buy ${alternative} instead at dash.stealthrdp.com`,
  altCardAria: (plan: string, alternative: string) => `${plan} is out of stock — see ${alternative} instead`,
  linuxOnly: 'Linux only',
  linuxWindows: 'Linux + Windows',
  specs: { cpu: 'CPU', ram: 'RAM', storage: 'Storage', bandwidth: 'Bandwidth' },
  available: (count: number) => `${count} Available`,
  inStock: 'In stock',
  outOfStock: 'Out of stock',
  cpuLabel: (value: string, max: number) => `CPU: ${value} of ${max} cores in this region`,
  ramLabel: (value: string, max: number) => `Memory: ${value} of ${max} GB in this region`,
  storageLabel: (value: string, max: number) => `Storage: ${value} of ${max} GB in this region`,
  compare: {
    title: 'See the difference in one view.',
    hidden: 'VPS Features Comparison',
    kicker: '02 / Compare precisely',
    label: 'Compare all specs',
    note: 'Use this table for a quick resource check. Checkout confirms the current price and availability.',
    hint: 'Swipe the table to compare every column.',
    plan: 'Plan',
    action: 'Action',
  },
};

export type PricingCopy = typeof pricing;

export default pricing;
