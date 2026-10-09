import { createSearchAPI } from 'fumadocs-core/search/server';
import { resourceEntries } from '@/lib/stealth/resource-index';

export const dynamic = 'force-static';

/* Search database for the Fumadocs search dialog (Ctrl/⌘ K) on every resource page: guides,
   Help Center, Citadel docs and FAQs. It is exported at build time; the browser loads it on the
   first search and searches locally. */
const search = createSearchAPI('simple', {
  indexes: () => resourceEntries().map(entry => ({
    title: entry.title,
    description: entry.description,
    content: entry.text || entry.description,
    url: entry.href,
    breadcrumbs: [entry.kind === 'Question' ? 'Common questions' : entry.kind === 'Help' ? 'Help Center' : entry.kind],
  })),
});

export async function GET() {
  const response = await search.staticGET();
  return Response.json(await response.json(), {
    headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' },
  });
}
