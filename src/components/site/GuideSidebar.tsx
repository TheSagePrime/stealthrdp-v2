import Link from 'next/link';
import { articlePath, blogArticles } from '@/lib/stealth/content';

export function GuideSidebar({ activeSlug }: { activeSlug?: string }) {
  const categories = Array.from(new Set(blogArticles.map(article => article.category)));

  return (
    <nav className="srv-help-tree" aria-label="Guides">
      <div className="srv-help-tree-home">
        <Link href="/blog" data-active={!activeSlug}>
          <strong>All guides</strong>
          <small>Use cases, security and server operations</small>
        </Link>
      </div>

      {categories.map(category => {
        const items = blogArticles.filter(article => article.category === category);
        return (
          <section key={category} className="srv-help-tree-group">
            <span className="srv-help-tree-heading">{category}</span>
            <ul>
              {items.map(article => (
                <li key={article.slug}>
                  <Link
                    href={articlePath(article)}
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
        <span className="srv-help-tree-heading">Need help?</span>
        <ul>
          <li><Link href="/docs">Help Center</Link></li>
          <li><Link href="/faq">Common questions</Link></li>
          <li><Link href="/status">Service status</Link></li>
          <li><a href="https://wa.me/447441426993">WhatsApp support ↗</a></li>
        </ul>
      </section>
    </nav>
  );
}
