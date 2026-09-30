export const noindexDocPaths = [
  '/docs/use-of-service',
  '/docs/termination-of-service',
  '/docs/payment-terms',
  '/docs/user-responsibilities',
  '/docs/server-stops-randomly',
  '/docs/how-to-reset-server-change-or-reset-client-area-password',
] as const;

export function isNoindexDocPath(path: string): boolean {
  return (noindexDocPaths as readonly string[]).includes(path);
}
