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
        <Link href="/docs" className="srv-help-brand" aria-label="StealthRDP Help Center">
          <img
            src="https://cdn.stealthrdp.com/images/new/6.png"
            alt="StealthRDP"
            width="700"
            height="170"
          />
          <span>Help Center</span>
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
