import type { SeoConfig } from '../../config/seo';
import { defaultSeoConfig } from '../../config/seo';
import { resolveDeployEnv } from './env';
import { resolveSiteUrl } from './site-url';

/**
 * Returns starter SEO config with the resolved SITE_URL and deploy environment.
 */
export function getSeoConfig(
  env: NodeJS.Dict<string> = process.env,
): SeoConfig {
  const deployEnv = resolveDeployEnv(env);
  const site = resolveSiteUrl(env, deployEnv);

  return {
    ...defaultSeoConfig,
    siteUrl: site.origin,
    environment: { deployEnv },
  };
}
