/* eslint-disable better-tailwindcss/no-unknown-classes */
'use client';

import type { SiteLocale } from '@/config/i18n';
import type { BillingCycle, Plan } from '@/lib/stealth/content';
import Link from 'next/link';
/* Homepage pricing configurator: interaction/state here, visual language in stealth-v3.css. */
import { useMemo, useState } from 'react';
import { PricingColumn } from '@/components/launchui/pricing-column';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { homeCopy } from '@/content/i18n/home';
import { pricingCopy } from '@/content/i18n/pricing';
import { checkoutUrl } from '@/lib/stealth/checkout';
import { localeHref } from '@/lib/stealth/i18n';

const cycles: BillingCycle[] = ['monthly', 'quarterly', 'semiannual', 'annual', 'biannual'];

const months: Record<BillingCycle, number> = {
  monthly: 1,
  quarterly: 3,
  semiannual: 6,
  annual: 12,
  biannual: 24,
};

const format = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(2);

export function HomePricing({ plans, locale = 'en' }: { plans: Plan[]; locale?: SiteLocale }) {
  const p = pricingCopy[locale];
  const t = homeCopy[locale].pricing;
  /* English keeps its split "€" and amount; other languages write 9,50 €. */
  const amount = (value: number) => locale === 'en'
    ? (
        <>
          €
          {format(value)}
        </>
      )
    : p.money(value);
  const [region, setRegion] = useState<'USA' | 'EU'>('USA');
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const visible = useMemo(() => (
    plans
      .filter(plan => plan.location === region)
      .sort((a, b) => a.pricing.monthly.amount - b.pricing.monthly.amount)
      .slice(0, 4)
  ), [plans, region]);

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="srv-pricing-controls">
        <div className="srv-pricing-control-card srv-pricing-region">
          <div className="srv-selector" role="group" aria-label={p.regionGroup}>
            {(['USA', 'EU'] as const).map(item => (
              <button
                key={item}
                type="button"
                className="srv-selector-option"
                data-selected={region === item}
                aria-pressed={region === item}
                onClick={() => setRegion(item)}
              >
                <span className="srv-selector-dot" aria-hidden="true" />
                {p.regionNames[item]}
              </button>
            ))}
          </div>
        </div>

        <div className="srv-pricing-control-card srv-pricing-billing">
          <div className="srv-billing-rail" role="group" aria-label={p.billingGroup}>
            {cycles.map(item => (
              <button
                key={item}
                type="button"
                className="srv-billing-option"
                data-selected={cycle === item}
                aria-pressed={cycle === item}
                onClick={() => setCycle(item)}
              >
                <span className="srv-billing-full">{p.cycleLabels[item].full}</span>
                <span className="srv-billing-short" aria-hidden="true">{p.cycleLabels[item].short}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="
        srv-home-pricing-grid grid grid-cols-1 gap-4
        md:grid-cols-2
        xl:grid-cols-4
      "
      >
        {visible.map((plan) => {
          /* The data can flag several plans; the badge goes to the first in view. */
          const price = plan.pricing[cycle];
          const monthEquivalent = price.amount / months[cycle];
          const osLabel = plan.source.os === 'linux-only' ? t.linuxOnly : t.both;
          const featured = plan.name === visible.find(item => item.popular)?.name;
          const available = plan.source.availability !== 'out-of-stock';

          return (
            <div key={plan.name} className="srv-home-pricing-item">
              <PricingColumn
                className="srv-home-pricing-card srv-home-pricing-card-desktop"
                name={plan.name}
                description={osLabel}
                featured={featured}
                badge={featured ? <Badge variant="outline">{t.mostPopular}</Badge> : null}
                price={(
                  <span>
                    {amount(price.amount)}
                    <span className="
                      ml-1 text-base font-medium text-muted-foreground
                    "
                    >
                      {p.suffix(cycle, price.suffix)}
                    </span>
                  </span>
                )}
                priceNote={cycle === 'monthly'
                  ? t.billedMonthly
                  : t.effective(monthEquivalent)}
                cta={{
                  label: available ? t.orderNow : t.outOfStock,
                  href: available ? checkoutUrl(plan, cycle, locale) : undefined,
                  disabled: !available,
                }}
                features={[
                  p.spec(plan.specs.cpu),
                  plan.specs.ram,
                  plan.specs.storage,
                  t.bandwidth(p.spec(plan.specs.bandwidth)),
                  t.ipv4,
                ]}
                footer={(
                  <span className={available
                    ? 'font-medium text-status-ok'
                    : `font-medium text-muted-foreground`}
                  >
                    {plan.source.stock !== undefined
                      ? t.available(plan.source.stock)
                      : available ? t.inStock : t.outOfStock}
                  </span>
                )}
              />

              <article className="srv-mobile-plan-card" data-featured={featured || undefined}>
                <header className="srv-mobile-plan-head">
                  <div>
                    <div className="srv-mobile-plan-title-row">
                      <h3>{plan.name}</h3>
                      {featured ? <Badge variant="outline">{t.popular}</Badge> : null}
                    </div>
                    <p>{osLabel}</p>
                  </div>
                  <span className={available
                    ? 'srv-mobile-stock is-available'
                    : `srv-mobile-stock`}
                  >
                    {plan.source.stock !== undefined
                      ? t.left(plan.source.stock)
                      : available ? t.inStock : t.outOfStock}
                  </span>
                </header>

                <div className="srv-mobile-plan-price">
                  <strong>
                    {amount(price.amount)}
                  </strong>
                  <span>{p.suffix(cycle, price.suffix)}</span>
                </div>
                <p className="srv-mobile-plan-note">
                  {cycle === 'monthly'
                    ? t.billedMonthly
                    : t.effective(monthEquivalent)}
                </p>

                <dl className="srv-mobile-plan-specs">
                  <div>
                    <dt>{p.specs.cpu}</dt>
                    <dd>{p.spec(plan.specs.cpu)}</dd>
                  </div>
                  <div>
                    <dt>{p.specs.ram}</dt>
                    <dd>{plan.specs.ram}</dd>
                  </div>
                  <div>
                    <dt>{p.specs.storage}</dt>
                    <dd>{plan.specs.storage}</dd>
                  </div>
                </dl>

                <details className="srv-mobile-plan-more">
                  <summary>{t.viewSpecs}</summary>
                  <ul>
                    <li>{p.spec(plan.specs.cpu)}</li>
                    <li>{plan.specs.ram}</li>
                    <li>{plan.specs.storage}</li>
                    <li>{t.bandwidth(p.spec(plan.specs.bandwidth))}</li>
                    <li>{t.ipv4}</li>
                  </ul>
                </details>

                {available
                  ? (
                      <Button asChild size="lg" className="srv-mobile-plan-cta">
                        <a href={checkoutUrl(plan, cycle, locale)} aria-label={t.orderAria(plan.name)}>
                          {t.orderNow}
                        </a>
                      </Button>
                    )
                  : (
                      <Button size="lg" className="srv-mobile-plan-cta" disabled>{t.outOfStock}</Button>
                    )}
              </article>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild variant="outline">
          <Link href={localeHref('/plans', locale)}>{t.viewAll}</Link>
        </Button>
      </div>
    </div>
  );
}
