import { resourceEntries } from '@/lib/stealth/resource-index';

export const dynamic = 'force-static';

/* Full-text index for the resource search. The browser loads it on first use of the search box. */
export function GET() {
  const entries = resourceEntries().map(({ indexable: _indexable, ...entry }) => entry);
  return Response.json(entries, {
    headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' },
  });
}
