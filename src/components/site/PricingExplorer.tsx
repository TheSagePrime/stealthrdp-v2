'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Cpu,
  Globe2,
  HardDrive,
  MemoryStick,
  Network,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
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

const cycleOrder: BillingCycle[] = ['monthly', 'quarterly', 'annual', 'biannual'];

const formatPrice = (amount: number) => Number.isInteger(amount) ? `${amount}` : amount.toFixed(2);

const workloadOptions = [
  { key: 'remote-desktop', label: 'Remote desktop', tier: 'Bronze' },
  { key: 'web-hosting', label: 'Web hosting', tier: 'Silver' },
  { key: 'automation', label: 'Automation & bots', tier: 'Gold' },
  { key: 'trading', label: 'Trading', tier: 'Gold' },
  { key: 'storage', label: 'Storage & backups', tier: 'Silver' },
] as const;

type WorkloadKey = (typeof workloadOptions)[number]['key'];

const specs = [
  { key: 'cpu', label: 'CPU', icon: Cpu },
  { key: 'ram', label: 'Memory', icon: MemoryStick },
  { key: 'storage', label: 'Storage', icon: HardDrive },
  { key: 'bandwidth', label: 'Traffic', icon: Network },
] as const;

/** Row of the comparison table: real records, one row per published plan. */
function ComparisonRow({
  plan,
  cycle,
  recommended,
}: {
  plan: Plan;
  cycle: BillingCycle;
  recommended: boolean;
}) {
  const price = plan.pricing[cycle];
  const available = plan.source.availability !== 'out-of-stock';

  return (
    <TableRow>
      <th scope="row">
        <span className="sr-plan-row">
          {plan.name}
          {recommended ? <Badge>Best fit</Badge> : null}
          {plan.popular && !recommended ? <Badge variant="outline">Popular</Badge> : null}
        </span>
      </th>
      <TableCell>{plan.specs.cpu}</TableCell>
      <TableCell>{plan.specs.ram}</TableCell>
      <TableCell>{plan.specs.storage}</TableCell>
      <TableCell>{plan.specs.bandwidth}</TableCell>
      <TableCell>{`€${formatPrice(price.amount)}${price.suffix}`}</TableCell>
      <TableCell>
        {available ? (
          <Button asChild size="sm" variant="outline">
            <a href={checkoutUrl(plan, cycle)}>Buy now</a>
          </Button>
        ) : (
          <span className="sr-table-unavailable">Currently unavailable</span>
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
  const [region, setRegion] = useState<'USA' | 'EU'>('USA');
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [workload, setWorkload] = useState<WorkloadKey>('remote-desktop');

  const recommendedTier = workloadOptions.find(item => item.key === workload)?.tier ?? 'Bronze';

  const visible = useMemo(() => {
    const matching = plans.filter(plan => plan.location === region);
    return compact ? matching.slice(0, 3) : matching;
  }, [compact, region]);

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
                  <Button type="button" variant="outline" className="sr-workload-trigger" aria-label={`Use case: ${workloadOptions.find(item => item.key === workload)?.label}`}>
                    {workloadOptions.find(item => item.key === workload)?.label}
                    <ChevronDown aria-hidden="true" />
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
            <span className="sr-finder-result-icon">
              <Globe2 aria-hidden="true" />
            </span>
            <div>
              <span>Suggested starting tier</span>
              <strong>{recommendedTier} {region}</strong>
              <small>Final OS and availability are confirmed during checkout.</small>
            </div>
          </div>
        </div>
      ) : null}

      <div className="sr-control-row">
        <div className="sr-control-stack">
          <span className="sr-control-label">Region</span>
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

        <div className="sr-control-stack">
          <span className="sr-control-label">Billing cycle</span>
          <ButtonGroup className="sr-segmented-control" aria-label="Billing cycle">
            {cycleOrder.map((item) => {
              const billing = billingCycles[item] as {
                label: string;
                discountLabel?: string;
              };

              return (
                <Button
                  key={item}
                  type="button"
                  size="sm"
                  variant={cycle === item ? 'default' : 'outline'}
                  aria-pressed={cycle === item}
                  onClick={() => setCycle(item)}
                >
                  <span>{billing.label}</span>
                  {billing.discountLabel ? (
                    <small className="sr-billing-save">{billing.discountLabel}</small>
                  ) : null}
                </Button>
              );
            })}
          </ButtonGroup>
        </div>
      </div>

      <div className="sr-plan-grid">
        {visible.map((plan) => {
            const price = plan.pricing[cycle];
            const available = plan.source.availability !== 'out-of-stock';
            const recommended = plan.name.startsWith(recommendedTier);
            const featured = guided ? recommended : plan.popular;

            return (
              <Card
                key={plan.name}
                className="sr-plan-card"
                data-popular={plan.popular}
                data-recommended={guided && recommended}
                data-featured={featured}
              >
                {featured ? (
                  <div className="sr-plan-featured-line" aria-hidden="true" />
                ) : null}

                <div className="sr-plan-top">
                  <div>
                    <span className="sr-plan-region">{plan.location} VPS</span>
                    <h3 className="sr-plan-name">{plan.name}</h3>
                  </div>
                  <div className="sr-plan-badges">
                    {guided && recommended ? <Badge>Best fit</Badge> : null}
                    {plan.popular && !(guided && recommended) ? (
                      <Badge variant="outline">Popular</Badge>
                    ) : null}
                  </div>
                </div>

                <div className="sr-plan-pricing">
                  <p className="sr-plan-price">
                    €{formatPrice(price.amount)}
                    <small>{price.suffix}</small>
                  </p>
                  <p className="sr-plan-period">
                    {price.periodLabel}
                    {price.discountLabel ? <span>{price.discountLabel}</span> : null}
                  </p>
                </div>

                <Separator />

                <ul className="sr-plan-specs">
                  {specs.map(({ key, label, icon: Icon }) => (
                    <li key={key}>
                      <span>
                        <Icon aria-hidden="true" />
                        {label}
                      </span>
                      <b>{plan.specs[key]}</b>
                    </li>
                  ))}
                </ul>

                <div className="sr-plan-actions">
                  {available ? (
                    <Button asChild className="w-full">
                      <a href={checkoutUrl(plan, cycle)}>
                        Configure server
                        <ArrowRight />
                      </a>
                    </Button>
                  ) : (
                    <span className="sr-unavailable">Currently unavailable</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      {showComparison ? (
        <div id="comparison" className="sr-comparison-panel">
          <h3>Compare {region} plans · {billingCycles[cycle].label}</h3>
          <p>Published prices and availability are confirmed during checkout.</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>CPU</TableHead>
                <TableHead>RAM</TableHead>
                <TableHead>Storage</TableHead>
                <TableHead>Bandwidth</TableHead>
                <TableHead>{`Price${plans[0]?.pricing[cycle].suffix ?? ''}`}</TableHead>
                <TableHead><span className="sr-visually-hidden">Action</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map(plan => (
                <ComparisonRow
                  key={plan.name}
                  plan={plan}
                  cycle={cycle}
                  recommended={guided && plan.name.startsWith(recommendedTier) && plan.location === region}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  );
}
