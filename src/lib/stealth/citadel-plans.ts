/* The Citadel plans on /citadel: name, price (EUR per month, used for structured data) and the WHMCS
   checkout link. The words of each plan are in src/content/i18n/<language>/citadel.ts, in the same
   order. Shared by the page and the Markdown copy at /docs-md/citadel. */
export const citadelPlans = [
  { name: 'Starter', price: 0, checkout: 'https://dash.stealthrdp.com/store/layer-7-ddos-protection/citadel-starter', featured: false },
  { name: 'Growth', price: 49, checkout: 'https://dash.stealthrdp.com/store/layer-7-ddos-protection/citadel-business', featured: true },
  { name: 'Scale', price: 149, checkout: 'https://dash.stealthrdp.com/store/layer-7-ddos-protection/citadel-enterprise', featured: false },
] as const;

/* The Citadel product page in the WHMCS store (the "View protection plans" link). */
export const citadelStoreUrl = 'https://dash.stealthrdp.com/store/layer-7-ddos-protection';
