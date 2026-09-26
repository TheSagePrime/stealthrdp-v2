/* Vendored/adapted from Launch UI (MIT): components/sections/hero/default.tsx */
import type { ReactNode } from 'react';
import { Section } from './section';
import { LinkButton, type LinkButtonProps } from './link-button';

interface HeroButtonProps extends Omit<LinkButtonProps, 'children'> {
  text: string;
}

interface HeroProps {
  title: ReactNode;
  description: ReactNode;
  badge?: ReactNode | false;
  buttons?: HeroButtonProps[] | false;
  meta?: ReactNode;
  className?: string;
}

export default function Hero({
  title,
  description,
  badge = false,
  buttons = false,
  meta,
  className,
}: HeroProps) {
  return (
    <Section className={className}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 pt-8 text-center sm:pt-12">
        {badge !== false && badge}
        <div className="flex max-w-5xl flex-col items-center gap-6">
          <h1 className="text-5xl font-semibold leading-none tracking-tight text-balance sm:text-7xl lg:text-7xl">
            {title}
          </h1>
          <p className="max-w-3xl text-base font-medium leading-7 text-muted-foreground text-balance sm:text-xl sm:leading-8">
            {description}
          </p>
        </div>
        {buttons !== false && buttons.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {buttons.map(button => (
              <LinkButton
                key={`${button.href}-${button.text}`}
                variant={button.variant || 'default'}
                size={button.size || 'lg'}
                href={button.href}
                icon={button.icon}
                iconRight={button.iconRight}
              >
                {button.text}
              </LinkButton>
            ))}
          </div>
        )}
        {meta && <div className="text-sm text-muted-foreground">{meta}</div>}
      </div>
    </Section>
  );
}
