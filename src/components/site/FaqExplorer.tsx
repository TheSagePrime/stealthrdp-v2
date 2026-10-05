/* eslint-disable better-tailwindcss/no-unknown-classes */
'use client';

import type { SiteLocale } from '@/config/i18n';
import type { FaqPageCopy } from '@/content/i18n/en/faq';
import type { Faq } from '@/lib/stealth/content';
import Link from 'next/link';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { faqCategoryId } from '@/lib/stealth/faq-topics';
import { localeHref } from '@/lib/stealth/i18n';

function Answer({ text, phrase, locale }: { text: string; phrase: string; locale: SiteLocale }) {
  const index = text.indexOf(phrase);
  if (index === -1) {
    return <p>{text}</p>;
  }

  return (
    <p>
      {text.slice(0, index)}
      <Link href={localeHref('/docs/windows-licensing', locale)}>{phrase}</Link>
      {text.slice(index + phrase.length)}
    </p>
  );
}

export function FaqExplorer({
  faqs,
  copy,
  locale = 'en',
}: {
  faqs: Faq[];
  copy: Pick<FaqPageCopy, 'licensingPhrase' | 'support'>;
  locale?: SiteLocale;
}) {
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
                    <Answer text={item.answer} phrase={copy.licensingPhrase} locale={locale} />
                  </AccordionItem>
                </div>
              ))}
            </Accordion>
          </section>
        );
      })}

      <aside className="sr-res-support">
        <div>
          <h2>{copy.support.title}</h2>
          <p>{copy.support.text}</p>
        </div>
        <div className="sr-res-support-actions">
          <Button asChild>
            <a href="https://dash.stealthrdp.com/submitticket.php">{copy.support.ticket}</a>
          </Button>
          <Button asChild variant="outline">
            <a href="https://wa.me/447441426993" target="_blank" rel="noopener noreferrer">{copy.support.whatsapp}</a>
          </Button>
        </div>
      </aside>
    </div>
  );
}
