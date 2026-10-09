import { docPublicSlug, docsArticles } from '@/lib/stealth/articles';
import { findGuideCopy, guideCopySlugs } from '@/lib/stealth/markdown-copies';

/* The Markdown version of each Help Center and Citadel article (/docs-md/<slug>), of each guide
   (/docs-md/guide-<slug>), of the English FAQ (/docs-md/faq) and of the RDP VPS page
   (/docs-md/rdp-vps), for "Copy Markdown" and "View as Markdown" on those pages and for AI
   assistants. It is not a page: it is not in the sitemap, the page links to it only from the Open
   menu (rendered when opened), and X-Robots-Tag keeps search engines from indexing it. English only,
   like the articles. It sits outside the [locale] segment; the proxy passes /docs-md/ through without
   a language prefix. */

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...docsArticles.map(article => ({ slug: docPublicSlug(article) })),
    ...guideCopySlugs().map(slug => ({ slug })),
  ];
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = docsArticles.find(item => docPublicSlug(item) === slug);
  const markdown = article
    ? `# ${article.title}\n\n${article.summary}\n\n${article.content.trim()}\n`
    : findGuideCopy(slug);
  if (markdown === undefined) {
    return new Response('Not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex' },
    });
  }

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'X-Robots-Tag': 'noindex',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
