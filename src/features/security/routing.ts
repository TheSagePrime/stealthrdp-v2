export const authPagePrefixes = ['/sign-in', '/sign-up'] as const;
export const protectedPagePrefixes = ['/dashboard', '/onboarding'] as const;
export const clerkContextPagePrefixes = [...authPagePrefixes, ...protectedPagePrefixes] as const;
export const publicApiPaths = ['/api/health', '/api/ready', '/api/polar/webhook'] as const;
export const sensitiveApiPaths = ['/api/polar/checkout', '/api/polar/portal'] as const;
