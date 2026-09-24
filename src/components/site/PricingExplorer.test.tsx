import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { PricingExplorer } from './PricingExplorer';

describe('PricingExplorer purchase decisions', () => {
  it('uses one selected billing cycle for cards and the full comparison table', async () => {
    await render(<PricingExplorer showComparison />);
    await userEvent.click(page.getByRole('button', { name: /Annual/ }));

    expect(page.getByRole('columnheader', { name: 'Price/yr' })).toBeInTheDocument();
    expect(page.getByRole('cell', { name: '€96/yr' })).toBeInTheDocument();
    expect(page.getByText(/€96\/yr/).first()).toHaveTextContent('€96/yr');
  });

  it('keeps region selection aligned across cards and comparison', async () => {
    await render(<PricingExplorer showComparison />);
    await userEvent.click(page.getByRole('button', { name: 'EU', exact: true }));

    expect(page.getByRole('heading', { name: /Compare EU plans/ })).toBeInTheDocument();
    expect(page.getByRole('rowheader', { name: /Bronze EU/ })).toBeInTheDocument();
    expect(page.getByRole('rowheader', { name: /Bronze USA/ })).not.toBeInTheDocument();
  });

  it('shows the same two-decimal price in cards and comparison', async () => {
    await render(<PricingExplorer showComparison />);

    expect(page.getByRole('cell', { name: '€9.50/mo' })).toBeInTheDocument();
    expect(page.getByText('€9.50').first()).toBeInTheDocument();
  });

  it('keeps specifications readable without repeated icons and preserves checkout actions', async () => {
    await render(<PricingExplorer />);

    const specs = document.querySelector('.sr-plan-specs');
    expect(specs?.textContent).toContain('CPU');
    expect(specs?.textContent).toContain('Memory');
    expect(specs?.textContent).toContain('Storage');
    expect(specs?.textContent).toContain('Traffic');
    expect(document.querySelectorAll('.sr-plan-specs svg')).toHaveLength(0);
    expect(page.getByRole('link', { name: 'Configure server' }).first()).toHaveAttribute('href');
  });

  it('selects a workload from the existing menu and updates the best fit', async () => {
    await render(<PricingExplorer />);
    await userEvent.click(page.getByRole('button', { name: /Remote desktop/ }));
    await userEvent.click(page.getByRole('menuitemradio', { name: 'Trading' }));

    expect(page.getByRole('button', { name: /Trading/ })).toBeInTheDocument();
    expect(page.getByText('Gold USA').first()).toBeInTheDocument();
  });

  it('describes OS selection at checkout rather than offering an ineffective filter', async () => {
    await render(<PricingExplorer />);

    expect(page.getByText(/Choose Windows or Linux during checkout/)).toBeInTheDocument();
    expect(page.getByRole('button', { name: 'Windows' })).not.toBeInTheDocument();
    expect(page.getByRole('button', { name: 'Linux' })).not.toBeInTheDocument();
  });
});
