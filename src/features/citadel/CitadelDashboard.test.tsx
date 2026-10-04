import type { SessionView } from './catalog';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { CitadelDashboard } from './CitadelDashboard';
import '@/styles/global.css';
import '@/styles/surfaces.css';
import '@/styles/stealth.css';
import '@/styles/stealth-v3.css';

const organisation = '22222222-2222-4222-8222-222222222222';
const domainId = '33333333-3333-4333-8333-333333333333';
const fixtureDomains = [
  { id: domainId, name: 'shop.example.invalid', status: 'active' },
  { id: '44444444-4444-4444-8444-444444444444', name: 'docs.example.invalid', status: 'awaiting_dns' },
];
let identity: SessionView;
const fetchMock = vi.fn();

beforeEach(() => {
  identity = {
    email: 'customer@example.invalid',
    role: 'owner',
    organisation: { id: organisation, name: 'Example workspace' },
    csrf: 'a'.repeat(64),
    expiresAt: Math.floor(Date.now() / 1000) + 900,
  };
  window.history.replaceState({}, '', '/citadel/app');
  document.documentElement.classList.remove('dark');
  fetchMock.mockReset();
  fetchMock.mockImplementation(async (path: string) => {
    if (path === '/api/citadel/session') {
      return Response.json(identity);
    }
    if (path.endsWith('/domains')) {
      return Response.json({ domains: fixtureDomains });
    }
    if (path.endsWith('/service')) {
      return Response.json({ fields: [{ label: 'Plan', value: 'Test service' }], rows: [] });
    }
    if (path.endsWith('/service/bandwidth')) {
      return Response.json({ fields: [{ label: 'Usage', value: 'No traffic reported' }], rows: [] });
    }
    return Response.json({
      fields: [
        { label: 'Mode', value: 'auto' },
        { label: 'Profile', value: 'balanced' },
      ],
      rows: [],
    });
  });
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => vi.unstubAllGlobals());

describe('Citadel customer experience', () => {
  it('keeps the public page closed without a credential form or customer data', async () => {
    fetchMock.mockResolvedValue(Response.json({ error: 'Sign-in unavailable' }, { status: 401 }));
    await render(<CitadelDashboard />);

    await expect.element(page.getByRole('heading', { name: 'Citadel dashboard' })).toBeVisible();
    expect(page.getByRole('button', { name: 'StealthRDP sign-in coming soon' })).toBeDisabled();
    expect(document.querySelector('form')).toBeNull();
    expect(document.querySelector('input')).toBeNull();
    expect(document.body.textContent).not.toContain(identity.email);
    expect(document.querySelector('a[href="https://dash.stealthrdp.com"]')).not.toBeNull();
  });

  it('renders a compact desktop dashboard and searches the customer domain list', async () => {
    await page.viewport(1366, 900);
    await render(<CitadelDashboard />);

    await expect.element(page.getByRole('heading', { name: 'Your domains' })).toBeVisible();

    await document.fonts.ready;
    await page.screenshot({ path: '../../../vitest-test-results/citadel-dashboard-desktop.png' });
    await userEvent.fill(page.getByRole('searchbox', { name: 'Search domains' }), 'shop');

    expect(page.getByRole('button', { name: 'shop.example.invalid', exact: true })).toBeInTheDocument();
    expect(page.getByRole('button', { name: 'docs.example.invalid', exact: true })).not.toBeInTheDocument();

    await userEvent.fill(page.getByRole('searchbox', { name: 'Search domains' }), 'missing');

    expect(page.getByRole('heading', { name: 'No matching domains' })).toBeInTheDocument();
  });

  it('keeps mobile navigation and controls within the viewport', async () => {
    await page.viewport(375, 812);
    await render(<CitadelDashboard />);

    await expect.element(page.getByRole('heading', { name: 'Your domains' })).toBeVisible();

    await document.fonts.ready;

    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(375);

    await page.screenshot({ path: '../../../vitest-test-results/citadel-dashboard-mobile.png' });
    await userEvent.click(page.getByRole('button', { name: 'Manage shop.example.invalid' }));

    await expect.element(page.getByRole('tab', { name: 'Security' })).toBeVisible();
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(375);

    await page.screenshot({ path: '../../../vitest-test-results/citadel-domain-mobile.png' });
  });

  it('requires confirmation before removal and submits the bound CSRF value', async () => {
    await render(<CitadelDashboard />);
    await userEvent.click(page.getByRole('button', { name: 'Manage shop.example.invalid' }));
    await userEvent.click(page.getByRole('button', { name: 'Remove domain', exact: true }));

    expect(fetchMock.mock.calls.some(call => call[1]?.method === 'DELETE')).toBe(false);

    const dialog = page.getByRole('dialog', { name: 'Remove this domain?' });

    await expect.element(dialog).toBeVisible();

    await userEvent.click(dialog.getByRole('button', { name: 'Remove domain', exact: true }));
    await vi.waitFor(() => expect(fetchMock.mock.calls.some(call => call[1]?.method === 'DELETE')).toBe(true));
    const mutation = fetchMock.mock.calls.find(call => call[1]?.method === 'DELETE');

    expect(mutation?.[0]).toBe(`/api/citadel/organisations/${organisation}/domains/${domainId}`);
    expect(mutation?.[1].headers).toEqual({ 'X-Citadel-CSRF': identity.csrf });
  });

  it('keeps members read-only and clears the visible workspace after logout', async () => {
    identity.role = 'member';
    await render(<CitadelDashboard />);
    await userEvent.click(page.getByRole('button', { name: 'Manage shop.example.invalid' }));

    expect(page.getByRole('button', { name: 'Check connection' })).toBeDisabled();
    expect(page.getByRole('button', { name: 'Remove domain', exact: true })).toBeDisabled();

    await userEvent.click(page.getByRole('button', { name: 'Sign out' }));

    await expect.element(page.getByRole('heading', { name: 'Citadel dashboard' })).toBeVisible();
    expect(document.body.textContent).not.toContain(identity.email);
    expect(document.body.textContent).not.toContain('shop.example.invalid');
  });
});
