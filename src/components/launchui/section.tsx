/* Vendored/adapted from Launch UI (MIT): components/ui/section.tsx */
import * as React from 'react';
import { cn } from '@/utils/Helpers';

function Section({ className, ...props }: React.ComponentProps<'section'>) {
  return (
    <section
      data-slot="launch-section"
      className={cn('px-4 py-16 sm:py-20 lg:py-24', className)}
      {...props}
    />
  );
}

export { Section };
