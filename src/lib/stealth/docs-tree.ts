import type * as PageTree from 'fumadocs-core/page-tree';
import type { HelpCollection } from '@/lib/stealth/help-center';
import { citadelDocsArticles, helpDocsArticles } from '@/lib/stealth/articles';
import {
  articlesForCollection,
  citadelArticleHref,
  citadelCollections,
  helpArticleHref,
  helpCollections,
} from '@/lib/stealth/help-center';

/* The docs sidebar. Help Center and Citadel are root folders, so Fumadocs shows them as two
   tabs and each keeps its own sidebar. Groups follow the curated collections in help-center.ts. */

function section(
  collections: HelpCollection[],
  articles: typeof helpDocsArticles,
  href: (article: (typeof helpDocsArticles)[number]) => string,
): PageTree.Node[] {
  return collections.flatMap((collection) => {
    const pages = articlesForCollection(collection, articles);
    if (pages.length === 0) {
      return [];
    }
    return [
      { type: 'separator' as const, name: collection.title.replace(/^Citadel:\s*/, '') },
      ...pages.map(article => ({ type: 'page' as const, name: article.title, url: href(article) })),
    ];
  });
}

const helpCenterFolder: PageTree.Folder = {
  type: 'folder',
  name: 'Help Center',
  description: 'StealthRDP servers',
  root: true,
  children: [
    { type: 'page', name: 'Overview', url: '/docs' },
    ...section(helpCollections, helpDocsArticles, helpArticleHref),
  ],
};

const citadelFolder: PageTree.Folder = {
  type: 'folder',
  name: 'Citadel Docs',
  description: 'Layer 7 DDoS protection',
  root: true,
  children: [
    { type: 'page', name: 'Overview', url: '/citadel/docs' },
    ...section(citadelCollections, citadelDocsArticles, citadelArticleHref),
  ],
};

export const docsTree: PageTree.Root = {
  name: 'StealthRDP Docs',
  children: [helpCenterFolder, citadelFolder],
};
