/* Vendored/adapted from Launch UI (MIT): components/sections/stats/default.tsx */
import { Section } from './section';

export interface StatItem {
  label?: string;
  value: string | number;
  suffix?: string;
  description?: string;
}

export default function Stats({ items, className }: { items: StatItem[]; className?: string }) {
  return (
    <Section className={className}>
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-12">
          {items.map(item => (
            <div key={`${item.value}-${item.description}`} className="flex flex-col items-center gap-2 text-center">
              {item.label && <div className="text-sm font-semibold text-muted-foreground">{item.label}</div>}
              <div className="flex items-baseline gap-1">
                <div className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{item.value}</div>
                {item.suffix && <div className="text-2xl font-semibold text-primary">{item.suffix}</div>}
              </div>
              {item.description && <div className="text-sm font-medium text-muted-foreground">{item.description}</div>}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
