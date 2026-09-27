'use client';

import { useMemo, useRef, useState } from 'react';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ResourceNav } from '@/components/site/ResourceNav';
import type { Faq } from '@/lib/stealth/content';

const LICENSING_PHRASE = 'Windows licensing page in Docs';

/** Render answer text, linking the one Docs reference to its page. Copy itself is untouched. */
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

export function FaqExplorer({ faqs }: { faqs: Faq[] }) {
  const categories = useMemo(() => Array.from(new Set(faqs.map(item => item.category))), [faqs]);
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState<string>('all');
  const groupRefs = useRef<Record<string, HTMLElement | null>>({});

  const needle = query.trim().toLowerCase();
  const matches = (item: Faq) =>
    (topic === 'all' || item.category === topic) &&
    (needle === '' ||
      item.question.toLowerCase().includes(needle) ||
      item.answer.toLowerCase().includes(needle));

  const visibleGroups = categories
    .map(category => ({ category, items: faqs.filter(item => item.category === category && matches(item)) }))
    .filter(group => group.items.length > 0);
  const visibleCount = visibleGroups.reduce((sum, group) => sum + group.items.length, 0);

  const pickTopic = (category: string) => {
    setTopic(category);
    /* Move focus with the viewport so screen-reader users land in the new context. */
    requestAnimationFrame(() => {
      const target = category === 'all'
        ? document.getElementById('faq-results')
        : groupRefs.current[category];
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({ block: 'start' });
    });
  };

  return (
    <>
      <section className="sr-section">
        <div className="sr-container sr-faq-layout">
          <aside className="sr-faq-nav srv-help-sidebar" aria-label="FAQ categories">
            <ResourceNav active="faq" />
            <div className="srv-help-collections">
            <span className="srv-resource-nav-label">Browse topics</span>
            <label className="sr-visually-hidden" htmlFor="faq-search">Search questions</label>
            <input
              id="faq-search"
              type="search"
              placeholder="Search questions"
              value={query}
              onChange={event => setQuery(event.target.value)}
              className="sr-faq-search"
            />
            <button
              type="button"
              data-active={topic === 'all'}
              onClick={() => pickTopic('all')}
            >
              All topics
            </button>
            {categories.map(category => {
              const count = faqs.filter(item => item.category === category).length;
              return (
                <button
                  key={category}
                  type="button"
                  data-active={topic === category}
                  onClick={() => pickTopic(category)}
                  aria-pressed={topic === category}
                >
                  {category} ({count})
                </button>
              );
            })}
            </div>
          </aside>

          <div className="sr-faq-groups" id="faq-results" tabIndex={-1}>
            <p className="sr-visually-hidden" aria-live="polite">
              {visibleCount} of {faqs.length} answers shown
            </p>
            {visibleGroups.length === 0 ? (
              <div className="sr-prose-block">
                <p>
                  No answers match that search. Try fewer words, browse a topic,
                  or take the question straight to support below.
                </p>
              </div>
            ) : (
              visibleGroups.map(group => (
                <section
                  className="sr-faq-group"
                  id={group.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                  key={group.category}
                  ref={element => {
                    groupRefs.current[group.category] = element;
                  }}
                  tabIndex={-1}
                  aria-label={group.category}
                >
                  <div className="sr-collection-head">
                    <div>
                      <p className="sr-kicker">Support topic</p>
                      <h2>{group.category}</h2>
                    </div>
                    <div>
                      <Badge variant="outline">{group.items.length} answers</Badge>
                    </div>
                  </div>

                  <Accordion>
                    {group.items.map(item => (
                      <AccordionItem key={item._id} title={item.question} titleHeadingLevel={3}>
                        <Answer text={item.answer} />
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="sr-section srv-site-support">
        <div className="sr-container sr-copy-grid">
          <div>
            <p className="sr-kicker">Still need a hand?</p>
            <h2 className="sr-section-title">Take the question to support.</h2>
          </div>
          <div className="sr-prose-block">
            <p>
              Account, billing, and server-specific requests are handled in the
              client portal. For quick questions, message us on WhatsApp or email —
              support answers around the clock.
            </p>
            <div className="sr-inline-links">
              <a href="https://dash.stealthrdp.com/submitticket.php">Contact support</a>
              <a href="https://wa.me/447441426993">WhatsApp: +44 7441 426993</a>
              <a href="mailto:support@stealthrdp.com">support@stealthrdp.com</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
