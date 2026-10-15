import type { Plan } from '@/lib/stealth/content';
import { plans as catalogPlans } from '@/lib/stealth/content';
import 'server-only';

/* Stock is temporarily managed manually on the storefront.
   USA plans are available without a stock count; EU plans are out of stock.
   No WHMCS stock requests are made. */
export async function getPlans(): Promise<Plan[]> {
  return catalogPlans.map((plan) => {
    const { stock: _catalogStock, ...source } = plan.source;
    const isEu = plan.location.toUpperCase() === 'EU';
    return {
      ...plan,
      source: {
        ...source,
        ...(isEu ? { stock: 0 } : {}),
        availability: isEu ? 'out-of-stock' : 'in-stock',
      },
    };
  });
}
