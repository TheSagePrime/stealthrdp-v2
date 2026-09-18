import 'server-only';
import { auth } from '@clerk/nextjs/server';

export type AuthenticatedPrincipal = {
  userId: string;
  orgId: string | null;
  tenantId: string;
  billingExternalId: string;
  canManageBilling: boolean;
};

export async function getAuthenticatedPrincipal(): Promise<AuthenticatedPrincipal | null> {
  const { has, isAuthenticated, orgId, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return null;
  }

  const tenantId = orgId ?? userId;

  return {
    userId,
    orgId: orgId ?? null,
    tenantId,
    billingExternalId: tenantId,
    canManageBilling: orgId ? has({ role: 'org:admin' }) : true,
  };
}
