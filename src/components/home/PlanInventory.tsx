import { Button } from '@/components/ui/button';
import { checkoutUrl } from '@/lib/stealth/content';
import { planGroups, priceText } from './registry';

/**
 * The plan inventory: one ruled table per region, from src/content/plans.json only.
 * Names, specifications, availability and prices are read, never written.
 * The buyer compares here, before WHMCS, which is where comparisons usually stop.
 */
export function PlanInventory() {
  return (
    <div className="srx-inventory">
      {planGroups.map(group => (
        <div className="srx-inventory-group" key={group.location}>
          <h3 className="srx-inventory-region">
            {group.location}
            <span className="srx-mono"> · {group.rows.length} plans</span>
          </h3>

          <table className="srx-table">
            <caption className="srx-sr-only">{group.location} plans and current availability</caption>
            <thead>
              <tr>
                <th scope="col">Plan</th>
                <th scope="col">vCPU</th>
                <th scope="col">Memory</th>
                <th scope="col">Storage</th>
                <th scope="col">Transfer</th>
                <th scope="col">Stock</th>
                <th scope="col" className="srx-num">Monthly</th>
                <th scope="col">
                  <span className="srx-sr-only">Order</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {group.rows.map(plan => {
                const inStock = plan.source.availability === 'in-stock';
                return (
                  <tr key={plan.name} className={inStock ? undefined : 'srx-out'}>
                    <th scope="row" className="srx-plan-name">
                      {plan.name}
                    </th>
                    <td data-label="vCPU">{plan.specs.cpu}</td>
                    <td data-label="Memory">{plan.specs.ram}</td>
                    <td data-label="Storage">{plan.specs.storage}</td>
                    <td data-label="Transfer">{plan.specs.bandwidth}</td>
                    <td data-label="Stock">
                      <span className={`srx-stock srx-mono${inStock ? ' srx-is-up' : ''}`}>
                        {inStock ? 'In stock' : 'Out of stock'}
                      </span>
                    </td>
                    <td data-label="Monthly" className="srx-num srx-price srx-mono">
                      {/* one grid item, so the currency and the amount cannot be split across
                          the two columns of the stacked mobile row */}
                      <span className="srx-price-value">
                        <span className="srx-cur">€</span>
                        {priceText(plan.pricing.monthly.amount)}
                      </span>
                    </td>
                    <td className="srx-cell-action">
                      <Button asChild size="sm" variant={inStock ? 'default' : 'outline'}>
                        <a href={checkoutUrl(plan, 'monthly')}>{inStock ? 'Order' : 'View plan'}</a>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
