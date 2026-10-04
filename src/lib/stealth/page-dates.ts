import pageDatesJson from '../../content/page-dates.json';

/* The last meaningful content change of each public page, keyed by path.
   scripts/page-dates.mjs writes src/content/page-dates.json when the words on a page change, never
   on formatting or class-name edits, so the sitemap lastmod, dateModified and the visible
   "Updated" line stay trustworthy. Never type a date into the JSON. Relative imports only: the SEO
   scripts load this module outside Next.js. */

const pageDates: Record<string, { updated: string; fingerprint: string }> = pageDatesJson;

export function pageUpdated(publicPath: string): string | undefined {
  return pageDates[publicPath]?.updated;
}

export function formatUpdated(isoDate: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`));
}
