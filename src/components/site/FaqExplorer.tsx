/* eslint-disable better-tailwindcss/no-unknown-classes */
'use client';

import type { Faq } from '@/lib/stealth/content';
import Link from 'next/link';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { faqCategoryId } from '@/lib/stealth/faq-topics';

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

export function FaqExplorer({ faqs }: { faqs: Faq[] }) {
  const categories = Array.from(new Set(faqs.map(item => item.category)));

  return (
    <div className="sr-faq-groups">
      {categories.map((category) => {
        const items = faqs.filter(item => item.category === category);
        const id = faqCategoryId(category);

        return (
          <section className="sr-faq-group" id={id} key={category} aria-labelledby={`${id}-title`}>
            <h2 id={`${id}-title`}>{category}</h2>
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
          <Button asChild>
            <a href="https://dash.stealthrdp.com/submitticket.php">Open a support ticket</a>
          </Button>
          <Button asChild variant="outline">
            <a href="https://wa.me/447441426993" target="_blank" rel="noopener noreferrer">WhatsApp support</a>
          </Button>
        </div>
      </aside>
    </div>
  );
}
