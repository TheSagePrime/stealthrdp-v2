import { expect, test } from '@playwright/test';

type ResponsiveIssue = {
  route: string;
  viewport: { width: number; height: number };
  kind: string;
  detail: string;
};

function pathnamesFromSitemap(xml: string): string[] {
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)]
    .map(match => {
      try {
        return new URL(match[1] ?? '').pathname || '/';
      } catch {
        return null;
      }
    })
    .filter((value): value is string => Boolean(value));

  return [...new Set(paths)].sort((a, b) => a.localeCompare(b));
}

test.describe('responsive public-site audit', () => {
  test('every sitemap route uses the correct responsive shell without horizontal overflow', async ({
    page,
    request,
  }, testInfo) => {
    test.setTimeout(8 * 60 * 1000);

    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.ok()).toBe(true);

    const routes = pathnamesFromSitemap(await sitemap.text());
    expect(routes.length).toBeGreaterThan(20);

    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();
    if (!viewport) return;

    const issues: ResponsiveIssue[] = [];

    for (const route of routes) {
      let response;
      try {
        response = await page.goto(route, { waitUntil: 'load', timeout: 20_000 });
      } catch (error) {
        issues.push({
          route,
          viewport,
          kind: 'navigation',
          detail: error instanceof Error ? error.message : String(error),
        });
        continue;
      }

      if (!response || response.status() >= 400) {
        issues.push({
          route,
          viewport,
          kind: 'http',
          detail: 'status=' + (response?.status() ?? 'no-response'),
        });
        continue;
      }

      await page.evaluate(async () => {
        if ('fonts' in document) {
          await document.fonts.ready;
        }
      });

      const result = await page.evaluate(({ width }) => {
        const visible = (element: Element | null) => {
          if (!(element instanceof HTMLElement)) return false;
          const style = getComputedStyle(element);
          if (style.display === 'none' || style.visibility === 'hidden') return false;
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        };

        const documentOverflow = Math.max(
          document.documentElement.scrollWidth,
          document.body?.scrollWidth ?? 0,
        ) - document.documentElement.clientWidth;

        const brokenImages = [...document.images]
          .filter(image => image.complete && image.naturalWidth === 0)
          .map(image => image.currentSrc || image.src)
          .slice(0, 12);

        const unsafeMedia = [
          ...document.querySelectorAll('img, video, canvas, table, pre, figure, svg'),
        ]
          .filter(element => {
            if (!visible(element)) return false;
            const rect = element.getBoundingClientRect();
            if (rect.left >= -1 && rect.right <= width + 1) return false;

            let ancestor = element.parentElement;
            while (ancestor) {
              const style = getComputedStyle(ancestor);
              if (
                ['auto', 'scroll', 'hidden', 'clip'].includes(style.overflowX)
                && ancestor.getBoundingClientRect().width <= width + 1
              ) {
                return false;
              }
              ancestor = ancestor.parentElement;
            }
            return true;
          })
          .slice(0, 12)
          .map(element => {
            const rect = element.getBoundingClientRect();
            return {
              tag: element.tagName.toLowerCase(),
              className: element.getAttribute('class') || '',
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
            };
          });

        const docsProduct = Boolean(document.querySelector('.srv-docs-product'));
        const docsMobile = visible(document.querySelector('.srv-docs-mobile-wrap'));
        const docsSidebar = visible(document.querySelector('.srv-docs-sidebar'));
        const docsToc = visible(document.querySelector('.srv-docs-toc'));
        const docsArticle = Boolean(document.querySelector('.srv-docs-article'));
        const resourceActions = visible(document.querySelector('.srv-help-topbar-actions'));

        const siteMobileNav = visible(document.querySelector('.srv3-mobile-nav'));
        const siteDesktopNav = visible(document.querySelector('.srv3-nav'));
        const siteHeaderActions = visible(document.querySelector('.srv3-header-actions'));

        return {
          documentOverflow,
          brokenImages,
          unsafeMedia,
          docsProduct,
          docsMobile,
          docsSidebar,
          docsToc,
          docsArticle,
          resourceActions,
          siteMobileNav,
          siteDesktopNav,
          siteHeaderActions,
        };
      }, { width: viewport.width });

      if (result.documentOverflow > 1) {
        issues.push({
          route,
          viewport,
          kind: 'horizontal-overflow',
          detail: result.documentOverflow + 'px beyond viewport',
        });
      }

      if (result.brokenImages.length) {
        issues.push({
          route,
          viewport,
          kind: 'broken-images',
          detail: result.brokenImages.join(', '),
        });
      }

      if (result.unsafeMedia.length) {
        issues.push({
          route,
          viewport,
          kind: 'media-overflow',
          detail: JSON.stringify(result.unsafeMedia),
        });
      }

      if (result.docsProduct) {
        const shouldUseMobileDocs = viewport.width <= 1040;
        if (result.docsMobile !== shouldUseMobileDocs) {
          issues.push({
            route,
            viewport,
            kind: 'docs-mobile-shell',
            detail: 'mobileNav=' + result.docsMobile + ', expected=' + shouldUseMobileDocs,
          });
        }
        if (result.docsSidebar === shouldUseMobileDocs) {
          issues.push({
            route,
            viewport,
            kind: 'docs-sidebar-shell',
            detail: 'desktopSidebar=' + result.docsSidebar + ', expected=' + !shouldUseMobileDocs,
          });
        }

        const shouldShowToc = result.docsArticle && viewport.width > 1080;
        if (result.docsToc !== shouldShowToc) {
          issues.push({
            route,
            viewport,
            kind: 'docs-toc-shell',
            detail: 'toc=' + result.docsToc + ', expected=' + shouldShowToc,
          });
        }

        const shouldShowResourceActions = viewport.width > 1040;
        if (result.resourceActions !== shouldShowResourceActions) {
          issues.push({
            route,
            viewport,
            kind: 'resource-actions-shell',
            detail: 'actions=' + result.resourceActions + ', expected=' + shouldShowResourceActions,
          });
        }
      } else {
        const shouldUseMobileHeader = viewport.width <= 1040;
        if (result.siteMobileNav !== shouldUseMobileHeader) {
          issues.push({
            route,
            viewport,
            kind: 'site-mobile-header',
            detail: 'mobileNav=' + result.siteMobileNav + ', expected=' + shouldUseMobileHeader,
          });
        }
        if (result.siteDesktopNav === shouldUseMobileHeader) {
          issues.push({
            route,
            viewport,
            kind: 'site-desktop-header',
            detail: 'desktopNav=' + result.siteDesktopNav + ', expected=' + !shouldUseMobileHeader,
          });
        }
        if (result.siteHeaderActions === shouldUseMobileHeader) {
          issues.push({
            route,
            viewport,
            kind: 'site-header-actions',
            detail: 'actions=' + result.siteHeaderActions + ', expected=' + !shouldUseMobileHeader,
          });
        }
      }
    }

    await testInfo.attach('responsive-audit.json', {
      body: Buffer.from(JSON.stringify({ viewport, routeCount: routes.length, issues }, null, 2)),
      contentType: 'application/json',
    });

    expect(
      issues,
      issues.length
        ? 'Responsive audit failures:\\n' + issues.map(issue => (
            issue.route + ' [' + issue.kind + '] ' + issue.detail
          )).join('\\n')
        : 'Responsive audit passed',
    ).toEqual([]);
  });
});
