'use client';

import { useId, useRef, useState } from 'react';
import { cn } from '@/utils/Helpers';

export type TabItem = { id: string; label: string; content: React.ReactNode };

/**
 * Tabs on the ARIA tabs pattern: roving tab index, arrow keys, Home and End.
 * The stack is frozen, so this is a small local primitive rather than a new
 * dependency.
 */
function Tabs({ items, className }: { items: TabItem[]; className?: string }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = (index: number) => {
    const next = (index + items.length) % items.length;
    setActive(next);
    refs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusTab(active + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusTab(active - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusTab(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusTab(items.length - 1);
    }
  };

  return (
    <div data-slot="tabs" className={cn('grid gap-6', className)}>
      <div
        role="tablist"
        aria-label="Tabs"
        className="flex flex-wrap gap-1 border-b border-divider"
      >
        {items.map((item, index) => (
          <button
            key={item.id}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${item.id}`}
            aria-selected={index === active}
            aria-controls={`${baseId}-panel-${item.id}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={onKeyDown}
            className={cn(
              `
                -mb-px inline-flex min-h-11 cursor-pointer items-center
                border-b-2 border-transparent px-4 text-small font-medium
                text-body-muted transition-colors
                hover:text-body-text
              `,
              index === active && 'border-accent text-body-text',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {items.map((item, index) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-panel-${item.id}`}
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={index !== active}
          tabIndex={0}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

export { Tabs };
