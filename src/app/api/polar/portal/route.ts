import type { NextRequest } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { CustomerPortal } from '@polar-sh/nextjs';
import { readPolarConfig } from '@/features/billing/polar';

export const dynamic = 'force-dynamic';

function disabled() {
  return Response.json({ error: 'POLAR_DISABLED' }, { status: 404 });
}

function customerIdFromPrivateMetadata(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return null;
  }

  const value = (metadata as Record<string, unknown>).polarCustomerId;
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

export async function GET(request: NextRequest) {
  const config = readPolarConfig();
  if (!config.enabled || !config.accessToken) {
    return disabled();
  }

  const user = await currentUser();
  if (!user) {
    return Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const customerId = customerIdFromPrivateMetadata(user.privateMetadata);
  if (!customerId) {
    return Response.json({ error: 'POLAR_CUSTOMER_NOT_LINKED' }, { status: 409 });
  }

  const handler = CustomerPortal({
    accessToken: config.accessToken,
    getCustomerId: async () => customerId,
    server: config.server,
  });

  return handler(request);
}
