import Link from 'next/link';
import { ResourceSearch, type ResourceSearchItem } from '@/components/site/ResourceSearch';
import { docPublicSlug, docsArticles, faqs } from '@/lib/stealth/content';

export function HelpTopbar() {
  const items: ResourceSearchItem[] = [
    ...docsArticles.map(article => ({
      title: article.title,
      href: `/docs/${docPublicSlug(article)}`,
      description: article.summary,
      kind: 'Help' as const,
    })),
    ...faqs.map(item => ({
      title: item.question,
      href: '/faq',
      description: item.answer,
      kind: 'Question' as const,
    })),
  ];

  return (
    <div className="srv-help-topbar">
      <div className="sr-container srv-help-topbar-inner">
        <Link href="/docs" className="srv-help-brand">
          <span>Help Center</span>
          <small>StealthRDP</small>
        </Link>

        <ResourceSearch
          items={items}
          placeholder="Search Help Center…"
        />

        <div className="srv-help-topbar-actions">
          <Link href="/faq">Questions</Link>
          <a href="https://dash.stealthrdp.com/submitticket.php">Support ↗</a>
        </div>
      </div>
    </div>
  );
}
