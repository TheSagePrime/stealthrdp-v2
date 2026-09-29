export type DeployEnv = 'development' | 'test' | 'preview' | 'production';

/**
 * Resolves one deploy environment for all SEO behavior.
 * Priority: VERCEL_ENV → APP_ENV → NODE_ENV → development.
 */
export function resolveDeployEnv(
  env: NodeJS.Dict<string> = process.env,
): DeployEnv {
  const raw = env.VERCEL_ENV || env.APP_ENV || env.NODE_ENV || 'development';
  const value = raw.trim().toLowerCase();

  if (value === 'production' || value === 'prod') {
    return 'production';
  }
  if (value === 'preview' || value === 'staging') {
    return 'preview';
  }
  if (value === 'test') {
    return 'test';
  }

  return 'development';
}

export function isProductionDeployEnv(env: DeployEnv = resolveDeployEnv()): boolean {
  return env === 'production';
}
