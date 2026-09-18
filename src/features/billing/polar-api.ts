import 'server-only';
import { Polar } from '@polar-sh/sdk';
import type { AuthenticatedPrincipal } from '@/features/security/principal';
import { readPolarConfig } from './polar';

function isTrustedPolarUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:'
      && (url.hostname === 'polar.sh' || url.hostname.endsWith('.polar.sh'));
  } catch {
    return false;
  }
}

function createPolarClient() {
  const config = readPolarConfig();

  if (!config.enabled || !config.accessToken) {
    throw new Error('POLAR_DISABLED');
  }

  return {
    client: new Polar({
      accessToken: config.accessToken,
      server: config.server,
    }),
    config,
  };
}

export function resolveAllowedPolarProduct(requestedProductId: string | null): string | null {
  const { allowedProductIds } = readPolarConfig();

  if (allowedProductIds.length === 0) {
    return null;
  }

  const candidate = requestedProductId ?? (allowedProductIds.length === 1 ? allowedProductIds[0] : null);
  return candidate && allowedProductIds.includes(candidate) ? candidate : null;
}

export async function createPolarCheckout(
  principal: AuthenticatedPrincipal,
  productId: string,
): Promise<string> {
  const { client, config } = createPolarClient();

  if (!config.successUrl) {
    throw new Error('POLAR_SUCCESS_URL_REQUIRED');
  }

  const checkout = await client.checkouts.create({
    products: [productId],
    externalCustomerId: principal.billingExternalId,
    successUrl: config.successUrl,
    allowDiscountCodes: false,
  });

  if (!isTrustedPolarUrl(checkout.url)) {
    throw new Error('POLAR_UNTRUSTED_REDIRECT');
  }

  return checkout.url;
}

export async function createPolarPortal(
  principal: AuthenticatedPrincipal,
): Promise<string> {
  const { client, config } = createPolarClient();

  const session = await client.customerSessions.create({
    externalCustomerId: principal.billingExternalId,
    ...(config.portalReturnUrl ? { returnUrl: config.portalReturnUrl } : {}),
  });

  if (!isTrustedPolarUrl(session.customerPortalUrl)) {
    throw new Error('POLAR_UNTRUSTED_REDIRECT');
  }

  return session.customerPortalUrl;
}
