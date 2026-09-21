'use client';

import { useId, useState } from 'react';
import { cn } from '@/utils/Helpers';

/**
 * Tooltip on hover and focus. The trigger owns aria-describedby, so screen
 * readers get the same text as sighted users.
 */
function Tooltip({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span
      data-slot="tooltip"
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span aria-describedby={open ? id : undefined} className="inline-flex">
        {children}
      </span>
      {open ? (
        <span
          role="tooltip"
          id={id}
          className="
            absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-64
            -translate-x-1/2 rounded-sm border border-border-control
            bg-surface-2 px-2.5 py-1.5 text-micro text-body-text
          "
        >
          {label}
        </span>
      ) : null}
    </span>
  );
}

export { Tooltip };
