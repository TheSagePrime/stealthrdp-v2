import type { SeoConfig } from '../../config/seo';
import { canonicalUrlForPath } from './normalize';
import { resolveSiteUrl } from './site-url';

function absoluteUrl(value: string, siteOrigin: string): string {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  const path = value.startsWith('/') ? value : `/${value}`;
  return `${siteOrigin}${path}`;
}

function buildOrganizationJsonLd(config: SeoConfig): Record<string, unknown> | null {
  const brand = config.brand;
  if (!brand?.companyName) {
    return null;
  }

  const site = resolveSiteUrl(process.env, config.environment.deployEnv);
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${site.origin}/#organization`,
    'name': brand.companyName,
    'url': site.origin,
  };

  if (brand.logoUrl) {
    jsonLd.logo = absoluteUrl(brand.logoUrl, site.origin);
  }
  if (brand.socialProfiles?.length) {
    jsonLd.sameAs = brand.socialProfiles;
  }

  return jsonLd;
}

function buildSoftwareApplicationJsonLd(config: SeoConfig): Record<string, unknown> | null {
  const app = config.softwareApp;
  if (!app?.category || !config.projectName) {
    return null;
  }

  const site = resolveSiteUrl(process.env, config.environment.deployEnv);
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': config.projectName,
    'applicationCategory': app.category,
    'url': site.origin,
  };

  if (app.operatingSystem) {
    jsonLd.operatingSystem = app.operatingSystem;
  }

  return jsonLd;
}

function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
  config: SeoConfig,
): Record<string, unknown> | null {
  if (items.length === 0) {
    return null;
  }

  const site = resolveSiteUrl(process.env, config.environment.deployEnv);

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': canonicalUrlForPath(item.path, site, config),
    })),
  };
}

export function buildPageJsonLd(config: SeoConfig): Record<string, unknown>[] {
  return [
    buildOrganizationJsonLd(config),
    buildSoftwareApplicationJsonLd(config),
    buildBreadcrumbJsonLd([{ name: 'Home', path: '/' }], config),
  ].filter((value): value is Record<string, unknown> => value !== null);
}
