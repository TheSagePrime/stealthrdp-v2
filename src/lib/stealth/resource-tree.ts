import { articlePath, blogArticles, docPublicSlug, helpDocsArticles } from '@/lib/stealth/content';

type Entry = { category: string; title: string; url: string };

function folder(name: string, entries: Entry[]) {
  const groups = new Map<string, Entry[]>();
  for (const entry of entries) {
    const group = groups.get(entry.category) ?? [];
    group.push(entry);
    groups.set(entry.category, group);
  }

  return {
    type: 'folder' as const,
    name,
    children: Array.from(groups, ([category, pages]) => ({
      type: 'folder' as const,
      name: category,
      children: pages.map(page => ({
        type: 'page' as const,
        name: page.title,
        url: page.url,
      })),
    })),
  };
}

const guides = blogArticles
  .filter(article => article.slug !== 'vps-hosting-minecraft')
  .map(article => ({
    category: article.category,
    title: article.title,
    url: articlePath(article),
  }));

const docs = helpDocsArticles.map(article => ({
  category: article.category,
  title: article.title,
  url: `/docs/${docPublicSlug(article)}`,
}));

export const resourcePageTree = {
  name: 'StealthRDP resources',
  children: [
    { type: 'page' as const, name: 'Documentation home', url: '/docs' },
    folder('Guides', guides),
    folder('Product documentation', docs),
  ],
};
