import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { plans } from '@/lib/stealth/content';

type Region = 'USA' | 'EU';

function price(region: Region) {
  const values = plans
    .filter(plan => plan.location === region && plan.source.availability !== 'out-of-stock')
    .map(plan => plan.pricing.monthly.amount);

  return values.length ? Math.min(...values) : null;
}

const regions = [
  {
    code: 'USA' as const,
    title: 'United States',
    description: 'A practical choice for North American users and workloads.',
    detail: 'Windows + Linux · NVMe storage · Dedicated IPv4',
  },
  {
    code: 'EU' as const,
    title: 'Europe',
    description: 'European capacity for customers who want regional infrastructure.',
    detail: 'Windows + Linux · NVMe storage · Dedicated IPv4',
  },
];

export function RegionTable() {
  return (
    <section className="sr-section srv3-regions-section" id="locations">
      <div className="sr-container">
        <div className="srv3-section-heading">
          <div>
            <p className="sr-kicker">Choose your region</p>
            <h2>Closer infrastructure. Same StealthRDP experience.</h2>
          </div>
          <p>
            Pick the location that best fits your users and latency needs. Current
            stock is confirmed before checkout.
          </p>
        </div>

        <div className="srv3-region-grid">
          {regions.map(region => {
            const starting = price(region.code);

            return (
              <Card key={region.code}>
                <CardHeader className="gap-2">
                  <Badge variant="outline" className="w-fit font-mono">
                    {region.code}
                  </Badge>
                  <CardTitle className="text-heading-4 text-body-text">
                    <h3>{region.title}</h3>
                  </CardTitle>
                  <CardDescription className="text-small text-body-muted">
                    {region.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="text-small text-body-dim">
                  {region.detail}
                </CardContent>

                <CardFooter className="mt-auto flex-wrap justify-between gap-4">
                  <div className="grid gap-0.5">
                    <span className="text-micro text-body-dim">Plans from</span>
                    <strong className="text-heading-4 text-body-text">
                      {starting === null ? 'Check stock' : `€${starting.toFixed(2)}/mo`}
                    </strong>
                  </div>
                  <Link
                    href="/plans"
                    className="
                      inline-flex min-h-11 items-center gap-2 text-small
                      font-semibold text-primary transition-colors
                      hover:text-accent-hover
                    "
                  >
                    View plans
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
