/* eslint-disable better-tailwindcss/no-unknown-classes -- Existing site layout class. */
// Adapted from Shadcnblocks Contact 7 (free block), copyright Shadcnblocks.com.
// Source and end-product permission: THIRD_PARTY_NOTICES.md.
import type { ReactNode } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Contact7Props = {
  title: string;
  description: string;
  eyebrow: string;
  primary?: boolean;
  items: { title: string; description: string; label: string; href: string; icon: ReactNode }[];
};

export function Contact7({ title, description, eyebrow, primary = false, items }: Contact7Props) {
  const Heading = primary ? 'h1' : 'h2';
  return (
    <section
      className="
        py-12
        sm:py-16
      "
      aria-label={title}
    >
      <div className="sr-container">
        <div className="mb-8 max-w-2xl">
          <p className="mb-3 text-sm font-semibold text-primary">{eyebrow}</p>
          <Heading className="mb-4">{title}</Heading>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="
          grid gap-4
          sm:grid-cols-2
          lg:grid-cols-4
        "
        >
          {items.map(item => (
            <Card key={item.href} className="h-full gap-0 py-6 shadow-none">
              <CardContent className="flex h-full flex-col items-start gap-4">
                <div className="text-primary" aria-hidden="true">{item.icon}</div>
                <div>
                  <h3 className="mb-2 font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Button
                  asChild
                  variant="link"
                  className="
                    mt-auto h-auto min-h-11 max-w-full px-0 text-left text-sm
                    whitespace-normal
                  "
                >
                  <Link href={item.href} {...(item.href.startsWith('https://') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    {item.label}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
