import type { Metadata } from 'next';
import { MessageCircleQuestion } from 'lucide-react';
import { createPageMetadata } from '@/libs/seo/metadata';
import { faqs } from '@/lib/stealth/content';

export const metadata: Metadata = createPageMetadata({
  path: '/faq',
  title: 'FAQ — StealthRDP',
  description: 'Frequently asked questions about StealthRDP VPS hosting: setup, operating systems, upgrades, refunds, and more.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default function FaqPage() {
  const categories = Array.from(new Set(faqs.map(item => item.category)));

  return (
    <>
      <section className="sr-page-hero">
        <div className="sr-container sr-page-hero-inner">
          <div>
            <p className="sr-kicker">FAQ</p>
            <h1 className="sr-title">Questions before you <span>deploy.</span></h1>
            <p className="sr-lede">
              Current public StealthRDP FAQ content, organized by topic without removing
              any of the migrated answers.
            </p>
          </div>
          <div className="sr-page-hero-aside">
            <MessageCircleQuestion />
            <strong>{faqs.length} published answers</strong>
            <span>{categories.length} topic groups</span>
          </div>
        </div>
      </section>

      <section className="sr-section">
        <div className="sr-container sr-faq-layout">
          <aside className="sr-faq-nav" aria-label="FAQ categories">
            <span className="sr-control-label">Browse topics</span>
            {categories.map(category => (
              <a key={category} href={`#${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                {category}
              </a>
            ))}
          </aside>

          <div className="sr-faq-groups">
            {categories.map((category) => {
              const items = faqs.filter(item => item.category === category);
              const id = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

              return (
                <section className="sr-faq-group" id={id} key={category}>
                  <div className="sr-collection-head">
                    <div>
                      <p className="sr-kicker">{category}</p>
                      <h2>{category}</h2>
                    </div>
                    <span>{items.length} answers</span>
                  </div>

                  <div className="sr-faq-list">
                    {items.map(item => (
                      <details key={item._id}>
                        <summary>
                          <span>{item.question}</span>
                          <span className="sr-faq-plus" aria-hidden="true">+</span>
                        </summary>
                        <p>{item.answer}</p>
                      </details>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
