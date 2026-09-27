'use client';

import { Accordion, AccordionItem } from '@/components/ui/accordion';
import type { Faq } from '@/lib/stealth/content';

const LICENSING_PHRASE = 'Windows licensing page in Docs';

function Answer({ text }: { text: string }) {
  const index = text.indexOf(LICENSING_PHRASE);
  if (index === -1) return <p>{text}</p>;

  return (
    <p>
      {text.slice(0, index)}
      <a href="/docs/windows-licensing">{LICENSING_PHRASE}</a>
      {text.slice(index + LICENSING_PHRASE.length)}
    </p>
  );
}

function faqCategoryId(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function FaqTree({ faqs }: { faqs: Faq[] }) {
  const categories = Array.from(new Set(faqs.map(item => item.category)));

  return (
    <nav className="srv-help-tree" aria-label="Common question topics">
      <div className="srv-help-tree-home">
        <a href="/faq" data-active="true">
          <strong>Common Questions</strong>
          <small>Quick answers before and after deployment</small>
        </a>
      </div>

      <section className="srv-help-tree-group">
        <span className="srv-help-tree-heading">Topics</span>
        <ul>
          {categories.map(category => (
            <li key={category}>
              <a href={`#${faqCategoryId(category)}`}>
                {category}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="srv-help-tree-group srv-help-tree-support">
        <span className="srv-help-tree-heading">Need more detail?</span>
        <ul>
          <li><a href="/docs">Help Center</a></li>
          <li><a href="/blog">Guides</a></li>
          <li><a href="https://dash.stealthrdp.com/submitticket.php">Open support ticket ↗</a></li>
        </ul>
      </section>
    </nav>
  );
}

export function FaqExplorer({ faqs }: { faqs: Faq[] }) {
  const categories = Array.from(new Set(faqs.map(item => item.category)));

  return (
    <>
      <div className="sr-container srv-docs-mobile-wrap">
        <details className="srv-docs-mobile-nav">
          <summary>Browse question topics</summary>
          <FaqTree faqs={faqs} />
        </details>
      </div>

      <div className="sr-container srv-docs-grid">
        <aside className="srv-docs-sidebar">
          <FaqTree faqs={faqs} />
        </aside>

        <main className="srv-docs-index">
          <header className="srv-docs-index-head">
            <div>
              <p className="sr-kicker">Common Questions</p>
              <h1>Quick answers, without the digging.</h1>
              <p>
                Plans, setup, billing, operating systems, security, refunds, and
                support — all searchable from the same resource bar above.
              </p>
            </div>

            <div className="srv-docs-start-links">
              <a href="/docs/how-do-i-log-into-windows">Connect to Windows</a>
              <a href="/docs/windows-licensing">Windows licensing</a>
              <a href="/plans">Compare plans</a>
              <a href="https://dash.stealthrdp.com/submitticket.php">Contact support ↗</a>
            </div>
          </header>

          <div className="srv-faq-doc-groups">
            {categories.map(category => {
              const items = faqs.filter(item => item.category === category);

              return (
                <section
                  className="srv-faq-doc-group"
                  id={faqCategoryId(category)}
                  key={category}
                  aria-label={category}
                >
                  <div className="srv-docs-collection-head">
                    <div>
                      <h2>{category}</h2>
                      <p>Common questions and direct answers for this topic.</p>
                    </div>
                    <span>{items.length}</span>
                  </div>

                  <Accordion>
                    {items.map(item => (
                      <div key={item._id} id={`faq-${item._id}`} className="srv-faq-anchor">
                        <AccordionItem title={item.question} titleHeadingLevel={3}>
                          <Answer text={item.answer} />
                        </AccordionItem>
                      </div>
                    ))}
                  </Accordion>
                </section>
              );
            })}
          </div>
        </main>

        <aside className="srv-docs-index-aside">
          <span className="srv-resource-nav-label">Still need help?</span>
          <p>Account, billing, and server-specific questions are handled through support.</p>
          <a href="https://dash.stealthrdp.com/submitticket.php">Open support ticket ↗</a>
          <a href="https://wa.me/447441426993">WhatsApp ↗</a>
          <span className="srv-docs-aside-divider" />
          <a href="/docs">Help Center</a>
          <a href="/status">Service status</a>
        </aside>
      </div>
    </>
  );
}
