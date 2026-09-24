import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
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
              <article key={region.code} className="srv3-region-card">
                <div className="srv3-region-art" aria-hidden="true">
                  <span className="srv3-region-code">{region.code}</span>
                </div>

                <div className="srv3-region-body">
                  <div className="srv3-region-label">
                    {region.code}
                  </div>
                  <h3>{region.title}</h3>
                  <p>{region.description}</p>
                  <span className="srv3-region-detail">{region.detail}</span>

                  <div className="srv3-region-footer">
                    <div>
                      <span>Plans from</span>
                      <strong>{starting === null ? 'Check stock' : `€${starting.toFixed(2)}/mo`}</strong>
                    </div>
                    <Link href="/plans">
                      View plans
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
