'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowSquareOut } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
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
import {
  billingCycles,
  checkoutUrl,
  plans,
  type BillingCycle,
  type Plan,
} from '@/lib/stealth/content';

const cycleOrder: BillingCycle[] = ['monthly', 'quarterly', 'semiannual', 'annual', 'biannual'];

/** Human price-column header per billing cycle: the cells show term totals, never monthly rates. */
const priceHeader: Record<BillingCycle, string> = {
  monthly: 'Price per month',
  quarterly: 'Price per quarter',
  semiannual: 'Price per 6 months',
  annual: 'Price per year',
  biannual: 'Price per 2 years',
};

const formatPrice = (amount: number) => Number.isInteger(amount) ? `${amount}` : amount.toFixed(2);

const workloadOptions = [
  { key: 'remote-desktop', label: 'Remote desktop', tier: 'Bronze' },
  { key: 'web-hosting', label: 'Web hosting', tier: 'Silver' },
  { key: 'automation', label: 'Automation & bots', tier: 'Gold' },
  { key: 'trading', label: 'Trading', tier: 'Gold' },
  { key: 'storage', label: 'Storage & backups', tier: 'Silver' },
] as const;

type WorkloadKey = (typeof workloadOptions)[number]['key'];

/** Read a comparable number out of a published spec string. */
const specNumber = (value: string) => Number.parseInt(value.replace(/[^\d]/g, ''), 10) || 0;

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
  if (plan.source.availability !== 'out-of-stock') return null;
  const pool = candidates
    .filter(candidate => candidate.name !== plan.name)
    .filter(candidate => candidate.location === plan.location)
    .filter(candidate => candidate.source.availability !== 'out-of-stock');
  if (pool.length === 0) return null;
  const ordered = [...pool].sort((a, b) => a.pricing.monthly.amount - b.pricing.monthly.amount);
  return ordered.find(candidate => candidate.pricing.monthly.amount >= plan.pricing.monthly.amount)
    ?? ordered[ordered.length - 1]
    ?? null;
}

function PlanRow({
  plan,
  cycle,
  recommended,
  showPopular,
  maxima,
  alternative,
}: {
  plan: Plan;
  cycle: BillingCycle;
  recommended: boolean;
  showPopular: boolean;
  maxima: { cpu: number; ram: number; storage: number };
  alternative?: Plan | null;
}) {
  const price = plan.pricing[cycle];
  const available = plan.source.availability !== 'out-of-stock';

  return (
    <TableRow data-availability={available ? 'in-stock' : 'out-of-stock'}>
      <th scope="row">
        <span className="sr-plan-row">
          {plan.name}
          {recommended ? <Badge>Best fit</Badge> : null}
          {showPopular && !recommended ? <Badge variant="outline">Most Popular</Badge> : null}
          <span className="sr-ledger-meta">{plan.description}</span>
        </span>
        <span className="sr-ledger-meta">
          Region: {plan.location}
        </span>
      </th>
      <SpecCell
        value={plan.specs.cpu}
        numeric={specNumber(plan.specs.cpu)}
        max={maxima.cpu}
        label={`CPU: ${plan.specs.cpu} of ${maxima.cpu} cores in this region`}
      />
      <SpecCell
        value={plan.specs.ram}
        numeric={specNumber(plan.specs.ram)}
        max={maxima.ram}
        label={`Memory: ${plan.specs.ram} of ${maxima.ram} GB in this region`}
      />
      <SpecCell
        value={plan.specs.storage}
        numeric={specNumber(plan.specs.storage)}
        max={maxima.storage}
        label={`Storage: ${plan.specs.storage} of ${maxima.storage} GB in this region`}
      />
      <TableCell className="sr-ledger-traffic">
        <span className="sr-ledger-value">{plan.specs.bandwidth}</span>
        <span className="sr-ledger-meta">traffic</span>
      </TableCell>
      <TableCell className="sr-ledger-price">
        {`€${formatPrice(price.amount)}${price.suffix}`}
        <span className="sr-ledger-meta">{`due today · ${price.periodLabel}`}</span>
        {price.referenceAmount ? (
          <span className="sr-ledger-was">{`standard €${formatPrice(price.referenceAmount)}`}</span>
        ) : null}
      </TableCell>
      <TableCell className="sr-ledger-action">
        {available ? (
          <Button asChild size="sm">
            <a
              href={checkoutUrl(plan, cycle)}
              aria-label={`Buy ${plan.name} — leaves this site for the StealthRDP checkout at dash.stealthrdp.com`}
            >
              Buy Now (secure checkout) <ArrowSquareOut size={14} aria-hidden="true" />
            </a>
          </Button>
        ) : (
          <div className="sr-ledger-stack">
            <Pill state="warn" icon={<span aria-hidden="true">!</span>}>
              Out of stock
            </Pill>
            {alternative ? (
              <a
                className="sr-ledger-alt"
                href={checkoutUrl(alternative, cycle)}
                aria-label={`${plan.name} is out of stock — buy ${alternative.name} instead at dash.stealthrdp.com`}
              >
                See {alternative.name}
              </a>
            ) : null}
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}

/** One plan as a self-contained card: specs, total due today, and its own Buy action. No sideways scroll. */
function PlanCard({
  plan,
  cycle,
  recommended,
  showPopular,
  alternative,
}: {
  plan: Plan;
  cycle: BillingCycle;
  recommended: boolean;
  showPopular: boolean;
  alternative?: Plan | null;
}) {
  const price = plan.pricing[cycle];
  const available = plan.source.availability !== 'out-of-stock';

  return (
    <article
      className="sr-pick-card"
      id={`plan-${planSlug(plan.name)}`}
      data-availability={available ? 'in-stock' : 'out-of-stock'}
    >
      <div className="sr-pick-card-head">
        <h3 className="sr-pick-card-name">{plan.name}</h3>
        <div className="sr-pick-card-badges">
          {recommended ? <Badge>Best fit</Badge> : null}
          {showPopular && !recommended ? <Badge variant="outline">Most Popular</Badge> : null}
        </div>
      </div>
      <p className="sr-pick-card-tag">{plan.description}</p>
      <p className="sr-pick-card-specs">
        {plan.specs.cpu} · {plan.specs.ram} RAM · {plan.specs.storage} · {plan.specs.bandwidth} bandwidth
      </p>
      <p className="sr-pick-card-price">
        <span className="sr-pick-card-amount">{`€${formatPrice(price.amount)}${price.suffix}`}</span>
        <span className="sr-pick-card-period">{`due today · ${price.periodLabel}`}</span>
        {price.referenceAmount ? (
          <span className="sr-pick-card-was">{`standard €${formatPrice(price.referenceAmount)}`}</span>
        ) : null}
      </p>
      <div className="sr-pick-card-action">
        {available ? (
          <Button asChild className="sr-pick-card-buy">
            <a
              href={checkoutUrl(plan, cycle)}
              aria-label={`Buy ${plan.name} — leaves this site for the StealthRDP checkout at dash.stealthrdp.com`}
            >
              Buy Now (secure checkout) <ArrowSquareOut size={14} aria-hidden="true" />
            </a>
          </Button>
        ) : (
          <div className="sr-ledger-stack">
            <Pill state="warn" icon={<span aria-hidden="true">!</span>}>
              Out of stock
            </Pill>
            {alternative ? (
              <a
                className="sr-ledger-alt"
                href={`#plan-${planSlug(alternative.name)}`}
                aria-label={`${plan.name} is out of stock — see ${alternative.name} instead`}
              >
                See {alternative.name}
              </a>
            ) : null}
          </div>
        )}
      </div>
    </article>
  );
}

export function PricingExplorer({
  compact = false,
  guided = true,
  showComparison = false,
}: {
  compact?: boolean;
  guided?: boolean;
  showComparison?: boolean;
}) {
  const [region, setRegion] = useState<'USA' | 'EU'>(() => {
    if (typeof window === 'undefined') return 'USA';
    return new URLSearchParams(window.location.search).get('region') === 'EU' ? 'EU' : 'USA';
  });
  const [cycle, setCycle] = useState<BillingCycle>(() => {
    if (typeof window === 'undefined') return 'monthly';
    const fromUrl = new URLSearchParams(window.location.search).get('cycle') as BillingCycle | null;
    return cycleOrder.includes(fromUrl as BillingCycle) ? (fromUrl as BillingCycle) : 'monthly';
  });
  const [workload, setWorkload] = useState<WorkloadKey>('remote-desktop');

  /* Shareable state: region + cycle survive refresh and shared links. */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('region', region);
    params.set('cycle', cycle);
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
  }, [region, cycle]);

  const recommendedTier = workloadOptions.find(item => item.key === workload)?.tier ?? 'Bronze';
  const isRecommended = (plan: Plan) =>
    guided && plan.name.toLowerCase().startsWith(recommendedTier.toLowerCase());

  const inRegion = useMemo(() => plans.filter(plan => plan.location === region), [region]);
  const visible = useMemo(() => (compact ? inRegion.slice(0, 3) : inRegion), [compact, inRegion]);

  const maxima = useMemo(() => ({
    cpu: Math.max(...inRegion.map(plan => specNumber(plan.specs.cpu))),
    ram: Math.max(...inRegion.map(plan => specNumber(plan.specs.ram))),
    storage: Math.max(...inRegion.map(plan => specNumber(plan.specs.storage))),
  }), [inRegion]);

  const ladderPlan = useMemo(
    () => plans.find(plan => plan.location === region && plan.name === `Bronze ${region}`)
      ?? plans.find(plan => plan.location === region),
    [region],
  );

  /* One intentional recommendation per region: the first plan flagged popular
     in that region. Every other Popular flag stays in data but off the page. */
  const popularName = useMemo(
    () => plans.find(plan => plan.location === region && plan.popular)?.name,
    [region],
  );

  /* The summary follows the highlighted tier: recommended and buyable when
     possible, otherwise the first buyable plan in the region. */
  const highlighted = useMemo(
    () => inRegion.find(plan => isRecommended(plan) && plan.source.availability !== 'out-of-stock')
      ?? inRegion.find(plan => plan.source.availability !== 'out-of-stock')
      ?? inRegion[0] ?? null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inRegion, region, workload, guided],
  );
  const highlightedAvailable = highlighted?.source.availability !== 'out-of-stock';
  const highlightedPrice = highlighted?.pricing[cycle];

  return (
    <div className="sr-pricing-explorer">
      <div className="sr-picker-row">
        <div className="sr-control-stack">
          <span className="sr-control-label">Deployment region</span>
          <ButtonGroup className="sr-segmented-control" aria-label="Deployment region">
            {(['USA', 'EU'] as const).map(item => (
              <Button
                key={item}
                type="button"
                size="sm"
                variant={region === item ? 'default' : 'outline'}
                aria-pressed={region === item}
                onClick={() => setRegion(item)}
              >
                {item}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        {guided ? (
          <div className="sr-control-stack">
            <span className="sr-control-label" id="sr-use-case-label">Use case</span>
            <div className="sr-use-chips" role="group" aria-labelledby="sr-use-case-label">
              {workloadOptions.map(item => (
                <Button
                  key={item.key}
                  type="button"
                  size="sm"
                  variant={workload === item.key ? 'default' : 'outline'}
                  aria-pressed={workload === item.key}
                  onClick={() => setWorkload(item.key)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
            <p className="sr-ledger-note">Choose Windows or Linux during checkout. Both options use these VPS plans.</p>
          </div>
        ) : null}
      </div>

      <div className="sr-control-stack sr-cycle-stack">
        <span className="sr-control-label" id="sr-billing-label">Billing cycle</span>
        <ul className="sr-cycle-strip" role="group" aria-labelledby="sr-billing-label">
          {cycleOrder.map(item => {
            const billing = billingCycles[item] as {
              label: string;
              discountLabel?: string;
            };
            const termPrice = ladderPlan?.pricing[item];
            const selected = cycle === item;
            const termLabel = termPrice?.suffix === '/2yr' ? '2-year' : termPrice?.suffix === '/6mo' ? '6-month' : billing.label;

            return (
              <li key={item}>
                <button
                  type="button"
                  className="sr-term-option"
                  data-selected={selected}
                  aria-pressed={selected}
                  disabled={!termPrice}
                  aria-disabled={!termPrice}
                  onClick={() => setCycle(item)}
                >
                  <span className="sr-term-label">{termLabel}</span>
                  {termPrice?.discountLabel ? (
                    <Badge variant="outline" className="sr-term-save">{termPrice.discountLabel}</Badge>
                  ) : null}
                  <span className="sr-visually-hidden">
                    {termPrice ? `from €${formatPrice(termPrice.amount)} ${termPrice.periodLabel}, due today` : 'price at checkout'}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="sr-visually-hidden" aria-live="polite">
          {highlighted && highlightedPrice
            ? `${highlighted.name}, ${billingCycles[cycle]?.label}: €${formatPrice(highlightedPrice.amount)} ${highlightedPrice.periodLabel}, due today`
            : 'No plan selected'}
        </p>
      </div>

      <p className="sr-ledger-note sr-ledger-summary" data-plan-summary>
        Showing {visible.length} {region} {visible.length === 1 ? 'plan' : 'plans'} · {priceHeader[cycle].toLowerCase()}
      </p>

      <div className="sr-pick-cards">
        {visible.map(plan => (
          <PlanCard
            key={plan.name}
            plan={plan}
            cycle={cycle}
            recommended={isRecommended(plan)}
            showPopular={plan.name === popularName}
            alternative={alternativeFor(plan, plans)}
          />
        ))}
      </div>

      {!compact && highlighted && highlightedPrice ? (
        <div className="sr-picker-summary" aria-label="Current selection">
          <p className="sr-picker-summary-text">
            <strong>{highlighted.name}</strong>
            <span>{region} · {billingCycles[cycle]?.label}</span>
            <span className="sr-picker-summary-price">{`€${formatPrice(highlightedPrice.amount)} ${highlightedPrice.periodLabel}, due today`}</span>
          </p>
          {highlightedAvailable ? (
            <Button asChild size="sm">
              <a
                href={checkoutUrl(highlighted, cycle)}
                aria-label={`Buy ${highlighted.name} — leaves this site for the StealthRDP checkout at dash.stealthrdp.com`}
              >
                Buy Now (secure checkout) <ArrowSquareOut size={14} aria-hidden="true" />
              </a>
            </Button>
          ) : (
            <Pill state="warn" icon={<span aria-hidden="true">!</span>}>
              Out of stock
            </Pill>
          )}
        </div>
      ) : null}

      {!compact ? (
        <>
          {(() => {
            const available = inRegion.filter(plan => plan.source.availability !== 'out-of-stock');
            const soldOut = inRegion.filter(plan => plan.source.availability === 'out-of-stock');
            if (soldOut.length === 0) return null;
            return (
              <p className="sr-ledger-note" aria-live="polite">
                {soldOut.map(plan => plan.name).join(', ')} {soldOut.length === 1 ? 'is' : 'are'} out of stock
                {available.length > 0 ? ` — available in ${region} now: ${available.map(plan => plan.name).join(', ')}.` : '.'} Availability is confirmed at checkout.
              </p>
            );
          })()}
          <p className="sr-ledger-note">
            All prices in EUR. Bandwidth is unlimited on a 250 Mbps port. The 1 Gbps upgrade costs €5.00 per month at checkout and activates manually within 12 hours.
          </p>
          <p className="sr-ledger-note">
            Windows or Linux is selected during checkout. A Windows licence is not included — Evaluation image only; use your own eligible licence. <a href="/docs/windows-licensing">Windows licensing</a>
          </p>
        </>
      ) : null}

      {showComparison ? (
        <details className="sr-compare-details">
          <summary className="sr-compare-summary">
            <span className="sr-kicker">02 / Compare precisely</span>
            <span className="sr-ledger-title">
              See the difference in one view. <span className="sr-visually-hidden">VPS Features Comparison</span>
            </span>
          </summary>
          <p className="sr-ledger-note">
            Use this table for a quick resource check. Checkout confirms the current price and availability.
          </p>
          <span className="sr-ledger-hint">Swipe the table to compare every column.</span>

          <div className="sr-ledger-scroll">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>CPU</TableHead>
                  <TableHead>RAM</TableHead>
                  <TableHead>Storage</TableHead>
                  <TableHead>Bandwidth</TableHead>
                  <TableHead>{priceHeader[cycle]}</TableHead>
                  <TableHead><span className="sr-visually-hidden">Action</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map(plan => (
                  <PlanRow
                    key={plan.name}
                    plan={plan}
                    cycle={cycle}
                    recommended={isRecommended(plan)}
                    showPopular={plan.name === popularName}
                    maxima={maxima}
                    alternative={alternativeFor(plan, plans)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </details>
      ) : null}
    </div>
  );
}
