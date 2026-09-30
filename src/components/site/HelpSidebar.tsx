/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { DocArticle } from '@/lib/stealth/articles';
import Link from 'next/link';
import {
  articlesForCollection,
  helpArticleHref,
  helpCollectionId,
  helpCollections,
} from '@/lib/stealth/help-center';

export function HelpSidebar({
  articles,
  activeSlug,
}: {
  articles: DocArticle[];
  activeSlug?: string;
}) {
  return (
    <nav className="srv-help-tree" aria-label="Help Center">
      <div className="srv-help-tree-home">
        <Link href="/docs" data-active={!activeSlug}>
          <strong>Help Center</strong>
          <small>VPS setup, troubleshooting and policies</small>
        </Link>
      </div>

      {helpCollections.map((collection) => {
        const items = articlesForCollection(collection, articles);
        if (items.length === 0) {
          return null;
        }

        return (
          <section key={collection.title} className="srv-help-tree-group">
            <a className="srv-help-tree-heading" href={activeSlug ? `/docs#${helpCollectionId(collection.title)}` : `#${helpCollectionId(collection.title)}`}>
              {collection.title}
            </a>
            <ul>
              {items.map(article => (
                <li key={article.slug}>
                  <Link
                    href={helpArticleHref(article)}
                    data-active={activeSlug === article.slug}
                    aria-current={activeSlug === article.slug ? 'page' : undefined}
                  >
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <section className="srv-help-tree-group srv-help-tree-support">
        <span className="srv-help-tree-heading">Support</span>
        <ul>
          <li><Link href="/faq">Common questions</Link></li>
          <li><Link href="/status">Service status</Link></li>
          <li><a href="https://wa.me/447441426993">WhatsApp support ↗</a></li>
          <li><a href="https://dash.stealthrdp.com/submitticket.php">Open a support ticket ↗</a></li>
        </ul>
      </section>
    </nav>
  );
}
