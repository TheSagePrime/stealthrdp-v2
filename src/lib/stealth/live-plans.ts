import type { Plan } from '@/lib/stealth/content';
import { z } from 'zod';
import { plans as catalogPlans } from '@/lib/stealth/content';
import 'server-only';

/* Live stock for the plan catalogue.
   Prices and specs stay in src/content/plans.json. Only the WHMCS stock count is read live, from
   the public store pages. Pages that call getPlans() set `export const revalidate = 21600`
   (6 hours), so stock refreshes on its own schedule with no deploy, cron job or commit. */

const STORE_PAGES = [
  'https://dash.stealthrdp.com/store/standard-usa-rdp-vps',
  'https://dash.stealthrdp.com/store/eu',
];

const REVALIDATE_SECONDS = 21_600;

const stockByName = z.record(z.string(), z.number().int().min(0).max(100_000));

/** Reads "<h3 class="package-title">NAME</h3> ... 19 Available" from each product block. */
export function parseStoreStock(html: string): Record<string, number> {
  const stock: Record<string, number> = {};

  for (const block of html.split(/(?=<div class="package[ "][^>]*id="product\d+")/).slice(1)) {
    const name = block.match(/class="package-title">([^<]+)</)?.[1]?.trim();
    const available = block.match(/(\d+)\s+Available/)?.[1];
    if (name && available) {
      stock[name] = Number(available);
    }
  }

  return stockByName.parse(stock);
}

async function fetchStoreStock(url: string): Promise<Record<string, number>> {
  const response = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error(`WHMCS store page ${url} responded ${response.status}`);
  }
  return parseStoreStock(await response.text());
}

/** The plan catalogue with current stock applied. A plan the store does not report keeps its catalogue stock. */
export async function getPlans(): Promise<Plan[]> {
  let stock: Record<string, number>;

  try {
    stock = Object.assign({}, ...(await Promise.all(STORE_PAGES.map(fetchStoreStock))));
    if (!catalogPlans.some(plan => plan.name in stock)) {
      throw new Error('WHMCS store pages contained none of the catalogue plans');
    }
  } catch (error) {
    /* Builds and dev must not depend on WHMCS. At runtime, throwing makes Next.js keep serving the
       last page that was generated successfully, and retry on the next request. */
    if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV !== 'production') {
      return catalogPlans;
    }
    throw error;
  }

  return catalogPlans.map((plan) => {
    const available = stock[plan.name];
    if (available === undefined) {
      return plan;
    }
    return {
      ...plan,
      source: { ...plan.source, stock: available, availability: available > 0 ? 'in-stock' : 'out-of-stock' },
    };
  });
}
