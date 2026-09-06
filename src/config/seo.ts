import type { DeployEnv } from '../libs/seo/env';

export type SeoConfig = {
  siteUrl: string;
  projectName?: string;
  description?: string;

  environment: {
    deployEnv: DeployEnv;
  };

  url: {
    trailingSlash: 'strip' | 'append';
    trackingParams: string[];
  };

  brand?: {
    companyName?: string;
    logoUrl?: string;
    socialProfiles?: string[];
  };

  softwareApp?: {
    category?: string;
    operatingSystem?: string;
    priceRange?: string;
  };

  routes: {
    publicMarketing: string[];
    publicUtility: string[];
    privatePages: string[];
    privateApis: string[];
    dynamicPublic?: string[];
  };
};

/**
 * Starter defaults list only routes that exist in this repository.
 * Child projects replace this object with their real routes and identity.
 */
export const defaultSeoConfig: SeoConfig = {
  siteUrl: '',
  environment: {
    deployEnv: 'development',
  },
  url: {
    trailingSlash: 'strip',
    trackingParams: ['utm_*', 'fbclid', 'gclid'],
  },
  routes: {
    publicMarketing: ['/'],
    publicUtility: [
      '/sign-in',
      '/sign-up',
    ],
    privatePages: [
      '/dashboard',
      '/onboarding',
    ],
    privateApis: [],
    dynamicPublic: [],
  },
};
