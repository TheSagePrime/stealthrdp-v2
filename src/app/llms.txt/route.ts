import fs from 'node:fs';
import path from 'node:path';
import { isProductionDeployEnv, resolveDeployEnv } from '@/libs/seo/env';

export const dynamic = 'force-static';

/* llms.txt (https://llmstxt.org): the curated map of the site for AI assistants, kept in
   src/content/llms.md. Production only: the preview must not publish a second copy. The proxy
   also serves it for "/" when a client asks for text/markdown. */
export function GET() {
  if (!isProductionDeployEnv(resolveDeployEnv())) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(fs.readFileSync(path.join(process.cwd(), 'src/content/llms.md'), 'utf8'), {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}
