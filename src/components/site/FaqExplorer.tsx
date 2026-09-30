/* eslint-disable better-tailwindcss/no-unknown-classes */
'use client';

import type { Faq } from '@/lib/stealth/content';
import Link from 'next/link';
import { Accordion, AccordionItem } from '@/components/ui/accordion';

const LICENSING_PHRASE = 'Windows licensing page in Docs';

function Answer({ text }: { text: string }) {
  const index = text.indexOf(LICENSING_PHRASE);
  if (index === -1) {
    return <p>{text}</p>;
  }

  return (
    <p>
      {text.slice(0, index)}
      <Link href="/docs/windows-licensing">{LICENSING_PHRASE}</Link>
      {text.slice(index + LICENSING_PHRASE.length)}
    </p>
  );
}

function faqCategoryId(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export function FaqExplorer({ faqs }: { faqs: Faq[] }) {
  const categories = Array.from(new Set(faqs.map(item => item.category)));

  return (
    <>
      <section className="sr-page-hero">
        <div className="sr-container">
          <p className="sr-kicker">Common questions</p>
          <h1 className="sr-title">Quick answers, without the digging.</h1>
          <p className="sr-lede">
            Plans, setup, billing, operating systems, security, refunds, and support.
            Search from the resource bar above or browse by topic.
          </p>
        </div>
      </section>

      <section className="sr-section">
        <div className="sr-container sr-faq-layout">
          <nav className="sr-faq-topics" aria-label="Question topics">
            <span>Topics</span>
            <ul>
              {categories.map(category => (
                <li key={category}>
                  <a href={`#${faqCategoryId(category)}`}>{category}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sr-faq-groups">
            {categories.map((category) => {
              const items = faqs.filter(item => item.category === category);

              return (
                <section
                  className="sr-faq-group"
                  id={faqCategoryId(category)}
                  key={category}
                  aria-labelledby={`${faqCategoryId(category)}-title`}
                >
                  <h2 id={`${faqCategoryId(category)}-title`}>{category}</h2>
                  <Accordion>
                    {items.map(item => (
                      <div
                        key={item._id}
                        id={`faq-${item._id}`}
                        className="sr-faq-anchor"
                      >
                        <AccordionItem title={item.question} titleHeadingLevel={3}>
                          <Answer text={item.answer} />
                        </AccordionItem>
                      </div>
                    ))}
                  </Accordion>
                </section>
              );
            })}

            <aside className="sr-res-support">
              <div>
                <h2>Still need help?</h2>
                <p>Account, billing, and server-specific questions are handled through support.</p>
              </div>
              <div className="sr-res-support-actions">
                <a href="https://dash.stealthrdp.com/submitticket.php">Open a support ticket</a>
                <a href="https://wa.me/447441426993">WhatsApp support</a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
