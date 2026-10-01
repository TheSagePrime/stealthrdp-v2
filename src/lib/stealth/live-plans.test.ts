import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPlans, parseStoreStock } from './live-plans';

const block = (id: number, name: string, available: number) => `
  <div class="package" id="product${id}"><h3 class="package-title">${name}</h3>
  <span>Order Now</span> ${available} Available</div>`;

const usaPage = block(99, 'Starter USA', 7) + block(34, 'Bronze USA', 0);
const euPage = block(101, 'Starter EU', 3);

function stubStore(responses: Record<string, Response | Error>) {
  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    const response = responses[url] ?? new Error(`unexpected ${url}`);
    if (response instanceof Error) {
      throw response;
    }
    return response;
  }));
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('live WHMCS stock', () => {
  it('reads the available count for each product block', () => {
    expect(parseStoreStock(usaPage)).toEqual({ 'Starter USA': 7, 'Bronze USA': 0 });
  });

  it('applies live stock to known plans and marks zero stock as out of stock', async () => {
    stubStore({
      'https://dash.stealthrdp.com/store/standard-usa-rdp-vps': new Response(usaPage),
      'https://dash.stealthrdp.com/store/eu': new Response(euPage),
    });

    const byName = Object.fromEntries((await getPlans()).map(plan => [plan.name, plan.source]));

    expect(byName['Starter USA']).toMatchObject({ stock: 7, availability: 'in-stock' });
    expect(byName['Bronze USA']).toMatchObject({ stock: 0, availability: 'out-of-stock' });
    expect(byName['Starter EU']).toMatchObject({ stock: 3, availability: 'in-stock' });
  });

  it('throws at runtime so Next.js keeps the last good page, and falls back during the build', async () => {
    stubStore({
      'https://dash.stealthrdp.com/store/standard-usa-rdp-vps': new Response('down', { status: 503 }),
      'https://dash.stealthrdp.com/store/eu': new Response(euPage),
    });

    vi.stubEnv('NODE_ENV', 'production');

    await expect(getPlans()).rejects.toThrow('responded 503');

    vi.stubEnv('NEXT_PHASE', 'phase-production-build');

    await expect(getPlans()).resolves.toHaveLength(13);
  });
});
