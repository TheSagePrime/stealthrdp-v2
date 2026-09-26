/* Vendored/adapted from Launch UI (MIT): components/ui/pricing-column.tsx */
import type { ReactNode } from 'react';
import { CheckCircle } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/Helpers';

export interface PricingColumnProps {
  name: string;
  description: string;
  price: ReactNode;
  priceNote: string;
  cta: { label: string; href?: string; disabled?: boolean };
  features: string[];
  badge?: ReactNode;
  footer?: ReactNode;
  featured?: boolean;
  className?: string;
}

export function PricingColumn({
  name,
  description,
  price,
  priceNote,
  cta,
  features,
  badge,
  footer,
  featured = false,
  className,
}: PricingColumnProps) {
  return (
    <div
      className={cn(
        'relative flex h-full flex-col gap-6 rounded-xl border bg-card p-7 shadow-sm',
        featured ? 'border-primary ring-1 ring-primary/20' : 'border-border',
        className,
      )}
    >
      <header className="flex min-h-20 flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">{name}</h3>
          {badge}
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </header>

      <div className="flex flex-col gap-2">
        <div className="text-4xl font-semibold tracking-tight">{price}</div>
        <p className="min-h-5 text-sm text-muted-foreground">{priceNote}</p>
      </div>

      {cta.href && !cta.disabled ? (
        <Button asChild size="lg" className="w-full">
          <a href={cta.href}>{cta.label}</a>
        </Button>
      ) : (
        <Button size="lg" variant="outline" className="w-full" disabled>
          {cta.label}
        </Button>
      )}

      <div className="border-t border-border pt-5">
        <ul className="flex flex-col gap-3">
          {features.map(feature => (
            <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
              <CheckCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" weight="bold" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {footer && <div className="mt-auto pt-1 text-sm text-muted-foreground">{footer}</div>}
    </div>
  );
}
