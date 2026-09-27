'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

export type ResourceSearchItem = {
  title: string;
  href: string;
  description: string;
  kind: 'Guide' | 'Help' | 'Question';
};

export function ResourceSearch({
  items,
  placeholder = 'Search guides, help articles, and common questions…',
}: {
  items: ResourceSearchItem[];
  placeholder?: string;
}) {
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();

  const matches = useMemo(() => {
    if (needle.length < 2) return [];
    return items
      .filter(item =>
        item.title.toLowerCase().includes(needle)
        || item.description.toLowerCase().includes(needle)
        || item.kind.toLowerCase().includes(needle))
      .slice(0, 8);
  }, [items, needle]);

  return (
    <div className="srv-resource-search">
      <label htmlFor="resource-search" className="sr-visually-hidden">Search resources</label>
      <div className="srv-resource-search-field">
        <span aria-hidden="true">⌕</span>
        <input
          id="resource-search"
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />
        <kbd>Search</kbd>
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
