import type { Metadata } from 'next';
import { createPageMetadata } from '@/libs/seo/metadata';
import { faqs } from '@/lib/stealth/content';

export const metadata: Metadata = createPageMetadata({
  path: '/faq',
  title: 'Frequently Asked Questions — StealthRDP',
  description: 'Answers about StealthRDP VPS plans, locations, billing, provisioning, support, refunds, access, backups, and Windows licensing.',
});

export default function FaqPage() {
  return (
    <>
      <section className="sr-page-hero"><div className="sr-container"><p className="sr-kicker">FAQ</p><h1 className="sr-title">Questions before you <span>deploy.</span></h1><p className="sr-lede">Current public StealthRDP FAQ content, carried into the V2 architecture.</p></div></section>
      <section className="sr-section"><div className="sr-container sr-faq-list">
        {faqs.map(item => <details key={item._id}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
      </div></section>
    </>
  );
}