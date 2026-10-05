/* Sections of the Citadel portal, in the order the Citadel page shows them. Each id is the
   portal's path and the slug of its Citadel doc. */
export const portalSectionIds = ['overview', 'analytics', 'insights', 'logs', 'security', 'branding', 'cache', 'health', 'settings'] as const;

export type PortalSectionId = (typeof portalSectionIds)[number];

export const portalDocHref = (id: PortalSectionId) => `/citadel/docs/${id}`;
