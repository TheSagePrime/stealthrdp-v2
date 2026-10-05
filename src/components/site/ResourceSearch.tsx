/* eslint-disable better-tailwindcss/no-unknown-classes */
'use client';

import type { ResourcesCopy } from '@/content/i18n/resources';
import type { ResourceEntry } from '@/lib/stealth/resource-index';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

type Entry = Omit<ResourceEntry, 'indexable'>;

/** Every word must appear somewhere; title hits rank above description and body hits. */
function rank(entries: Entry[], query: string) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(term => term.length >= 2);
  if (terms.length === 0) {
    return [];
  }

  return entries
    .map((entry) => {
      const title = entry.title.toLowerCase();
      const description = entry.description.toLowerCase();
      const text = entry.text.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (title.includes(term)) {
          score += 10;
        } else if (description.includes(term)) {
          score += 4;
        } else if (text.includes(term) || entry.kind.toLowerCase() === term) {
          score += 1;
        } else {
          return null;
        }
      }
      return { entry, score, snippet: snippet(entry, terms) };
    })
    .filter(match => match !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

/** The description, or the body text around the first matching word when the description has none. */
function snippet(entry: Entry, terms: string[]): string {
  const description = entry.description.toLowerCase();
  if (terms.some(term => description.includes(term)) || !entry.text) {
    return entry.description;
  }
  const at = Math.min(...terms.map(term => entry.text.toLowerCase().indexOf(term)).filter(index => index >= 0));
  if (!Number.isFinite(at)) {
    return entry.description;
  }
  const start = Math.max(0, at - 60);
  const excerpt = entry.text.slice(start, start + 170).replace(/#+ /g, '').replace(/\s+/g, ' ').trim();
  return `${start > 0 ? '…' : ''}${excerpt}…`;
}

export function ResourceSearch({ words }: { words: ResourcesCopy['search'] }) {
  const [query, setQuery] = useState('');
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const requested = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const matches = useMemo(() => (entries ? rank(entries, query) : []), [entries, query]);
  const active = query.trim().length >= 2;

  /* The index holds the full text of every resource page, so it loads on first use only. */
  const loadIndex = () => {
    if (requested.current) {
      return;
    }
    requested.current = true;
    setFailed(false);
    fetch('/search-index.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`search index responded ${response.status}`);
        }
        return response.json() as Promise<Entry[]>;
      })
      .then(setEntries)
      .catch(() => {
        requested.current = false;
        setFailed(true);
      });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === 'INPUT'
        || target?.tagName === 'TEXTAREA'
        || target?.isContentEditable;

      if (event.key === '/' && !isTyping) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === 'Escape' && document.activeElement === inputRef.current) {
        setQuery('');
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="sr-res-search">
      <label htmlFor="resource-search" className="sr-visually-hidden">{words.label}</label>
      <div className="sr-res-search-field">
        <Search aria-hidden="true" className="sr-res-search-icon" />
        <input
          ref={inputRef}
          id="resource-search"
          type="search"
          value={query}
          onFocus={loadIndex}
          onChange={(event) => {
            loadIndex();
            setQuery(event.target.value);
          }}
          placeholder={words.placeholder}
          autoComplete="off"
        />
        <kbd aria-hidden="true">/</kbd>
      </div>

      {active && (
        <div className="sr-res-search-results" aria-live="polite">
          {failed && <p>{words.unavailable}</p>}
          {!failed && !entries && <p>{words.loading}</p>}
          {entries && matches.length === 0 && <p>{words.empty}</p>}
          {matches.length > 0 && (
            <ul>
              {matches.map(({ entry, snippet: text }) => (
                <li key={entry.href}>
                  <Link href={entry.href}>
                    <span>
                      <strong>{entry.title}</strong>
                      <small>{text}</small>
                    </span>
                    <em>{entry.kind}</em>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
