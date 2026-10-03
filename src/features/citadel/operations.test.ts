import { randomBytes } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST as logout } from '@/app/api/citadel/logout/route';
import { GET as sessionInfo } from '@/app/api/citadel/session/route';
import { authorize } from './http';
import { handleOperation, resolveOperation } from './operations';
import { projectResource } from './projection';
import { openSession, sealSession, SESSION_COOKIE } from './session';
import { citadelRequest } from './upstream';

const organisation = '22222222-2222-4222-8222-222222222222';
const domainId = '33333333-3333-4333-8333-333333333333';
const stranger = '44444444-4444-4444-8444-444444444444';
const user = {
  id: '11111111-1111-4111-8111-111111111111',
  email: 'customer@example.invalid',
  organization_id: organisation,
  organization_name: 'Test organisation',
  role: 'owner',
  email_verified: true,
  auth_type: 'session',
};
let cookie: string;
let csrf: string;
let principal: typeof user;
const fetchMock = vi.fn();

function request(method = 'GET', org = organisation, headers: HeadersInit = {}): Request {
  return new Request(`https://www.stealthrdp.com/api/citadel/organisations/${org}/domains`, {
    method,
    headers: {
      'Cookie': `${SESSION_COOKIE}=${cookie}`,
      'Origin': 'https://www.stealthrdp.com',
      'X-Citadel-CSRF': csrf,
      ...headers,
    },
  });
}

beforeEach(() => {
  vi.stubEnv('SESSION_SECRET', randomBytes(32).toString('base64'));
  vi.stubEnv('APP_ENV', 'production');
  vi.stubEnv('VERCEL_ENV', '');
  vi.stubEnv('CITADEL_API_BASE_URL', '');
  globalThis.sagePrimeRateLimits?.clear();
  principal = { ...user };
  cookie = sealSession({
    bearer: 'test-user-credential',
    email: user.email,
    subject: user.id,
    expiresAt: Math.floor(Date.now() / 1000) + 900,
  }).value;
  csrf = openSession(cookie)!.csrf;
  fetchMock.mockReset();
  fetchMock.mockImplementation(async (url: string) => {
    if (url.endsWith('/auth/me')) {
      return Response.json({ user: { ...principal, access_token: 'must-not-leak' } });
    }
    if (url.endsWith('/domains')) {
      return Response.json({
        domains: [
          {
            id: domainId,
            domain: 'shop.example.invalid',
            status: 'active',
            organization_id: organisation,
            api_key: 'must-not-leak',
          },
        ],
      });
    }
    return Response.json({ status: 'healthy', access_token: 'must-not-leak' });
  });
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('Citadel server boundary', () => {
  it('rejects missing and forged sessions before making any upstream request', async () => {
    expect((await sessionInfo(new Request('https://www.stealthrdp.com/api/citadel/session'))).status).toBe(401);

    cookie = 'forged-cookie';

    expect((await handleOperation(request(), organisation, ['domains'])).status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns only the verified principal DTO and private response headers', async () => {
    const response = await sessionInfo(request());
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).not.toContain('must-not-leak');
    expect(body).not.toContain('test-user-credential');
    expect(response.headers.get('cache-control')).toContain('no-store');
    expect(response.headers.get('x-robots-tag')).toContain('noindex');
    expect(response.headers.get('referrer-policy')).toBe('no-referrer');
  });

  it('checks membership before any requested organisation resource', async () => {
    const response = await handleOperation(request('GET', stranger), stranger, ['domains']);

    expect(response.status).toBe(403);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]![0]).toMatch(/\/auth\/me$/);
  });

  it('rechecks changed membership and revoked credentials instead of trusting the cookie', async () => {
    expect((await handleOperation(request(), organisation, ['domains'])).status).toBe(200);

    principal.organization_id = stranger;

    expect((await handleOperation(request(), organisation, ['domains'])).status).toBe(403);

    fetchMock.mockResolvedValue(Response.json({ error: 'private details' }, { status: 401 }));

    expect((await sessionInfo(request())).status).toBe(401);
  });

  it('rejects an identity mismatch or unverified email', async () => {
    principal.email = 'other@example.invalid';

    expect((await sessionInfo(request())).status).toBe(401);

    principal.email = user.email;
    principal.email_verified = false;

    expect((await sessionInfo(request())).status).toBe(401);
  });

  it('checks domain ownership before forwarding a domain action', async () => {
    const response = await handleOperation(request('POST'), organisation, ['domains', stranger, 'refresh']);

    expect(response.status).toBe(404);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls.some(call => String(call[0]).includes(stranger))).toBe(false);
  });

  it('rejects cross-origin, missing and malformed CSRF values before forwarding mutations', async () => {
    const invalidHeaders: Record<string, string>[] = [
      { Origin: 'https://attacker.invalid' },
      { 'X-Citadel-CSRF': '' },
      { 'X-Citadel-CSRF': 'é'.repeat(64) },
    ];
    for (const headers of invalidHeaders) {
      expect(
        (await handleOperation(request('POST', organisation, headers), organisation, ['domains', domainId, 'refresh']))
          .status,
      ).toBe(403);
    }

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('keeps members read-only but lets them log out and revokes the upstream session', async () => {
    principal.role = 'member';

    expect((await handleOperation(request('DELETE'), organisation, ['domains', domainId])).status).toBe(403);

    const response = await logout(request('POST'));

    expect(response.status).toBe(200);
    expect(response.headers.get('set-cookie')).toContain('Max-Age=0');
    expect(fetchMock.mock.calls.some(call => String(call[0]).endsWith('/auth/logout'))).toBe(true);
  });

  it('clears the local session even if upstream revocation is unavailable', async () => {
    fetchMock.mockRejectedValue(new Error('test network outage'));

    expect((await logout(request('POST'))).headers.get('set-cookie')).toContain('Max-Age=0');
  });

  it('forwards only a checked user credential and never a platform credential or tenant override header', async () => {
    const response = await handleOperation(request('POST'), organisation, ['domains', domainId, 'refresh']);

    expect(response.status).toBe(200);

    for (const [, options] of fetchMock.mock.calls) {
      expect(options.headers).toEqual({ Authorization: 'Bearer test-user-credential', Accept: 'application/json' });
      expect(options.cache).toBe('no-store');
      expect(options.redirect).toBe('error');
    }

    expect(await response.text()).not.toContain('must-not-leak');
  });

  it('does not expose upstream error messages', async () => {
    fetchMock.mockResolvedValue(Response.json({ error: 'secret-upstream-details' }, { status: 500 }));
    const response = await sessionInfo(request());

    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain('secret-upstream-details');
  });

  it('rate-limits even a valid session before another upstream call', async () => {
    for (let index = 0; index < 90; index += 1) {
      await authorize(request());
    }
    const response = await sessionInfo(request());

    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('60');
    expect(fetchMock).toHaveBeenCalledTimes(90);
  });

  it('blocks production upstream access from preview and requires an isolated staging origin', async () => {
    vi.stubEnv('APP_ENV', 'preview');

    await expect(citadelRequest('test', '/api/v1/domains')).rejects.toMatchObject({ status: 503 });

    vi.stubEnv('CITADEL_API_BASE_URL', 'https://citadel.stealthrdp.com');

    await expect(citadelRequest('test', '/api/v1/domains')).rejects.toMatchObject({ status: 503 });
    expect(fetchMock).not.toHaveBeenCalled();

    vi.stubEnv('CITADEL_API_BASE_URL', 'https://citadel-staging.example.invalid');
    await citadelRequest('test', '/api/v1/domains');

    expect(fetchMock.mock.calls[0]![0]).toBe('https://citadel-staging.example.invalid/api/v1/domains');
  });

  it('bounds upstream response size', async () => {
    fetchMock.mockResolvedValue(new Response('x'.repeat(1024 * 1024 + 1)));

    await expect(citadelRequest('test', '/api/v1/domains')).rejects.toMatchObject({ status: 502 });
  });

  it('does not provide an arbitrary proxy, settings writes, auth mutations or key creation', () => {
    for (const [path, method] of [
      ['admin/organizations', 'GET'],
      ['auth/login', 'POST'],
      ['api-keys', 'POST'],
      [`domains/${domainId}/policy`, 'PATCH'],
      [`domains/${domainId}/refresh/extra`, 'POST'],
      ['domains/../service', 'GET'],
    ]) {
      expect(() => resolveOperation(path!.split('/'), method!)).toThrow();
    }
  });

  it('does not forward browser query parameters or request bodies', async () => {
    const withQuery = new Request(`${request().url}?organization_id=${stranger}`, { headers: request().headers });

    expect((await handleOperation(withQuery, organisation, ['domains'])).status).toBe(400);

    const withBody = new Request(request('POST').url, { method: 'POST', headers: request('POST').headers, body: '{}' });

    expect((await handleOperation(withBody, organisation, ['domains', domainId, 'refresh'])).status).toBe(400);
  });

  it('projects only known display fields and removes log query strings and credentials', () => {
    const result = projectResource({
      settings: { enabled: true, access_token: 'hidden', api_key: 'hidden', headers: { Authorization: 'hidden' } },
      logs: [
        { path: '/api?secret=hidden', status: 200, reason: 'Bearer test-credential', html: '<script>hidden</script>' },
      ],
    });
    const text = JSON.stringify(result);

    expect(text).not.toContain('hidden');
    expect(text).not.toContain('test-credential');
    expect(text).toContain('[redacted]');
    expect(text).toContain('/api');
  });
});
