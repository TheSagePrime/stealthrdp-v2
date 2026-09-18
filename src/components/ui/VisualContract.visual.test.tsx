import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import '@/styles/global.css';

function VisualContractBoard() {
  return (
    <main
      data-testid="visual-contract"
      className="bg-background p-6 text-foreground"
    >
      <section className="mx-auto grid max-w-2xl gap-6 rounded-lg border bg-card p-6 shadow-sm">
        <header className="grid gap-2">
          <Badge className="w-fit">Foundation UI</Badge>
          <h1 className="text-2xl font-semibold tracking-tight">
            Sage Prime interface contract
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Stable primitives, restrained hierarchy, and token-driven states.
          </p>
        </header>

        <Separator />

        <div className="flex flex-wrap gap-3">
          <Button>Primary action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>

        <div className="grid gap-2 rounded-md border bg-muted/40 p-4">
          <strong className="text-sm">State surface</strong>
          <span className="text-sm text-muted-foreground">
            Borders, spacing, typography, and contrast stay predictable.
          </span>
        </div>
      </section>
    </main>
  );
}

async function renderBoard() {
  const screen = await render(<VisualContractBoard />);
  await document.fonts.ready;
  return screen.getByTestId('visual-contract');
}

test('desktop light visual contract', async () => {
  await page.viewport(1024, 900);
  document.documentElement.classList.remove('dark');
  const board = await renderBoard();
  await expect(board).toMatchScreenshot('desktop-light');
});

test('mobile light visual contract', async () => {
  await page.viewport(390, 844);
  document.documentElement.classList.remove('dark');
  const board = await renderBoard();
  await expect(board).toMatchScreenshot('mobile-light');
});

test('desktop dark visual contract', async () => {
  await page.viewport(1024, 900);
  document.documentElement.classList.add('dark');

  try {
    const board = await renderBoard();
    await expect(board).toMatchScreenshot('desktop-dark');
  } finally {
    document.documentElement.classList.remove('dark');
  }
});
