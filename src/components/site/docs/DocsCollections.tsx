/* eslint-disable react-refresh/only-export-components */
import type { TOCItemType } from 'fumadocs-core/toc';
import type { HelpCollection } from '@/lib/stealth/help-center';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { articlesForCollection, helpCollectionId } from '@/lib/stealth/help-center';

/* The docs home pages: one section per curated collection, each article as a Fumadocs card. */

type Article = Parameters<typeof articlesForCollection>[1][number];

function nonEmpty(collections: HelpCollection[], articles: Article[]) {
  return collections
    .map(collection => ({ collection, articles: articlesForCollection(collection, articles) }))
    .filter(item => item.articles.length > 0);
}

const title = (collection: HelpCollection) => collection.title.replace(/^Citadel:\s*/, '');

export function collectionsToc(collections: HelpCollection[], articles: Article[]): TOCItemType[] {
  return nonEmpty(collections, articles).map(({ collection }) => ({
    title: title(collection),
    url: `#${helpCollectionId(collection.title)}`,
    depth: 2,
  }));
}

export function DocsCollections({
  collections,
  articles,
  href,
}: {
  collections: HelpCollection[];
  articles: Article[];
  href: (article: Article) => string;
}) {
  return nonEmpty(collections, articles).map(({ collection, articles: items }) => (
    <section key={collection.title} aria-labelledby={helpCollectionId(collection.title)}>
      <h2 id={helpCollectionId(collection.title)}>{title(collection)}</h2>
      <p>{collection.description}</p>
      <Cards>
        {items.map(article => (
          <Card key={article.slug} href={href(article)} title={article.title} description={article.summary} />
        ))}
      </Cards>
    </section>
  ));
}
