import type { AuthenticatedPrincipal } from '@/features/security/principal';

export type TenantScope = {
  ownerId: string;
};

export function tenantScope(principal: AuthenticatedPrincipal): TenantScope {
  return { ownerId: principal.tenantId };
}
