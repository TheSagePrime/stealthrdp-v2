import type { ResourceView, SessionView } from './catalog';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { SettingsEditor } from './SettingsEditor';
import { TrafficPanel } from './TrafficPanel';
import '@/styles/global.css';
import '@/styles/surfaces.css';
import '@/styles/stealth-v3.css';

const org = '22222222-2222-4222-8222-222222222222';
const domain = '33333333-3333-4333-8333-333333333333';
const identity: SessionView = { email: 'customer@example.invalid', role: 'owner', organisation: { id: org, name: 'Example' }, csrf: 'a'.repeat(64), expiresAt: Math.floor(Date.now() / 1000) + 900 };
const fetchMock = vi.fn();
const saved = vi.fn();
const expired = vi.fn();
const response: ResourceView = { fields: [], rows: [], data: { level: 'auto', auto_baseline: 'cookie' } };

beforeEach(() => {
  fetchMock.mockReset().mockResolvedValue(Response.json({ ok: true, fields: [], rows: [] }));
  saved.mockReset();
  expired.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => vi.unstubAllGlobals());

describe('Citadel setting forms', () => {
  it('preloads confirmed settings and requires confirmation before a CSRF-bound update', async () => {
    await render(<SettingsEditor resource="challenge" result={response} endpoint={`organisations/${org}/domains/${domain}/challenge`} session={identity} onSaved={saved} onExpired={expired} />);
    await userEvent.click(page.getByText('Save challenge level', { exact: true }).first());
    await userEvent.selectOptions(page.getByLabelText('Challenge level', { exact: true }), 'js');
    await userEvent.click(page.getByRole('button', { name: 'Save challenge level', exact: true }));

    expect(fetchMock).not.toHaveBeenCalled();

    await userEvent.click(page.getByRole('dialog', { name: 'Save challenge level?' }).getByRole('button', { name: 'Confirm change' }));
    await vi.waitFor(() => expect(saved).toHaveBeenCalledOnce());

    expect(JSON.parse(fetchMock.mock.calls[0]![1].body)).toEqual({ level: 'js', js_difficulty: 'normal' });
    expect(fetchMock.mock.calls[0]![1].headers).toMatchObject({ 'X-Citadel-CSRF': identity.csrf, 'Content-Type': 'application/json' });
  });

  it('keeps members read-only', async () => {
    await render(<SettingsEditor resource="challenge" result={response} endpoint="example/challenge" session={{ ...identity, role: 'member' }} onSaved={saved} onExpired={expired} />);
    await userEvent.click(page.getByText('Save challenge level', { exact: true }).first());

    expect(page.getByRole('button', { name: 'Save challenge level', exact: true })).toBeDisabled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows a failed save without discarding the edited value', async () => {
    fetchMock.mockResolvedValue(Response.json({ error: 'Citadel applied only part of this change.' }, { status: 409 }));
    await render(<SettingsEditor resource="challenge" result={response} endpoint="example/challenge" session={identity} onSaved={saved} onExpired={expired} />);
    await userEvent.click(page.getByText('Save challenge level', { exact: true }).first());
    await userEvent.selectOptions(page.getByLabelText('Challenge level', { exact: true }), 'lockdown');
    await userEvent.click(page.getByRole('button', { name: 'Save challenge level', exact: true }));
    await userEvent.click(page.getByRole('dialog').getByRole('button', { name: 'Confirm change' }));

    await expect.element(page.getByRole('alert')).toHaveTextContent('only part');
    expect(page.getByLabelText('Challenge level', { exact: true })).toHaveValue('lockdown');
    expect(saved).not.toHaveBeenCalled();
  });

  it('renders structured origin controls on mobile and only probes a selected saved hostname', async () => {
    await page.viewport(375, 812);
    await render(<SettingsEditor resource="origin" result={{ fields: [], rows: [], data: { origins: [{ hostname: 'shop.example.invalid', originUrl: 'https://origin.example.invalid:443', enabled: true }] } }} endpoint={`organisations/${org}/domains/${domain}/origin`} session={identity} onSaved={saved} onExpired={expired} />);
    await userEvent.click(page.getByText('Save origins', { exact: true }).first());

    expect(page.getByLabelText('Backend URL')).toHaveValue('https://origin.example.invalid:443');
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(375);

    await page.screenshot({ path: '../../../vitest-test-results/citadel-origin-controls-mobile.png' });
    await userEvent.click(page.getByText('Check origin health', { exact: true }).first());
    await userEvent.selectOptions(page.getByLabelText('Saved origin hostname'), 'shop.example.invalid');
    await userEvent.click(page.getByRole('button', { name: 'Check origin health', exact: true }));
    await userEvent.click(page.getByRole('dialog').getByRole('button', { name: 'Confirm change' }));
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());

    expect(fetchMock.mock.calls[0]![0]).toContain(`/domains/${domain}/origin-check`);
    expect(JSON.parse(fetchMock.mock.calls[0]![1].body)).toEqual({ hostname: 'shop.example.invalid' });
  });

  it('renders stored HTML as text without running scripts', async () => {
    const alert = vi.spyOn(window, 'alert');
    await render(<SettingsEditor resource="branding" result={{ fields: [], rows: [], data: { shells: { js: '<script>alert("example")</script>' } } }} endpoint="example/branding" session={identity} onSaved={saved} onExpired={expired} />);
    await userEvent.click(page.getByText('js shell', { exact: true }));

    expect(document.querySelector('.record script')).toBeNull();
    expect(alert).not.toHaveBeenCalled();
    expect(document.body.textContent).toContain('<script>alert("example")</script>');

    alert.mockRestore();
  });

  it('requests selected traffic scopes and time ranges and renders actual samples', async () => {
    fetchMock.mockImplementation(async (url: string) => Response.json(url.includes('/analytics?') ? { fields: [], rows: [], data: { points: [{ bucketStart: '2026-01-01T00:00:00Z', vps: { requests: 10, blocked: 2 } }, { bucketStart: '2026-01-01T00:01:00Z', vps: { requests: 20, blocked: 3 } }] } } : { fields: [], rows: [], data: { series: [] } }));
    await page.viewport(1366, 900);
    await render(<TrafficPanel base={`organisations/${org}`} domains={[{ id: domain, name: 'shop.example.invalid', status: 'active' }]} onExpired={expired} />);

    await expect.element(page.getByText('Proxy requests: 30', { exact: true })).toBeVisible();

    await userEvent.selectOptions(page.getByLabelText('Traffic scope'), domain);
    await vi.waitFor(() => expect(fetchMock.mock.calls.some(call => call[0].includes(`domainId=${domain}`))).toBe(true));

    await expect.element(page.getByRole('img')).toBeVisible();

    await page.screenshot({ path: '../../../vitest-test-results/citadel-traffic-desktop.png' });
    await page.viewport(375, 812);

    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(375);

    await page.screenshot({ path: '../../../vitest-test-results/citadel-traffic-mobile.png' });
  });
});
