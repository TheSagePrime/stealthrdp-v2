'use client';

import { useEffect, useMemo, useState } from 'react';
import { CaretDown as ChevronDown, ArrowSquareOut } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

/** Months covered by a published price suffix (/mo, /3mo, /6mo, /yr, /2yr). Read from
    the plan's own data so a 6-month EU term is never divided as a 24-month one. */
function monthsForSuffix(suffix: string): number {
  const match = /\/(\d+)?(mo|yr)/.exec(suffix);
  if (!match) return 1;
  const count = match[1] ? Number.parseInt(match[1], 10) : 1;
  return match[2] === 'yr' ? count * 12 : count;
}

/** Read a comparable number out of a published spec string. */
const specNumber = (value: string) => Number.parseInt(value.replace(/[^\d]/g, ''), 10) || 0;

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

  const visible = useMemo(() => {
    const matching = plans.filter(plan => plan.location === region);
    return compact ? matching.slice(0, 3) : matching;
  }, [compact, region]);

  const maxima = useMemo(() => {
    const inRegion = plans.filter(plan => plan.location === region);
    return {
      cpu: Math.max(...inRegion.map(plan => specNumber(plan.specs.cpu))),
      ram: Math.max(...inRegion.map(plan => specNumber(plan.specs.ram))),
      storage: Math.max(...inRegion.map(plan => specNumber(plan.specs.storage))),
    };
  }, [region]);

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

  return (
    <div className="sr-pricing-explorer">
      {guided ? (
        <div className="sr-plan-finder" aria-label="VPS workload finder">
          <div className="sr-finder-copy">
            <div>
              <span className="sr-control-label">Find a starting point</span>
              <strong>Tell us what the server is for.</strong>
            </div>
            <p>We highlight a sensible tier. You still control the final configuration.</p>
          </div>

          <div className="sr-finder-grid">
            <div className="sr-finder-block">
              <span className="sr-control-label">Use case</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="sr-workload-trigger"
                    aria-label={`Use case: ${workloadOptions.find(item => item.key === workload)?.label}`}
                  >
                    {workloadOptions.find(item => item.key === workload)?.label}
                    <ChevronDown size={16} aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="sr-workload-menu">
                  <DropdownMenuLabel>What will you run?</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={workload} onValueChange={value => setWorkload(value as WorkloadKey)}>
                    {workloadOptions.map(item => (
                      <DropdownMenuRadioItem key={item.key} value={item.key}>
                        {item.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="sr-finder-block sr-finder-os-note">
              <span className="sr-control-label">Operating system</span>
              <p>Choose Windows or Linux during checkout. Both options use these VPS plans.</p>
            </div>
          </div>

          <div className="sr-finder-result">
            <div>
              <span>Suggested starting tier</span>
              <strong>{recommendedTier} {region}</strong>
              <small>Final OS and availability are confirmed during checkout.</small>
            </div>
          </div>
        </div>
      ) : null}

      <p className="sr-ledger-note sr-ledger-summary" data-plan-summary>
        Showing {visible.length} {region} {visible.length === 1 ? 'plan' : 'plans'} · {priceHeader[cycle].toLowerCase()}
      </p>

      <div className="sr-control-row">
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

        <div className="sr-control-stack sr-term-stack">
          <span className="sr-control-label" id="sr-billing-label">Billing cycle</span>
          <ul className="sr-term-ladder" role="group" aria-labelledby="sr-billing-label">
            {cycleOrder.map(item => {
              const billing = billingCycles[item] as {
                label: string;
                discountLabel?: string;
              };
              const termPrice = ladderPlan?.pricing[item];
              const effective = termPrice ? termPrice.amount / monthsForSuffix(termPrice.suffix) : 0;
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
                    <span className="sr-term-rate">
                      {termPrice ? `from €${formatPrice(Number(effective.toFixed(2)))}` : '—'}
                      <small>per month</small>
                    </span>
                    <span className="sr-term-total">
                      {termPrice ? `€${formatPrice(termPrice.amount)} ${termPrice.periodLabel}, due today` : 'See checkout'}
                    </span>
                    <span className="sr-term-badge" aria-hidden={!termPrice?.discountLabel}>
                      {termPrice?.discountLabel ? <Badge variant="outline">{termPrice.discountLabel}</Badge> : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="sr-ledger-note">All prices in EUR. Final availability is confirmed during checkout.</p>
        </div>
      </div>

      <section id="comparison" className="sr-ledger-section">
        {showComparison ? (
          <>
            <p className="sr-kicker">02 / Compare precisely</p>
            <h2 className="sr-ledger-title">
              See the difference in one view. <span className="sr-visually-hidden">VPS Features Comparison</span>
            </h2>
          </>
        ) : (
          <h3 className="sr-ledger-title">
            {`Choose your resource level · ${region}`}
          </h3>
        )}
        <p className="sr-ledger-note">
          {showComparison
            ? 'Use this table for a quick resource check. Checkout confirms the current price and availability.'
            : `Bars compare each plan against the largest configuration in ${region}. Published prices and availability are confirmed during checkout.`}
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
                  recommended={guided && plan.name.toLowerCase().startsWith(recommendedTier.toLowerCase())}
                  showPopular={plan.name === popularName}
                  maxima={maxima}
                  alternative={alternativeFor(plan, plans)}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        {(() => {
          const inRegion = plans.filter(plan => plan.location === region);
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
          Bandwidth is unlimited on a 250 Mbps port. The 1 Gbps upgrade costs €5.00 per month at checkout and activates manually within 12 hours.
        </p>
        <p className="sr-ledger-note">
          Windows or Linux is selected during checkout. A Windows licence is not included — Evaluation image only; use your own eligible licence. <a href="/docs/windows-licensing">Windows licensing</a>
        </p>
      </section>
    </div>
  );
}
