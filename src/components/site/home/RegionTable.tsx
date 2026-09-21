import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { plans } from '@/lib/stealth/content';

type Region = 'USA' | 'EU';

function numeric(value: string): number {
  return Number.parseInt(value, 10);
}

function range(values: number[], unit: string): string {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? `${min} ${unit}` : `${min} ${unit} – ${max} ${unit}`;
}

function regionFacts(region: Region) {
  const scoped = plans.filter(plan => plan.location === region);
  return {
    cpu: range(scoped.map(plan => numeric(plan.specs.cpu)), 'Core'),
    ram: range(scoped.map(plan => numeric(plan.specs.ram)), 'GB'),
    storage: `${range(scoped.map(plan => numeric(plan.specs.storage)), 'GB')} NVMe`,
    bandwidth: [...new Set(scoped.map(plan => plan.specs.bandwidth))].join(' / '),
  };
}

const locations = [
  {
    region: 'USA' as const,
    name: 'United States',
    note: 'Low-friction VPS deployment for North American workloads.',
    linkLabel: 'View USA plans',
  },
  {
    region: 'EU' as const,
    name: 'Europe',
    note: 'European VPS capacity for regional users and infrastructure.',
    linkLabel: 'View EU plans',
  },
];

/**
 * Per-location data table. DESIGN.md section 9, position 4: a table, not a
 * decorative map. Every value comes from the published plan records.
 */
export function RegionTable() {
  const rows = locations.map(location => ({ ...location, facts: regionFacts(location.region) }));

  return (
    <section className="sr-section sr-section-border" id="locations">
      <div className="sr-container">
        <div className="sr-section-head">
          <div>
            <p className="sr-kicker">Two regions. One standard.</p>
            <h2 className="sr-section-title">Put the server closer to the work.</h2>
          </div>
          <p>
            Choose the geography that fits your latency, audience and operational
            needs without changing the way you buy or manage the service.
          </p>
        </div>

        <div className="sr-region-table-wrap">
          <table className="sr-region-table">
            <thead>
              <tr>
                <th />
                {rows.map(row => (
                  <th key={row.region} scope="col">
                    <span className="sr-region-head">
                      <MapPin aria-hidden="true" />
                      {row.name}
                      <span className="sr-region-code">{row.region}</span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">CPU</th>
                {rows.map(row => <td key={row.region}>{row.facts.cpu}</td>)}
              </tr>
              <tr>
                <th scope="row">RAM</th>
                {rows.map(row => <td key={row.region}>{row.facts.ram}</td>)}
              </tr>
              <tr>
                <th scope="row">Storage</th>
                {rows.map(row => <td key={row.region}>{row.facts.storage}</td>)}
              </tr>
              <tr>
                <th scope="row">Bandwidth</th>
                {rows.map(row => <td key={row.region}>{row.facts.bandwidth}</td>)}
              </tr>
              <tr>
                <td />
                {rows.map(row => (
                  <td key={row.region}>
                    <span className="sr-region-head">
                      <Link href="/plans">{row.linkLabel}</Link>
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
