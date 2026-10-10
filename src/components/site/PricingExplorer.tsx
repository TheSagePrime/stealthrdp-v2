/* eslint-disable better-tailwindcss/no-unknown-classes */
'use client';

import type { SiteLocale } from '@/config/i18n';
import type { PricingCopy } from '@/content/i18n/en/pricing';
import type { BillingCycle, Plan } from '@/lib/stealth/content';
import { ArrowSquareOut, CaretDown } from '@phosphor-icons/react';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pill } from '@/components/ui/pill';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { pricingCopy } from '@/content/i18n/pricing';
import { checkoutUrl } from '@/lib/stealth/checkout';

const cycleOrder: BillingCycle[] = ['monthly', 'quarterly', 'semiannual', 'annual', 'biannual'];

/** Read a comparable number out of a published spec string. */
const specNumber = (value: string) => Number.parseInt(value.replace(/\D/g, ''), 10) || 0;

const planSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

function SpecCell({
  value,
  numeric,
  max,
  label,
}: {
  value: string;
  numeric: number;
  max: number;
  label: string;
}) {
  return (
    <TableCell className="sr-ledger-spec">
      <span className="sr-ledger-value">{value}</span>
      <Progress value={numeric} max={max} label={label} />
    </TableCell>
  );
}

/** Nearest in-stock plan in the same region, so a sold-out row still offers a way to buy now. */
function alternativeFor(plan: Plan, candidates: Plan[]): Plan | null {
  if (plan.source.availability !== 'out-of-stock') {
    return null;
  }
  const pool = candidates
    .filter(candidate => candidate.name !== plan.name)
    .filter(candidate => candidate.location === plan.location)
    .filter(candidate => candidate.source.availability !== 'out-of-stock');
  if (pool.length === 0) {
    return null;
  }
  const ordered = [...pool].sort((a, b) => a.pricing.monthly.amount - b.pricing.monthly.amount);
  return ordered.find(candidate => candidate.pricing.monthly.amount >= plan.pricing.monthly.amount)
    ?? ordered[ordered.length - 1]
    ?? null;
}

function PlanRow({
  plan,
  cycle,
  showPopular,
  maxima,
  alternative,
  t,
  locale,
}: {
  plan: Plan;
  cycle: BillingCycle;
  showPopular: boolean;
  maxima: { cpu: number; ram: number; storage: number };
  alternative?: Plan | null;
  t: PricingCopy;
  locale: SiteLocale;
}) {
  const price = plan.pricing[cycle];
  const available = plan.source.availability !== 'out-of-stock';

  return (
    <TableRow data-availability={available ? 'in-stock' : 'out-of-stock'}>
      <th scope="row">
        <span className="sr-plan-row">
          {plan.name}
          {showPopular ? <Badge variant="outline">{t.mostPopular}</Badge> : null}
          <span className="sr-ledger-meta">{t.description(plan.description)}</span>
        </span>
        <span className="sr-ledger-meta">
          {t.region}
          {' '}
          {t.regionNames[plan.location]}
        </span>
      </th>
      <SpecCell
        value={t.spec(plan.specs.cpu)}
        numeric={specNumber(plan.specs.cpu)}
        max={maxima.cpu}
        label={t.cpuLabel(t.spec(plan.specs.cpu), maxima.cpu)}
      />
      <SpecCell
        value={plan.specs.ram}
        numeric={specNumber(plan.specs.ram)}
        max={maxima.ram}
        label={t.ramLabel(plan.specs.ram, maxima.ram)}
      />
      <SpecCell
        value={plan.specs.storage}
        numeric={specNumber(plan.specs.storage)}
        max={maxima.storage}
        label={t.storageLabel(plan.specs.storage, maxima.storage)}
      />
      <TableCell className="sr-ledger-traffic">
        <span className="sr-ledger-value">{t.spec(plan.specs.bandwidth)}</span>
        <span className="sr-ledger-meta">{t.traffic}</span>
      </TableCell>
      <TableCell className="sr-ledger-price">
        {`${t.money(price.amount)}${t.suffix(cycle, price.suffix)}`}
        <span className="sr-ledger-meta">{`${t.dueToday} · ${t.period(cycle, price.periodLabel)}`}</span>
        {price.referenceAmount
          ? (
              <span className="sr-ledger-was">{`${t.standard} ${t.money(price.referenceAmount)}`}</span>
            )
          : null}
      </TableCell>
      <TableCell className="sr-ledger-action">
        {available
          ? (
              <Button asChild size="sm">
                <a
                  href={checkoutUrl(plan, cycle, locale)}
                  aria-label={t.orderAria(plan.name)}
                >
                  {t.orderNow}
                  {' '}
                  <ArrowSquareOut size={14} aria-hidden="true" />
                </a>
              </Button>
            )
          : (
              <div className="sr-ledger-stack">
                <Pill state="warn" icon={<span aria-hidden="true">!</span>}>
                  {t.outOfStockRow}
                </Pill>
                {alternative
                  ? (
                      <a
                        className="sr-ledger-alt"
                        href={checkoutUrl(alternative, cycle, locale)}
                        aria-label={t.altRowAria(plan.name, alternative.name)}
                      >
                        {t.see}
                        {' '}
                        {alternative.name}
                      </a>
                    )
                  : null}
              </div>
            )}
      </TableCell>
    </TableRow>
  );
}

/** Months covered by each billing cycle: drives the honest per-month equivalent. */
const cycleMonths: Record<BillingCycle, number> = {
  monthly: 1,
  quarterly: 3,
  semiannual: 6,
  annual: 12,
  biannual: 24,
};

/**
     One plan as a self-contained card mirroring the WHMCS store pattern:
    badge, price, OS, spec rows, live stock count, and its own action.
    Sold-out plans render the same card with an honest stock state.
 */
function PlanCard({
  plan,
  cycle,
  showPopular,
  alternative,
  t,
  locale,
}: {
  plan: Plan;
  cycle: BillingCycle;
  showPopular: boolean;
  alternative?: Plan | null;
  t: PricingCopy;
  locale: SiteLocale;
}) {
  const price = plan.pricing[cycle];
  const available = plan.source.availability !== 'out-of-stock';
  const stock = plan.source.stock;
  const osLabel = plan.source.os === 'linux-only' ? t.linuxOnly : t.linuxWindows;
  const months = cycleMonths[cycle] ?? 1;

  return (
    <article
      className="sr-pick-card"
      id={`plan-${planSlug(plan.name)}`}
      data-popular={showPopular}
      data-availability={available ? 'in-stock' : 'out-of-stock'}
    >
      <div className="sr-pick-card-head">
        <h3 className="sr-pick-card-name">{plan.name}</h3>
        <div className="sr-pick-card-badges">
          {showPopular ? <Badge variant="outline">{t.featured}</Badge> : null}
        </div>
      </div>
      <p className="sr-pick-card-price">
        <span className="sr-pick-card-amount">
          {`${t.money(price.amount)}${t.suffix(cycle, price.suffix)}`}
          {price.referenceAmount
            ? (
                <span className="sr-pick-card-was">{` ${t.money(price.referenceAmount)}`}</span>
              )
            : null}
        </span>
        <span className="sr-pick-card-period">
          {`${t.dueToday} · ${t.period(cycle, price.periodLabel)}`}
          {months > 1 ? t.effective(price.amount / months) : null}
        </span>
      </p>
      <p className="sr-pick-card-os">{osLabel}</p>
      <dl className="sr-pick-specs">
        <div className="sr-pick-spec">
          <dt>{t.specs.cpu}</dt>
          <dd>{t.spec(plan.specs.cpu)}</dd>
        </div>
        <div className="sr-pick-spec">
          <dt>{t.specs.ram}</dt>
          <dd>{plan.specs.ram}</dd>
        </div>
        <div className="sr-pick-spec">
          <dt>{t.specs.storage}</dt>
          <dd>{plan.specs.storage}</dd>
        </div>
        <div className="sr-pick-spec">
          <dt>{t.specs.bandwidth}</dt>
          <dd>{t.spec(plan.specs.bandwidth)}</dd>
        </div>
      </dl>
      <div className="sr-pick-card-action">
        {available
          ? (
              <Button asChild className="sr-pick-card-buy">
                <a
                  href={checkoutUrl(plan, cycle, locale)}
                  aria-label={t.orderAria(plan.name)}
                >
                  {t.orderNow}
                  {' '}
                  <ArrowSquareOut size={14} aria-hidden="true" />
                </a>
              </Button>
            )
          : (
              <div className="sr-ledger-stack">
                <Pill state="warn" icon={<span aria-hidden="true">!</span>}>
                  {t.outOfStockCard}
                </Pill>
                {alternative
                  ? (
                      <a
                        className="sr-ledger-alt"
                        href={`#plan-${planSlug(alternative.name)}`}
                        aria-label={t.altCardAria(plan.name, alternative.name)}
                      >
                        {t.see}
                        {' '}
                        {alternative.name}
                      </a>
                    )
                  : null}
              </div>
            )}
      </div>
      <p className="sr-pick-stock" data-state={available ? 'in-stock' : 'out-of-stock'}>
        {stock !== undefined ? t.available(stock) : (available ? t.inStock : t.outOfStock)}
      </p>
    </article>
  );
}

export function PricingExplorer({
  compact = false,
  plans,
  showComparison = false,
  locale = 'en',
}: {
  compact?: boolean;
  plans: Plan[];
  showComparison?: boolean;
  locale?: SiteLocale;
}) {
  const t = pricingCopy[locale];
  const [region, setRegion] = useState<'USA' | 'EU'>(() => {
    if (typeof window === 'undefined') {
      return 'USA';
    }
    return new URLSearchParams(window.location.search).get('region') === 'EU' ? 'EU' : 'USA';
  });
  const [cycle, setCycle] = useState<BillingCycle>(() => {
    if (typeof window === 'undefined') {
      return 'monthly';
    }
    const fromUrl = new URLSearchParams(window.location.search).get('cycle') as BillingCycle | null;
    return cycleOrder.includes(fromUrl as BillingCycle) ? (fromUrl as BillingCycle) : 'monthly';
  });
  /* Shareable state: region + cycle survive refresh and shared links. */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('region', region);
    params.set('cycle', cycle);
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
  }, [region, cycle]);

  const inRegion = useMemo(() => plans.filter(plan => plan.location === region), [plans, region]);
  /* Every tier stays listed, like the WHMCS store: sold-out plans render the
     same card with an honest stock state, never a dead-end checkout. */
  const visible = useMemo(() => (compact ? inRegion.slice(0, 3) : inRegion), [compact, inRegion]);

  const maxima = useMemo(() => ({
    cpu: Math.max(...inRegion.map(plan => specNumber(plan.specs.cpu))),
    ram: Math.max(...inRegion.map(plan => specNumber(plan.specs.ram))),
    storage: Math.max(...inRegion.map(plan => specNumber(plan.specs.storage))),
  }), [inRegion]);

  const ladderPlan = useMemo(
    () => plans.find(plan => plan.location === region && plan.name === `Bronze ${region}`)
      ?? plans.find(plan => plan.location === region),
    [plans, region],
  );

  /* One intentional recommendation per region: the first plan flagged popular
     in that region. Every other Popular flag stays in data but off the page. */
  const popularName = useMemo(
    () => plans.find(plan => plan.location === region && plan.popular)?.name,
    [plans, region],
  );

  /* The summary follows the popular plan when it is buyable,
     otherwise the first buyable plan in the region. */
  const highlighted = useMemo(
    () => inRegion.find(plan => plan.name === popularName && plan.source.availability !== 'out-of-stock')
      ?? inRegion.find(plan => plan.source.availability !== 'out-of-stock')
      ?? inRegion[0] ?? null,
    [inRegion, popularName],
  );
  const highlightedPrice = highlighted?.pricing[cycle];

  return (
    <div className="sr-pricing-explorer" data-compact={compact ? 'true' : 'false'}>
      <div className="srv-pricing-controls">
        <div className="srv-pricing-control-card srv-pricing-region">
          <div className="srv-selector" role="group" aria-label={t.regionGroup}>
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
                {t.regionNames[item]}
              </button>
            ))}
          </div>
        </div>

        <div className="srv-pricing-control-card srv-pricing-billing">
          <div className="srv-billing-rail" role="group" aria-label={t.billingGroup}>
            {cycleOrder.map((item) => {
              const termPrice = ladderPlan?.pricing[item];

              return (
                <button
                  key={item}
                  type="button"
                  className="srv-billing-option"
                  data-selected={cycle === item}
                  aria-pressed={cycle === item}
                  disabled={!termPrice}
                  aria-disabled={!termPrice}
                  onClick={() => setCycle(item)}
                >
                  <span className="srv-billing-full">{t.cycleLabels[item].full}</span>
                  <span className="srv-billing-short" aria-hidden="true">{t.cycleLabels[item].short}</span>
                  <span className="sr-visually-hidden">
                    {termPrice ? t.termAria(t.money(termPrice.amount), t.period(item, termPrice.periodLabel)) : t.noPrice}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="sr-visually-hidden" aria-live="polite">
          {highlighted && highlightedPrice
            ? t.liveAria(highlighted.name, t.cycleNames[cycle], t.money(highlightedPrice.amount), t.period(cycle, highlightedPrice.periodLabel))
            : t.noPlan}
        </p>
      </div>

      <div className="sr-pick-cards">
        {visible.map(plan => (
          <PlanCard
            key={plan.name}
            plan={plan}
            cycle={cycle}
            showPopular={plan.name === popularName}
            alternative={alternativeFor(plan, plans)}
            t={t}
            locale={locale}
          />
        ))}
      </div>

      {showComparison
        ? (
            <>
              <h2 className="sr-ledger-title">
                {t.compare.title}
                {' '}
                <span className="sr-visually-hidden">{t.compare.hidden}</span>
              </h2>
              <details className="sr-compare-details">
                <summary className="sr-compare-summary">
                  <span className="sr-kicker">{t.compare.kicker}</span>
                  <span className="sr-compare-label">
                    {t.compare.label}
                    <CaretDown size={14} aria-hidden="true" />
                  </span>
                </summary>
                <p className="sr-ledger-note">
                  {t.compare.note}
                </p>
                <span className="sr-ledger-hint">{t.compare.hint}</span>

                <div className="sr-ledger-scroll">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.compare.plan}</TableHead>
                        <TableHead>{t.specs.cpu}</TableHead>
                        <TableHead>{t.specs.ram}</TableHead>
                        <TableHead>{t.specs.storage}</TableHead>
                        <TableHead>{t.specs.bandwidth}</TableHead>
                        <TableHead>{t.priceHeader[cycle]}</TableHead>
                        <TableHead><span className="sr-visually-hidden">{t.compare.action}</span></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visible.map(plan => (
                        <PlanRow
                          key={plan.name}
                          plan={plan}
                          cycle={cycle}
                          showPopular={plan.name === popularName}
                          maxima={maxima}
                          alternative={alternativeFor(plan, plans)}
                          t={t}
                          locale={locale}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </details>
            </>
          )
        : null}
    </div>
  );
}
