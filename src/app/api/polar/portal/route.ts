import type { NextRequest } from 'next/server';
import { CustomerPortal } from '@polar-sh/nextjs';
import { readPolarConfig } from '@/features/billing/polar';

export const dynamic = 'force-dynamic';

const config = readPolarConfig();

function disabled() {
  return Response.json({ error: 'POLAR_DISABLED' }, { status: 404 });
}

function createPortalHandler() {
  if (!config.enabled || !config.accessToken) {
    return disabled;
  }

  return CustomerPortal({
    accessToken: config.accessToken,
    getCustomerId: async (request: NextRequest) => request.nextUrl.searchParams.get('customerId') ?? '',
    server: config.server,
  });
}

export const GET = createPortalHandler();
