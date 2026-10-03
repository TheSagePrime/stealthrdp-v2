import { randomBytes } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handleOperation } from './operations';
import { projectDomains, projectResource } from './projection';
import { openSession, sealSession, SESSION_COOKIE } from './session';

const org = '22222222-2222-4222-8222-222222222222';
const domain = '33333333-3333-4333-8333-333333333333';
const foreign = '44444444-4444-4444-8444-444444444444';
const item = '55555555-5555-4555-8555-555555555555';
const principal = { id: '11111111-1111-4111-8111-111111111111', email: 'customer@example.invalid', organization_id: org, organization_name: 'Example', role: 'owner', email_verified: true, auth_type: 'session' };
const fetchMock = vi.fn();
let cookie: string;
let csrf: string;
let role: string;
function invoke(resource: string, method = 'GET', body?: unknown, query = '', headers: Record<string, string> = {}) {
  const path = resource.includes('/') || ['domains', 'notifications/settings', 'webhooks', 'api-keys', 'analytics'].includes(resource) ? resource : `domains/${domain}/${resource}`;
  return handleOperation(new Request(`https://www.stealthrdp.com/api/citadel/organisations/${org}/${path}${query}`, {
    method,
    headers: { 'Cookie': `${SESSION_COOKIE}=${cookie}`, 'Origin': 'https://www.stealthrdp.com', 'X-Citadel-CSRF': csrf, ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...headers },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  }), org, path.split('/'));
}

beforeEach(() => {
  vi.stubEnv('SESSION_SECRET', randomBytes(32).toString('base64'));
  vi.stubEnv('APP_ENV', 'production');
  vi.stubEnv('VERCEL_ENV', '');
  vi.stubEnv('CITADEL_API_BASE_URL', '');
  globalThis.sagePrimeRateLimits?.clear();
  role = 'owner';
  cookie = sealSession({ bearer: 'synthetic-credential', email: principal.email, subject: principal.id, expiresAt: Math.floor(Date.now() / 1000) + 900 }).value;
  csrf = openSession(cookie)!.csrf;
  fetchMock.mockReset();
  fetchMock.mockImplementation(async (url: string) => {
    const path = new URL(url).pathname;
    if (path.endsWith('/auth/me')) {
      return Response.json({ user: { ...principal, role } });
    }
    if (path.endsWith('/domains')) {
      return Response.json({ domains: [{ id: domain, domain: 'shop.example.invalid', protection_status: 'active', cloudflare_status: 'active', connection_mode: 'proxy' }] });
    }
    if (path.endsWith('/origin')) {
      return Response.json({ origins: [{ hostname: 'shop.example.invalid', origin_url: 'https://origin.example.invalid:443', enabled: true }] });
    }
    if (path.endsWith('/schedules')) {
      return Response.json({ schedules: [{ id: item, name: 'Example hours' }] });
    }
    if (path.endsWith('/webhooks')) {
      return Response.json({ webhooks: [{ id: item, name: 'Alerts', url: 'https://hooks.example.invalid/secret' }] });
    }
    if (path.endsWith('/api-keys')) {
      return Response.json({ keys: [{ id: item, name: 'Example key' }] });
    }
    if (path.endsWith('/rate-limit')) {
      return Response.json({ presets: [{ id: 'normal', label: 'Normal' }] });
    }
    if (path.endsWith('/blocklists')) {
      return Response.json({ available: [{ id: 'scrapers', softHardToggle: false }, { id: 'vpn', softHardToggle: true }] });
    }
    if (path.endsWith('/cache')) {
      return Response.json({ availableExtensions: ['css', 'js'] });
    }
    return Response.json({ ok: true });
  });
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

const upstreamMutation = () => fetchMock.mock.calls.find(call => call[1]?.method !== 'GET');

describe('Citadel confirmed customer controls', () => {
  it('adapts real protection/DNS fields and origin URLs without exposing unrelated properties', () => {
    const [result] = projectDomains({ domains: [{ id: domain, domain: 'shop.example.invalid', protection_status: 'active', cloudflare_status: 'pending', connection_mode: 'proxy', platform_key: 'private' }] }, org);

    expect(result).toMatchObject({ status: 'active', dnsStatus: 'pending' });

    const origin = projectResource({ origins: [{ hostname: 'shop.example.invalid', origin_url: 'https://origin.example.invalid:443', enabled: true, password: 'private' }] }, 'origin');

    expect(origin.data?.origins).toEqual([{ hostname: 'shop.example.invalid', origin_url: 'https://origin.example.invalid:443', originUrl: 'https://origin.example.invalid:443', enabled: true }]);
    expect(JSON.stringify(origin)).not.toContain('private');

    const options = projectResource({ preset: 'normal', presets: [{ id: 'normal', label: 'Normal' }] }, 'rate-limit');

    expect(options.data?.presets).toEqual([{ id: 'normal', label: 'Normal' }]);
  });

  it('forwards validated settings only after tenant and domain checks', async () => {
    const response = await invoke('challenge', 'PATCH', { level: 'auto', auto_baseline: 'js' });

    expect(response.status).toBe(200);
    expect(fetchMock.mock.calls.map(call => new URL(call[0]).pathname)).toEqual(['/api/v1/auth/me', '/api/v1/domains', `/api/v1/domains/${domain}/challenge`]);
    expect(JSON.parse(upstreamMutation()![1].body)).toEqual({ level: 'auto', auto_baseline: 'js' });
    expect(upstreamMutation()![1].headers).toEqual({ 'Authorization': 'Bearer synthetic-credential', 'Accept': 'application/json', 'Content-Type': 'application/json' });
  });

  it('rejects invalid levels, unknown fields, wrong content types and oversized input', async () => {
    for (const body of [{ level: 'invented' }, { level: 'auto', organization_id: foreign }, { level: 'auto', access_token: 'private' }, { level: 'auto', extra: 'x'.repeat(70000) }]) {
      expect((await invoke('challenge', 'PATCH', body)).status).toBe(400);
    }

    expect((await invoke('challenge', 'PATCH', { level: 'auto' }, '', { 'Content-Type': 'text/plain' })).status).toBe(400);
    expect(upstreamMutation()).toBeUndefined();
  });

  it('denies settings mutations for members, foreign domains and invalid CSRF', async () => {
    role = 'member';

    expect((await invoke('challenge', 'PATCH', { level: 'auto' })).status).toBe(403);

    role = 'owner';

    expect((await invoke(`domains/${foreign}/challenge`, 'PATCH', { level: 'auto' })).status).toBe(404);
    expect((await invoke('challenge', 'PATCH', { level: 'auto' }, '', { 'X-Citadel-CSRF': 'wrong' })).status).toBe(403);
    expect(upstreamMutation()).toBeUndefined();
  });

  it('rejects origin hostnames outside the domain and URLs carrying credentials or queries', async () => {
    for (const origin of [
      { hostname: 'foreign.example.invalid', originUrl: 'https://origin.example.invalid', enabled: true },
      { hostname: 'shop.example.invalid', originUrl: 'https://user:private@origin.example.invalid', enabled: true },
      { hostname: 'shop.example.invalid', originUrl: 'https://origin.example.invalid?token=private', enabled: true },
    ]) {
      expect((await invoke('origin', 'POST', { origins: [origin] })).status).toBe(400);
    }

    expect((await invoke('origin', 'DELETE', { hostname: 'shop.example.invalid' })).status).toBe(400);
    expect(upstreamMutation()).toBeUndefined();
  });

  it('checks a health probe against saved enabled origins', async () => {
    expect((await invoke('origin-check', 'POST', { hostname: 'external.example.invalid' })).status).toBe(400);
    expect(upstreamMutation()).toBeUndefined();
    expect((await invoke('origin-check', 'POST', { hostname: 'shop.example.invalid' })).status).toBe(200);
    expect(JSON.parse(upstreamMutation()![1].body)).toEqual({ hostname: 'shop.example.invalid' });
  });

  it('checks schedule, webhook and key IDs in current customer-scoped collections', async () => {
    for (const resource of ['schedules', 'webhooks', 'api-keys']) {
      expect((await invoke(resource, 'DELETE', undefined, `?id=${foreign}`)).status).toBe(404);
    }

    expect(upstreamMutation()).toBeUndefined();
    expect((await invoke('schedules', 'PATCH', { id: foreign, enabled: false })).status).toBe(404);
    expect((await invoke('schedules', 'DELETE', undefined, `?id=${item}`)).status).toBe(200);
    expect(upstreamMutation()![0]).toContain(`?id=${item}`);
  });

  it('validates dynamic presets, extensions, and soft blocklist support', async () => {
    expect((await invoke('rate-limit', 'PATCH', { preset: 'unsupported' })).status).toBe(400);
    expect((await invoke('blocklists', 'PATCH', { presets: ['scrapers'], soft: ['scrapers'] })).status).toBe(400);
    expect((await invoke('cache', 'PATCH', { enabled: true, ttlSec: 60, maxMb: 10, extensions: ['exe'], bypassPaths: [] })).status).toBe(400);
    expect(upstreamMutation()).toBeUndefined();
    expect((await invoke('blocklists', 'PATCH', { presets: ['vpn'], soft: ['vpn'] })).status).toBe(200);
  });

  it('uses server-owned policy flags and refuses flags supplied by the browser', async () => {
    const policy = { whitelistIps: ['192.0.2.1/32'], whitelistPaths: ['/health'], whitelistAgents: [], cookieTtlSec: 1800, autoHotStreak: 3, autoEscalateProxied: 25, autoCoolDownSec: 300, banStrikes: 8, banTtlSec: 900, countryBlock: ['ZZ'] };

    expect((await invoke('policy', 'PATCH', { ...policy, updateGeo: true })).status).toBe(400);
    expect((await invoke('policy', 'PATCH', policy)).status).toBe(200);
    expect(JSON.parse(upstreamMutation()![1].body)).toMatchObject({ updateGeo: true, countryBlock: ['ZZ'] });
  });

  it('rejects foreign analytics filters, unsupported queries and duplicate values', async () => {
    expect((await invoke('analytics', 'GET', undefined, `?domainId=${foreign}`)).status).toBe(404);
    expect((await invoke('logs', 'GET', undefined, '?page=1&page=2')).status).toBe(400);
    expect((await invoke('logs', 'GET', undefined, '?pageSize=200')).status).toBe(400);
    expect((await invoke('logs', 'GET', undefined, '?organization_id=other')).status).toBe(400);
    expect((await invoke('logs', 'GET', undefined, '?page=2&pageSize=25&type=error&sort=asc')).status).toBe(200);
    expect(fetchMock.mock.calls.at(-1)![0]).toContain('page=2&pageSize=25&type=error&sort=asc');
  });

  it('reports partial success without leaking upstream details or claiming the whole change succeeded', async () => {
    fetchMock.mockImplementation(async (url, options) => options.method === 'PATCH' ? Response.json({ ok: false, cloudflareError: 'private-error' }, { status: 207 }) : url.endsWith('/auth/me') ? Response.json({ user: principal }) : Response.json({ domains: [{ id: domain, domain: 'shop.example.invalid' }] }));
    const response = await invoke('challenge', 'PATCH', { level: 'auto' });

    expect(response.status).toBe(409);
    expect(await response.text()).toContain('only part');
    expect(await (await invoke('challenge', 'PATCH', { level: 'auto' })).text()).not.toContain('private-error');
  });

  it('keeps fleet bans/unlock, identity changes, credential creation and admin routes closed', async () => {
    for (const [resource, method] of [['bans', 'GET'], ['bans', 'PATCH'], ['unlock', 'POST'], ['api-keys', 'POST'], ['auth/email', 'PATCH'], ['team', 'POST'], ['admin/platform/access-token', 'POST']]) {
      expect((await invoke(resource!, method!, method === 'GET' ? undefined : {})).status).toBeGreaterThanOrEqual(400);
    }

    expect(upstreamMutation()).toBeUndefined();
  });

  it('removes the exact customer credential even if upstream echoes it in a known field', () => {
    const result = projectResource({ reason: 'synthetic-credential', logs: [{ summary: 'unexpected synthetic-credential echo' }], shells: { js: '<p>synthetic-credential</p>' } }, 'branding', 'synthetic-credential');

    expect(JSON.stringify(result)).not.toContain('synthetic-credential');
    expect(JSON.stringify(result)).toContain('[redacted]');
  });

  it('edits branding as plain text and omits credential-bearing shell content and webhook URLs', () => {
    const branding = projectResource({ shells: { js: '<script>alert(1)</script>', error_origin: 'Bearer private' }, token: 'private' }, 'branding');

    expect(branding.data?.shells).toEqual({ js: '<script>alert(1)</script>' });

    const webhook = projectResource({ webhooks: [{ id: item, name: 'Alerts', kind: 'generic', url: 'https://hooks.example.invalid/private', headers: { Authorization: 'private' } }] }, 'webhooks');

    expect(JSON.stringify(webhook)).not.toContain('private');
    expect(webhook.data?.webhooks).toEqual([{ id: item, name: 'Alerts', kind: 'generic' }]);
  });
});
