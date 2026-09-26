/* Vendored/adapted from Launch UI (MIT): components/ui/item.tsx */
import * as React from 'react';
import { cn } from '@/utils/Helpers';

function Item({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="launch-item"
      className={cn('flex flex-col gap-4 p-4 text-foreground', className)}
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: React.ComponentProps<'h3'>) {
  return (
    <h3
      data-slot="launch-item-title"
      className={cn('text-sm font-semibold leading-none tracking-tight sm:text-base', className)}
      {...props}
    />
  );
}

function ItemDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="launch-item-description"
      className={cn('flex max-w-60 flex-col gap-2 text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

function ItemIcon({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="launch-item-icon"
      className={cn('flex items-center self-start text-primary', className)}
      {...props}
    />
  );
}

export { Item, ItemDescription, ItemIcon, ItemTitle };
