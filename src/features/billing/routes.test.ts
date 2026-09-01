import { NextRequest } from 'next/server';
import { describe, expect, it, vi } from 'vitest';

import { GET as checkout } from '@/app/api/polar/checkout/route';
import { POST as webhook } from '@/app/api/polar/webhook/route';

vi.mock('@polar-sh/nextjs', () => ({
  Checkout: () => async () => Response.json({ error: 'POLAR_ADAPTER_CALLED' }),
  Webhooks: () => async () => Response.json({ error: 'POLAR_ADAPTER_CALLED' }),
}));

describe('Polar routes', () => {
  it('keeps checkout disabled without runtime configuration', async () => {
    const response = await checkout(new NextRequest('http://localhost/api/polar/checkout'));

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: 'POLAR_DISABLED' });
  });

  it('keeps webhooks disabled without a signing secret', async () => {
    const response = await webhook(new NextRequest('http://localhost/api/polar/webhook', { method: 'POST' }));

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: 'POLAR_DISABLED' });
  });
});
