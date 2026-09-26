import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { PricingExplorer } from './PricingExplorer';

/** Badge text shown on the ledger row whose plan name contains `name`. */
function badgeFor(name: string) {
  const row = [...document.querySelectorAll('tbody tr')]
    .find(candidate => candidate.textContent?.includes(name));
  return row?.querySelector('[data-slot="badge"]')?.textContent ?? '';
}

describe('PricingExplorer purchase decisions', () => {
  it('uses one selected billing cycle for the ledger price column', async () => {
    await render(<PricingExplorer showComparison />);
    await userEvent.click(page.getByRole('button', { name: /^Annual/ }));

    expect(page.getByRole('columnheader', { name: 'Price/yr' })).toBeInTheDocument();
    expect(page.getByRole('cell', { name: /€96\.50\/yr/ })).toBeInTheDocument();
  });

  it('offers every published billing cycle, semi-annual included', async () => {
    await render(<PricingExplorer />);

    const terms = [...document.querySelectorAll('.sr-term-option')].map(
      element => element.textContent?.replace(/\s+/g, ' ').trim() ?? '',
    );

    expect(terms).toHaveLength(5);
    for (const label of ['Monthly', 'Quarterly', '6-month', 'Annual', '2-year']) {
      expect(terms.some(term => term.startsWith(label)), `missing ${label} term: ${terms.join(' | ')}`).toBe(true);
    }
  });

  it('keeps region selection aligned across the control and the ledger', async () => {
    await render(<PricingExplorer showComparison />);
    await userEvent.click(page.getByRole('button', { name: 'EU', exact: true }));

    expect(page.getByRole('heading', { name: /See the difference in one view/ })).toBeInTheDocument();
    expect(page.getByRole('rowheader', { name: /Bronze EU/ })).toBeInTheDocument();
    expect(page.getByRole('rowheader', { name: /Bronze USA/ })).not.toBeInTheDocument();
  });

  it('shows the published price with two decimals and never a rounded variant', async () => {
    await render(<PricingExplorer showComparison />);

    expect(page.getByRole('cell', { name: /€9\.50\/mo/ })).toBeInTheDocument();
    expect(page.getByText('€9.5/mo')).not.toBeInTheDocument();
  });

  it('keeps every specification readable without repeated icons and preserves checkout actions', async () => {
    await render(<PricingExplorer />);

    for (const column of ['CPU', 'RAM', 'Storage', 'Bandwidth']) {
      expect(page.getByRole('columnheader', { name: column })).toBeInTheDocument();
    }
    expect(document.querySelectorAll('tbody svg')).toHaveLength(0);
    expect(document.querySelectorAll('.sr-ledger-spec')).toHaveLength(18);
    expect(page.getByRole('link', { name: 'Buy Now' }).first()).toHaveAttribute('href');
  });

  it('selects a workload from the existing menu and moves the best-fit marker', async () => {
    await render(<PricingExplorer />);

    expect(badgeFor('Bronze USA')).toBe('Best fit');

    await userEvent.click(page.getByRole('button', { name: /Remote desktop/ }));
    await userEvent.click(page.getByRole('menuitemradio', { name: 'Trading' }));

    expect(page.getByRole('button', { name: /Trading/ })).toBeInTheDocument();
    expect(badgeFor('Gold USA')).toBe('Best fit');
  });

  it('describes OS selection at checkout rather than offering an ineffective filter', async () => {
    await render(<PricingExplorer />);

    expect(page.getByText(/Choose Windows or Linux during checkout/)).toBeInTheDocument();
    expect(page.getByRole('button', { name: 'Windows' })).not.toBeInTheDocument();
    expect(page.getByRole('button', { name: 'Linux' })).not.toBeInTheDocument();
  });

  it('marks an out-of-stock plan instead of offering its checkout link', async () => {
    await render(<PricingExplorer showComparison />);
    await userEvent.click(page.getByRole('button', { name: 'EU', exact: true }));

    const row = [...document.querySelectorAll('tbody tr')]
      .find(candidate => candidate.textContent?.includes('Platinum EU'));
    expect(row).toBeDefined();
    expect(row?.getAttribute('data-availability')).toBe('out-of-stock');
    expect(row?.querySelector('a')).toBeNull();
  });
});
