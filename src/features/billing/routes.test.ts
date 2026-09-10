import { currentUser } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { GET as checkout } from '@/app/api/polar/checkout/route';
import { GET as portal } from '@/app/api/polar/portal/route';
import { POST as webhook } from '@/app/api/polar/webhook/route';

vi.mock('@clerk/nextjs/server', () => ({
  currentUser: vi.fn(),
}));

vi.mock('@polar-sh/nextjs', () => ({
  Checkout: () => async () => Response.json({ error: 'POLAR_ADAPTER_CALLED' }),
  CustomerPortal: (
    { getCustomerId }: { getCustomerId: (request: NextRequest) => Promise<string> },
  ) => async (request: NextRequest) => Response.json({ customerId: await getCustomerId(request) }),
  Webhooks: () => async () => Response.json({ error: 'POLAR_ADAPTER_CALLED' }),
}));

const currentUserMock = vi.mocked(currentUser);

afterEach(() => {
  delete process.env.POLAR_ACCESS_TOKEN;
  currentUserMock.mockReset();
});

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

  it('rejects an unauthenticated customer portal request', async () => {
    process.env.POLAR_ACCESS_TOKEN = 'polar_test_token';
    currentUserMock.mockResolvedValue(null);

    const response = await portal(new NextRequest('http://localhost/api/polar/portal'));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: 'UNAUTHORIZED' });
  });

  it('rejects an authenticated user without a linked Polar customer', async () => {
    process.env.POLAR_ACCESS_TOKEN = 'polar_test_token';
    currentUserMock.mockResolvedValue({ privateMetadata: {} } as never);

    const response = await portal(new NextRequest('http://localhost/api/polar/portal'));

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({ error: 'POLAR_CUSTOMER_NOT_LINKED' });
  });

  it('uses the authenticated user private metadata instead of a forged query customerId', async () => {
    process.env.POLAR_ACCESS_TOKEN = 'polar_test_token';
    currentUserMock.mockResolvedValue({
      privateMetadata: { polarCustomerId: 'customer_owned_by_session' },
    } as never);

    const response = await portal(
      new NextRequest('http://localhost/api/polar/portal?customerId=customer_supplied_by_browser'),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ customerId: 'customer_owned_by_session' });
  });
});
