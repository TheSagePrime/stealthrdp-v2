'use client';

import { useEffect, useRef } from 'react';
import { X } from '@phosphor-icons/react';
import { cn } from '@/utils/Helpers';

/**
 * Dialog on the native modal element: focus trapping, Escape and the top layer
 * come from the platform, so no new dependency is needed.
 */
function Dialog({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      data-slot="dialog"
      aria-label={title}
      onClose={onClose}
      className={cn(
        `
          m-auto w-[min(32rem,calc(100vw-3rem))] rounded-lg border
          border-divider bg-surface-2 p-6 text-body-text
          backdrop:bg-black/60
        `,
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-semibold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={title}
          className="
            -m-2 inline-flex size-11 cursor-pointer items-center justify-center
            rounded-sm text-body-muted transition-colors hover:text-body-text
          "
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-4 grid gap-3">{children}</div>
    </dialog>
  );
}

export { Dialog };
