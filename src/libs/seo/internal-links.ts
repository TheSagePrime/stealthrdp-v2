import { normalizePathname, stripTrackingParams } from './normalize';

export type LegacyRedirect = {
  from: string;
  to: string;
};

export type LegacyInternalLinkIssue = {
  href: string;
  from: string;
  to: string;
};

export type NonCanonicalInternalLinkIssue = {
  href: string;
  canonical: string;
};

function internalPathForHref(href: string, siteOrigin: string): string | null {
  try {
    const url = new URL(href, siteOrigin);
    if (url.origin !== siteOrigin) {
      return null;
    }
    return url.pathname;
  } catch {
    return null;
  }
}

function hrefsFromHtml(html: string): string[] {
  return [...html.matchAll(/\bhref=["']([^"']+)["']/gi)].flatMap(match => (match[1] ? [match[1]] : []));
}

/**
 * Finds internal hrefs that still use a configured legacy redirect route.
 * Redirect maps stay project-owned because route migrations are project facts.
 */
export function findLegacyInternalLinks(
  hrefs: readonly string[],
  redirects: readonly LegacyRedirect[],
  siteOrigin: string,
  trailingSlash: 'strip' | 'append' = 'strip',
): LegacyInternalLinkIssue[] {
  const issues: LegacyInternalLinkIssue[] = [];
  const seen = new Set<string>();

  for (const href of hrefs) {
    const pathname = internalPathForHref(href, siteOrigin);
    if (!pathname) {
      continue;
    }

    const normalizedPath = normalizePathname(pathname, trailingSlash);
    for (const redirect of redirects) {
      const from = normalizePathname(redirect.from, trailingSlash);
      if (normalizedPath !== from) {
        continue;
      }

      const key = `${href}\u0000${from}`;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      issues.push({
        href,
        from,
        to: normalizePathname(redirect.to, trailingSlash),
      });
      break;
    }
  }

  return issues;
}

/**
 * Finds same-origin hrefs that do not use the configured canonical path form.
 * This check does not guess project redirects; use the project-owned redirect map for those.
 */
export function findNonCanonicalInternalLinks(
  hrefs: readonly string[],
  siteOrigin: string,
  trailingSlash: 'strip' | 'append' = 'strip',
  trackingParams: string[] = ['utm_*', 'fbclid', 'gclid'],
): NonCanonicalInternalLinkIssue[] {
  const issues: NonCanonicalInternalLinkIssue[] = [];
  const seen = new Set<string>();

  for (const href of hrefs) {
    let url: URL;
    try {
      url = new URL(href, siteOrigin);
    } catch {
      continue;
    }
    if (url.origin !== siteOrigin) {
      continue;
    }

    const pathname = normalizePathname(url.pathname, trailingSlash);
    const cleanedSearch = stripTrackingParams(url.searchParams, trackingParams).toString();
    const canonicalPath = `${pathname}${cleanedSearch ? `?${cleanedSearch}` : ''}${url.hash}`;
    const actualPath = `${url.pathname}${url.search}${url.hash}`;
    if (actualPath === canonicalPath) {
      continue;
    }

    const key = `${href}\u0000${canonicalPath}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    issues.push({ href, canonical: `${siteOrigin}${canonicalPath === '/' ? '' : canonicalPath}` });
  }

  return issues;
}

/**
 * Validates rendered HTML against the project's explicit legacy redirect map.
 */
export function validateInternalLinks(
  html: string,
  redirects: readonly LegacyRedirect[],
  siteOrigin: string,
  trailingSlash: 'strip' | 'append' = 'strip',
): LegacyInternalLinkIssue[] {
  return findLegacyInternalLinks(hrefsFromHtml(html), redirects, siteOrigin, trailingSlash);
}
