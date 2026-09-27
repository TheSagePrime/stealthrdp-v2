'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

export type ResourceSearchItem = {
  title: string;
  href: string;
  description: string;
  searchText?: string;
  kind: 'Guide' | 'Help' | 'Citadel' | 'Question';
};

export function ResourceSearch({
  items,
  placeholder = 'Search guides, help articles, and common questions…',
}: {
  items: ResourceSearchItem[];
  placeholder?: string;
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const needle = query.trim().toLowerCase();

  const matches = useMemo(() => {
    if (needle.length < 2) return [];
    return items
      .filter(item =>
        item.title.toLowerCase().includes(needle)
        || item.description.toLowerCase().includes(needle)
        || item.searchText?.toLowerCase().includes(needle)
        || item.kind.toLowerCase().includes(needle))
      .slice(0, 8);
  }, [items, needle]);

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
    <div className="srv-resource-search">
      <label htmlFor="resource-search" className="sr-visually-hidden">Search resources</label>
      <div className="srv-resource-search-field">
        <Search aria-hidden="true" className="srv-resource-search-icon" />
        <input
          ref={inputRef}
          id="resource-search"
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />
        <kbd aria-hidden="true">/</kbd>
      </div>

      {needle.length >= 2 && (
        <div className="srv-resource-search-results" aria-live="polite">
          {matches.length > 0 ? (
            <ul>
              {matches.map(item => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.description}</small>
                    </span>
                    <em>{item.kind}</em>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No matching resources. Try a broader phrase.</p>
          )}
        </div>
      )}
    </div>
  );
}
