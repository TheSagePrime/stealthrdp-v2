import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { useMenu } from './UseMenu';

function MenuHarness({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const { isMenuOpen, closeMenu, toggleMenu } = useMenu(defaultOpen);

  return (
    <>
      <output data-testid="menu-state">{String(isMenuOpen)}</output>
      <button type="button" onClick={toggleMenu}>Toggle menu</button>
      <button type="button" onClick={closeMenu}>Close menu</button>
    </>
  );
}

describe('UseMenu', () => {
  it('starts closed by default', async () => {
    await render(<MenuHarness />);

    await expect.element(page.getByTestId('menu-state')).toHaveTextContent('false');
  });

  it('supports an open initial state', async () => {
    await render(<MenuHarness defaultOpen />);

    await expect.element(page.getByTestId('menu-state')).toHaveTextContent('true');
  });

  it('opens when toggled', async () => {
    await render(<MenuHarness />);
    await userEvent.click(page.getByRole('button', { name: 'Toggle menu' }));

    await expect.element(page.getByTestId('menu-state')).toHaveTextContent('true');
  });

  it('closes after the close action', async () => {
    await render(<MenuHarness defaultOpen />);
    await userEvent.click(page.getByRole('button', { name: 'Close menu' }));

    await expect.element(page.getByTestId('menu-state')).toHaveTextContent('false');
  });

  it('returns to closed after two toggles', async () => {
    await render(<MenuHarness />);
    const toggle = page.getByRole('button', { name: 'Toggle menu' });
    await userEvent.click(toggle);
    await userEvent.click(toggle);

    await expect.element(page.getByTestId('menu-state')).toHaveTextContent('false');
  });
});
