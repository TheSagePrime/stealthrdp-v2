import { describe, expect, it, vi } from 'vitest';
import { publishedHref, rewriteTranslatedLinks } from './translation-links';

/* German: one Help Center article and one blog post are published. Spanish: nothing yet. */
vi.mock('@/content/i18n/published-routes.json', () => ({
  default: {
    generatedAt: '2026-10-10',
    routes: {
      de: ['/blog', '/blog/vps-for-trading.html', '/docs', '/docs/windows-licensing', '/resources'],
      es: [],
    },
    sources: {
      '/de/blog/vps-for-trading.html': 'src/content/guides/de/vps-for-trading.md',
      '/de/docs/windows-licensing': 'src/content/docs/de/windows-licensing.md',
    },
  },
}));

describe('links in translated content', () => {
  it('keeps links to pages published in that language', () => {
    expect(publishedHref('/de/docs/windows-licensing')).toBe('/de/docs/windows-licensing');
    expect(publishedHref('/de/blog/vps-for-trading.html#sources')).toBe('/de/blog/vps-for-trading.html#sources');
    expect(publishedHref('/de/plans')).toBe('/de/plans');
    expect(publishedHref('/de')).toBe('/de');
  });

  it('sends links to unpublished translations to the English page, keeping anchor and query', () => {
    expect(publishedHref('/de/docs/how-do-i-log-into-windows')).toBe('/docs/how-do-i-log-into-windows');
    expect(publishedHref('/de/docs/how-do-i-log-into-windows#mac')).toBe('/docs/how-do-i-log-into-windows#mac');
    expect(publishedHref('/es/docs/windows-licensing?x=1')).toBe('/docs/windows-licensing?x=1');
    expect(publishedHref('/es/blog/vps-for-trading.html')).toBe('/blog/vps-for-trading.html');
    expect(publishedHref('/de/citadel/docs/getting-started')).toBe('/citadel/docs/getting-started');
    expect(publishedHref('/es/rdp-vps')).toBe('/rdp-vps');
  });

  it('leaves English, external and anchor links alone', () => {
    expect(publishedHref('/docs/use-of-service')).toBe('/docs/use-of-service');
    expect(publishedHref('https://example.com/de/docs/x')).toBe('https://example.com/de/docs/x');
    expect(publishedHref('#source-1')).toBe('#source-1');
    expect(publishedHref('/design/x')).toBe('/design/x');
  });

  it('rewrites Markdown links, images, references, autolinks and raw HTML, but not code', () => {
    const markdown = [
      'Lesen Sie [Verbinden](/de/docs/how-do-i-log-into-windows "Titel") und [Lizenzen](/de/docs/windows-licensing).',
      '<a class="x" href="/de/docs/server-stops-randomly">Server</a> und </de/docs/payment-terms>',
      '[ref]: /de/docs/how-to-rebuild-a-server',
      'Code: `[x](/de/docs/how-do-i-log-into-windows)`',
      '```md',
      '[x](/de/docs/how-do-i-log-into-windows)',
      '```',
      '[Quelle](https://example.com/de/docs/x) und [Englisch](/docs/use-of-service)',
    ].join('\n');

    expect(rewriteTranslatedLinks(markdown).split('\n')).toEqual([
      'Lesen Sie [Verbinden](/docs/how-do-i-log-into-windows "Titel") und [Lizenzen](/de/docs/windows-licensing).',
      '<a class="x" href="/docs/server-stops-randomly">Server</a> und </docs/payment-terms>',
      '[ref]: /docs/how-to-rebuild-a-server',
      'Code: `[x](/de/docs/how-do-i-log-into-windows)`',
      '```md',
      '[x](/de/docs/how-do-i-log-into-windows)',
      '```',
      '[Quelle](https://example.com/de/docs/x) und [Englisch](/docs/use-of-service)',
    ]);
  });
});
