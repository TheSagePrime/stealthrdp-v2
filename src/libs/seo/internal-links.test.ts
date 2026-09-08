import { describe, expect, it } from 'vitest';
import { findLegacyInternalLinks, findNonCanonicalInternalLinks, validateInternalLinks } from './internal-links';

const redirects = [
  { from: '/old-page', to: '/new-page' },
  { from: '/legacy.html', to: '/legacy' },
];

describe('internal link validation', () => {
  it('finds configured legacy internal paths only', () => {
    expect(
      findLegacyInternalLinks(
        ['/old-page', 'https://example.test/legacy.html', 'https://external.test/old-page'],
        redirects,
        'https://example.test',
      ),
    ).toEqual([
      { href: '/old-page', from: '/old-page', to: '/new-page' },
      { href: 'https://example.test/legacy.html', from: '/legacy.html', to: '/legacy' },
    ]);
  });

  it('finds non-canonical same-origin paths and tracking parameters', () => {
    const issues = findNonCanonicalInternalLinks(
      ['/Plans?utm_source=mail#comparison', '/plans?ref=partner', '#source-1', 'https://external.test/Plans/'],
      'https://example.test',
    );

    expect(issues).toEqual([
      { href: '/Plans?utm_source=mail#comparison', canonical: 'https://example.test/plans#comparison' },
    ]);
  });

  it('validates rendered HTML against the migration map', () => {
    const html = '<a href="/old-page">Old</a><a href="/new-page">New</a>';

    expect(validateInternalLinks(html, redirects, 'https://example.test')).toEqual([
      { href: '/old-page', from: '/old-page', to: '/new-page' },
    ]);
  });
});
