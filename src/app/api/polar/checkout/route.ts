import type { NextRequest } from 'next/server';
import { createPolarCheckout, resolveAllowedPolarProduct } from '@/features/billing/polar-api';
import { readPolarConfig } from '@/features/billing/polar';
import { getAuthenticatedPrincipal } from '@/features/security/principal';
import { isSameOriginMutation } from '@/features/security/origin';
import { consumeRateLimit } from '@/features/security/rate-limit';
import { sensitiveJson, sensitiveRedirect } from '@/features/security/response';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const config = readPolarConfig();

  if (!config.enabled || !config.accessToken || !config.successUrl || config.allowedProductIds.length === 0) {
    return sensitiveJson({ error: 'POLAR_DISABLED' }, { status: 404 });
  }

  const principal = await getAuthenticatedPrincipal();
  if (!principal) {
    return sensitiveJson({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (!isSameOriginMutation(request)) {
    return sensitiveJson({ error: 'FORBIDDEN_ORIGIN' }, { status: 403 });
  }

  const rateLimit = consumeRateLimit(`polar:checkout:${principal.billingExternalId}`, { limit: 6 });
  if (!rateLimit.allowed) {
    return sensitiveJson(
      { error: 'RATE_LIMITED' },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  const productId = resolveAllowedPolarProduct(request.nextUrl.searchParams.get('productId'));
  if (!productId) {
    return sensitiveJson({ error: 'INVALID_PRODUCT' }, { status: 400 });
  }

  try {
    const checkoutUrl = await createPolarCheckout(principal, productId);
    return sensitiveRedirect(checkoutUrl);
  } catch {
    return sensitiveJson({ error: 'POLAR_UNAVAILABLE' }, { status: 502 });
  }
}
