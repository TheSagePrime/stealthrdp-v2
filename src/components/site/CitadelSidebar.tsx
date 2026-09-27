import Link from 'next/link';
import {
  articlesForCollection,
  citadelArticleHref,
  citadelCollections,
  helpCollectionId,
} from '@/lib/stealth/help-center';
import type { DocArticle } from '@/lib/stealth/content';

export function CitadelSidebar({
  articles,
  activeSlug,
}: {
  articles: DocArticle[];
  activeSlug?: string;
}) {
  return (
    <nav className="srv-help-tree" aria-label="Citadel Docs">
      <div className="srv-help-tree-home">
        <Link href="/citadel/docs" data-active={!activeSlug}>
          <strong>Citadel Docs</strong>
          <small>Layer 7 protection from setup to operations</small>
        </Link>
      </div>

      {citadelCollections.map(collection => {
        const items = articlesForCollection(collection, articles);
        if (items.length === 0) return null;

        return (
          <section key={collection.title} className="srv-help-tree-group">
            <a
              className="srv-help-tree-heading"
              href={activeSlug
                ? `/citadel/docs#${helpCollectionId(collection.title)}`
                : `#${helpCollectionId(collection.title)}`}
            >
              {collection.title.replace(/^Citadel:\s*/, '')}
            </a>
            <ul>
              {items.map(article => (
                <li key={article.slug}>
                  <Link
                    href={citadelArticleHref(article)}
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
        <span className="srv-help-tree-heading">Product</span>
        <ul>
          <li><Link href="/citadel">Citadel overview</Link></li>
          <li><Link href="/status">Service status</Link></li>
          <li><a href="https://wa.me/447441426993">WhatsApp support ↗</a></li>
          <li><a href="https://dash.stealthrdp.com/submitticket.php">Open a support ticket ↗</a></li>
        </ul>
      </section>
    </nav>
  );
}
