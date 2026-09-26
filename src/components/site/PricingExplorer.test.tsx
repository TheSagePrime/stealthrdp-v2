import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { PricingExplorer } from './PricingExplorer';

/**
 * The explorer mirrors region and cycle into the URL, so a previous test leaks
 * its selection into the next render. Reset the URL to keep every test isolated.
 */
beforeEach(() => {
  window.history.replaceState({}, '', '/');
});

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

    expect(page.getByRole('columnheader', { name: 'Price per year' })).toBeInTheDocument();
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
    await userEvent.click(page.getByRole('button', { name: /^Monthly/ }));

    const priceCells = [...document.querySelectorAll('.sr-ledger-price')].map(
      cell => cell.textContent?.replace(/\s+/g, ' ').trim() ?? '',
    );
    expect(priceCells.some(text => text.includes('€9.50/mo')), `rendered prices: ${priceCells.join(' | ')}`).toBe(true);
    expect(page.getByText('€9.5/mo')).not.toBeInTheDocument();
  });

  it('keeps every specification readable without repeated icons and preserves checkout actions', async () => {
    await render(<PricingExplorer />);
    await userEvent.click(page.getByRole('button', { name: /^Monthly/ }));

    for (const column of ['CPU', 'RAM', 'Storage', 'Bandwidth']) {
      expect(page.getByRole('columnheader', { name: column })).toBeInTheDocument();
    }
    const specCells = [...document.querySelectorAll('.sr-ledger-spec')];
    expect(specCells.length, 'the ledger publishes one spec cell per plan and column').toBe(18);
    expect(specCells.every(cell => (cell.textContent ?? '').trim().length > 0), 'every spec cell carries a value').toBe(true);
    expect(document.querySelectorAll('tbody .sr-ledger-spec svg')).toHaveLength(0);
    const checkoutLink = document.querySelector('tbody a[href*="dash.stealthrdp.com"]:not(.sr-ledger-alt)');
    expect(checkoutLink, 'the in-stock plan still offers a checkout link').not.toBeNull();
    expect(document.querySelectorAll('tbody a[href*="dash.stealthrdp.com"]:not(.sr-ledger-alt)').length).toBe(1);
  });

  it('selects a workload from the existing menu and moves the best-fit marker', async () => {
    await render(<PricingExplorer />);
    await userEvent.click(page.getByRole('button', { name: /^Monthly/ }));

    const rowDump = () =>
      [...document.querySelectorAll('tbody tr')]
        .map(candidate => `${(candidate.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 24)}→${candidate.querySelector('[data-slot="badge"]')?.textContent ?? '-'}`)
        .join(' | ');

    expect(badgeFor('Bronze USA'), `rows: ${rowDump()}`).toBe('Best fit');

    await userEvent.click(page.getByRole('button', { name: /Remote desktop/ }));
    await userEvent.click(page.getByRole('menuitemradio', { name: 'Trading' }));

    expect(page.getByRole('button', { name: /Trading/ })).toBeInTheDocument();
    expect(badgeFor('Gold USA'), `rows: ${rowDump()}`).toBe('Best fit');
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
    /* The sold-out plan never links to its own suspended checkout. */
    expect(row?.querySelector('a[href*="platinum-eu"]')).toBeNull();
    expect(row?.textContent).toContain('Out of stock');
    /* A sold-out row still offers the nearest in-stock plan in the same region. */
    const alternative = row?.querySelector('a.sr-ledger-alt');
    expect(alternative).not.toBeNull();
    expect(alternative?.getAttribute('href')).toMatch(/dash\.stealthrdp\.com/);
    expect(alternative?.getAttribute('href')).not.toContain('platinum-eu');
  });
});
