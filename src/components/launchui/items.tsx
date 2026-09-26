/* Vendored/adapted from Launch UI (MIT): components/sections/items/default.tsx */
import type { ReactNode } from 'react';
import { Item, ItemDescription, ItemIcon, ItemTitle } from './item';
import { Section } from './section';

export interface LaunchItem {
  title: string;
  description: string;
  icon: ReactNode;
}

export default function Items({
  title,
  description,
  items,
  className,
}: {
  title: string;
  description?: string;
  items: LaunchItem[];
  className?: string;
}) {
  return (
    <Section className={className}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 sm:gap-14">
        <div className="flex max-w-3xl flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">{title}</h2>
          {description && <p className="max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>}
        </div>
        <div className="grid w-full auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(item => (
            <Item key={item.title} className="rounded-xl border border-border bg-card p-6">
              <ItemTitle className="flex items-center gap-2">
                <ItemIcon>{item.icon}</ItemIcon>
                {item.title}
              </ItemTitle>
              <ItemDescription>{item.description}</ItemDescription>
            </Item>
          ))}
        </div>
      </div>
    </Section>
  );
}
