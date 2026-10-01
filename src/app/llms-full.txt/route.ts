import { resourceEntries } from '@/lib/stealth/resource-index';
import { getSeoConfig } from '@/libs/seo/config';
import { isProductionDeployEnv, resolveDeployEnv } from '@/libs/seo/env';

export const dynamic = 'force-static';

/* The full text of every indexable guide, help article, Citadel doc and common question.
   Production only, like llms.txt. */
export function GET() {
  if (!isProductionDeployEnv(resolveDeployEnv())) {
    return new Response('Not found', { status: 404 });
  }

  const { siteUrl } = getSeoConfig();
  const body = resourceEntries()
    .filter(entry => entry.indexable)
    .map(entry => [
      `# ${entry.title}`,
      '',
      `URL: ${siteUrl}${entry.href}`,
      '',
      entry.kind === 'Question' ? entry.description : entry.text || entry.description,
    ].join('\n'))
    .join('\n\n---\n\n');

  return new Response(`${body}\n`, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
