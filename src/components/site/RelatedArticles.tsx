/* eslint-disable better-tailwindcss/no-unknown-classes */
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
    <section className="sr-res-related not-prose" aria-labelledby={id}>
      <h2 id={id}>{heading}</h2>
      <ul>
        {items.map(item => (
          <li key={item.href}>
            <Link href={item.href}>
              <span>
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </span>
              <ArrowRight aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
