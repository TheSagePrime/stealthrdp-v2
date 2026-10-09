import { Card, Cards } from 'fumadocs-ui/components/card';

export type RelatedArticle = { href: string; title: string; description: string };

export function RelatedArticles({
  heading,
  id,
  items,
}: {
  heading: string;
  id: string;
  items: RelatedArticle[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={id}>
      <h2 id={id}>{heading}</h2>
      <Cards>
        {items.map(item => (
          <Card key={item.href} href={item.href} title={item.title} description={item.description} />
        ))}
      </Cards>
    </section>
  );
}
