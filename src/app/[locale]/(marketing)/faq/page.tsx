import type { Metadata } from 'next';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { faqs } from '@/lib/stealth/content';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/faq',
  title: 'FAQ — StealthRDP',
  description:
    'Frequently asked questions about StealthRDP VPS hosting: setup, operating systems, upgrades, refunds, and more.',
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
            <h1 className="sr-title">
              Answers before you <span>deploy.</span>
            </h1>
            <p className="sr-lede">
              Plans, setup, billing, security, and support — search or browse by
              topic below.
            </p>
          </div>

          <div className="sr-page-hero-aside">
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
              <a
                key={category}
                href={`#${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              >
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
                      <p className="sr-kicker">Support topic</p>
                      <h2>{category}</h2>
                    </div>
                    <div>
                      <Badge variant="outline">{items.length} answers</Badge>
                    </div>
                  </div>

                  <Accordion>
                    {items.map(item => (
                      <AccordionItem key={item._id} title={item.question}>
                        <p>{item.answer}</p>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sr-section">
        <div className="sr-container sr-support-cta">
          <h2>Still need a hand?</h2>
          <p>Take the question to support.</p>
          <p>
            Account, billing, and server-specific requests are handled in the
            client portal.
          </p>
          <a href="https://dash.stealthrdp.com/submitticket.php">
            Contact support
          </a>
        </div>
      </section>
    </>
  );
}
