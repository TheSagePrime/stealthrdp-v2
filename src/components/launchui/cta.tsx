/* Vendored/adapted from Launch UI (MIT): components/sections/cta/default.tsx */
import type { ReactNode } from 'react';
import { Section } from './section';
import { LinkButton, type LinkButtonProps } from './link-button';

interface CTAButtonProps extends Omit<LinkButtonProps, 'children'> {
  text: string;
}

export default function CTA({
  title,
  description,
  buttons,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  buttons: CTAButtonProps[];
  className?: string;
}) {
  return (
    <Section className={className}>
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-xl border border-border bg-card px-6 py-12 text-center sm:px-12 sm:py-16">
        <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">{title}</h2>
        {description && <p className="max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>}
        <div className="flex flex-wrap justify-center gap-3">
          {buttons.map(button => (
            <LinkButton
              key={`${button.href}-${button.text}`}
              href={button.href}
              variant={button.variant || 'default'}
              size={button.size || 'lg'}
              icon={button.icon}
              iconRight={button.iconRight}
            >
              {button.text}
            </LinkButton>
          ))}
        </div>
      </div>
    </Section>
  );
}
