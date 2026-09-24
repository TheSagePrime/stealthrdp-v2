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

  it('describes OS selection at checkout rather than offering an ineffective filter', async () => {
    await render(<PricingExplorer />);

    expect(page.getByText(/Choose Windows or Linux during checkout/)).toBeInTheDocument();
    expect(page.getByRole('button', { name: 'Windows' })).not.toBeInTheDocument();
    expect(page.getByRole('button', { name: 'Linux' })).not.toBeInTheDocument();
  });
});
