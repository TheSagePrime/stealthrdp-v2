/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { ReactNode } from 'react';

/* The frame of a resource index page (guides, questions, resources): a plain heading and the
   content in the same width as the guide articles. */
export function ResourcePage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="
      sr-container py-10
      lg:py-14
    "
    >
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <h1 className="
            text-3xl font-semibold tracking-tight text-balance
            sm:text-4xl
          "
          >
            {title}
          </h1>
          <p className="mt-4 text-lg text-fd-muted-foreground">{description}</p>
        </header>
        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
}
