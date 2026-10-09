/* eslint-disable better-tailwindcss/no-unknown-classes */
'use client';

import type { SiteLocale } from '@/config/i18n';
import type { FaqPageCopy } from '@/content/i18n/en/faq';
import type { Faq } from '@/lib/stealth/content';
import { CaretRight } from '@phosphor-icons/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { DocsSupport } from '@/components/site/docs/DocsParts';
import { faqCategoryId } from '@/lib/stealth/faq-topics';
import { localeHref } from '@/lib/stealth/i18n';

/* Common questions in the docs shell. The list looks like Fumadocs' accordion but is built on
   native <details>, so every answer stays in the HTML for search engines and find-in-page.
   A link to /faq#faq-<id> (search results use these) opens that answer. */

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

function useOpenFromHash() {
  useEffect(() => {
    const open = () => {
      const target = window.location.hash ? document.getElementById(window.location.hash.slice(1)) : null;
      if (target instanceof HTMLDetailsElement) {
        target.open = true;
        target.scrollIntoView({ block: 'start' });
      }
    };
    open();
    window.addEventListener('hashchange', open);
    return () => window.removeEventListener('hashchange', open);
  }, []);
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
  useOpenFromHash();
  const categories = Array.from(new Set(faqs.map(item => item.category)));

  return (
    <>
      {categories.map((category) => {
        const id = faqCategoryId(category);
        return (
          <section key={category} aria-labelledby={id}>
            <h2 id={id}>{category}</h2>
            <div className="
              not-prose divide-y divide-fd-border overflow-hidden rounded-lg
              border bg-fd-card
            "
            >
              {faqs.filter(item => item.category === category).map(item => (
                <details
                  key={item._id}
                  id={`faq-${item._id}`}
                  className="group scroll-mt-24"
                >
                  <summary className="
                    flex cursor-pointer list-none items-center gap-2 px-4 py-2.5
                    font-medium text-fd-card-foreground
                    hover:bg-fd-accent/40
                    [&::-webkit-details-marker]:hidden
                  "
                  >
                    <CaretRight
                      aria-hidden="true"
                      className="
                        size-4 shrink-0 text-fd-muted-foreground
                        transition-transform
                        group-open:rotate-90
                      "
                    />
                    <span role="heading" aria-level={3}>{item.question}</span>
                  </summary>
                  <div className="
                    px-4 ps-10 pb-3 text-[0.9375rem] text-fd-muted-foreground
                    [&_a]:text-fd-primary [&_a]:underline
                  "
                  >
                    <Answer text={item.answer} phrase={copy.licensingPhrase} locale={locale} />
                  </div>
                </details>
              ))}
            </div>
          </section>
        );
      })}

      <DocsSupport
        title={copy.support.title}
        text={copy.support.text}
        actions={[
          { href: 'https://dash.stealthrdp.com/submitticket.php', label: copy.support.ticket },
          { href: 'https://wa.me/447441426993', label: copy.support.whatsapp },
        ]}
      />
    </>
  );
}
