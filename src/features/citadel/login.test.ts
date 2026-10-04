import { Buffer } from 'node:buffer';
import { createHash, sign as cryptoSign, generateKeyPairSync, randomBytes } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET as authCallback } from '@/app/api/citadel/auth/callback/route';
import { GET as authStart } from '@/app/api/citadel/auth/start/route';
import { OidcError, verifyIdToken } from './oidc';
import { LOGIN_COOKIE, openSession, sealSession, SESSION_COOKIE } from './session';
import { resetSigningKeyCache } from './whmcs';

const ISSUER = 'https://idp.example.invalid';
const CLIENT_ID = 'stealthrdp-preview-client';
const CLIENT_SECRET = 'exposed-secret-must-never-be-used';
const REDIRECT_URI = 'https://preview.antah.de/api/citadel/auth/callback';
const PLATFORM_KEY = 'citadel_p_test_platform_key_0000000000';
const MINTED = 'minted-user-credential';
const WHMCS_ACCESS_TOKEN = 'whmcs-access-token';
const USER_ID = '11111111-1111-4111-8111-111111111111';
const ORG_ID = '22222222-2222-4222-8222-222222222222';
const EMAIL = 'customer@example.invalid';
const SITE = 'https://preview.antah.de';
const KID = 'test-signing-key';

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const publicJwk = publicKey.export({ format: 'jwk' }) as { kty: string; n: string; e: string };

type Handlers = {
  jwks: () => Response;
  token: () => Response;
  userinfo: () => Response;
  mint: () => Response;
  me: () => Response;
};

/* The nonce the browser sent on the last start request; the token endpoint echoes it. */
let currentNonce = '';

function base64url(value: unknown): string {
  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url');
}

/** Signs a token with the test key, exactly as an RS256 provider would. */
function idToken(claims: Record<string, unknown> = {}, header: Record<string, unknown> = {}): string {
  const now = Math.floor(Date.now() / 1000);
  const head = base64url({ alg: 'RS256', kid: KID, typ: 'JWT', ...header });
  const body = base64url({ iss: ISSUER, aud: CLIENT_ID, sub: 'whmcs-user-1', iat: now, exp: now + 300, ...claims });
  const signature = cryptoSign('RSA-SHA256', Buffer.from(`${head}.${body}`), privateKey).toString('base64url');
  return `${head}.${body}.${signature}`;
}

const defaults: Handlers = {
  jwks: () => Response.json({ keys: [{ ...publicJwk, alg: 'RS256', kid: KID, use: 'sig' }] }),
  token: () => Response.json({ id_token: idToken({ nonce: currentNonce }), access_token: WHMCS_ACCESS_TOKEN, token_type: 'Bearer', expires_in: 3600 }),
  userinfo: () => Response.json({ sub: 'whmcs-user-1', email: EMAIL, email_verified: true }),
  mint: () => Response.json({ access_token: MINTED, token_type: 'Bearer', expires_at: new Date(Date.now() + 3_600_000).toISOString() }),
  me: () =>
    Response.json({
      user: {
        id: USER_ID,
        email: EMAIL,
        organization_id: ORG_ID,
        organization_name: 'Test organisation',
        role: 'owner',
        email_verified: true,
        auth_type: 'session',
      },
    }),
};

let handlers: Handlers = defaults;
const fetchMock = vi.fn();

function setHandlers(overrides: Partial<Handlers>): void {
  handlers = { ...defaults, ...overrides };
  fetchMock.mockReset();
  fetchMock.mockImplementation(async (input: unknown) => {
    const url = String(input);
    if (url.endsWith('/oauth/certs.php')) {
      return handlers.jwks();
    }
    if (url.endsWith('/oauth/token.php')) {
      return handlers.token();
    }
    if (url.endsWith('/oauth/userinfo.php')) {
      return handlers.userinfo();
    }
    if (url.endsWith('/api/admin/platform/access-token')) {
      return handlers.mint();
    }
    if (url.endsWith('/api/v1/auth/me')) {
      return handlers.me();
    }
    if (url.endsWith('/api/v1/auth/logout')) {
      return Response.json({ ok: true });
    }
    throw new Error(`unexpected fetch: ${url}`);
  });
}

function startRequest(headers: HeadersInit = {}): Request {
  return new Request(`${SITE}/api/citadel/auth/start`, { headers });
}

function callbackRequest(params: Record<string, string>, cookie?: string): Request {
  const url = new URL(`${SITE}/api/citadel/auth/callback`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return new Request(url, { headers: cookie === undefined ? {} : { cookie } });
}

function cookieValue(header: string): string {
  return header.split(';')[0]!.split('=').slice(1).join('=');
}

function callFor(path: string): [string, RequestInit] | undefined {
  return (fetchMock.mock.calls as [string, RequestInit][]).find(call => String(call[0]).endsWith(path));
}

async function startLogin(): Promise<{ state: string; nonce: string; challenge: string; cookie: string }> {
  const response = await authStart(startRequest());
  const location = new URL(response.headers.get('location')!);
  currentNonce = location.searchParams.get('nonce')!;
  return {
    state: location.searchParams.get('state')!,
    nonce: currentNonce,
    challenge: location.searchParams.get('code_challenge')!,
    cookie: response.headers.getSetCookie()[0]!.split(';')[0]!,
  };
}

function failureCode(response: Response): string {
  return new URL(response.headers.get('location')!, SITE).searchParams.get('citadel_error') ?? '';
}

beforeEach(() => {
  currentNonce = '';
  vi.stubEnv('SESSION_SECRET', randomBytes(32).toString('base64'));
  vi.stubEnv('APP_ENV', 'production');
  vi.stubEnv('VERCEL_ENV', '');
  vi.stubEnv('SITE_URL', SITE);
  vi.stubEnv('CITADEL_API_BASE_URL', '');
  vi.stubEnv('WHMCS_OIDC_ISSUER', ISSUER);
  vi.stubEnv('WHMCS_OIDC_CLIENT_ID', CLIENT_ID);
  vi.stubEnv('WHMCS_OIDC_CLIENT_SECRET', CLIENT_SECRET);
  vi.stubEnv('CITADEL_LOGIN_REDIRECT_URI', REDIRECT_URI);
  vi.stubEnv('CITADEL_PLATFORM_API_KEY', PLATFORM_KEY);
  vi.stubEnv('CITADEL_PLATFORM_KEY_ALLOW_NON_PRODUCTION', '');
  globalThis.sagePrimeRateLimits?.clear();
  resetSigningKeyCache();
  setHandlers({});
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('signed ID token validation', () => {
  const keys = [{ kty: 'RSA' as const, kid: KID, alg: 'RS256', n: publicJwk.n, e: publicJwk.e }];
  const attempt = (token: string): string | null => {
    try {
      verifyIdToken({ token, issuer: ISSUER, audience: CLIENT_ID, nonce: 'expected-nonce', keys });
      return null;
    } catch (error) {
      return error instanceof OidcError ? error.code : 'unexpected';
    }
  };

  it('accepts a token that is correctly signed for this issuer, audience and nonce', () => {
    const verified = verifyIdToken({
      token: idToken({ nonce: 'expected-nonce' }),
      issuer: ISSUER,
      audience: CLIENT_ID,
      nonce: 'expected-nonce',
      keys,
    });

    expect(verified.subject).toBe('whmcs-user-1');
    expect(verified.emailVerified).toBe(false);
  });

  it('rejects a wrong or missing nonce, an unsigned token and an unknown key id', () => {
    expect(attempt(idToken({ nonce: 'other-nonce' }))).toBe('nonce_mismatch');
    expect(attempt(idToken())).toBe('nonce_mismatch');
    expect(attempt(idToken({ nonce: 'expected-nonce' }, { alg: 'none' }))).toBe('unsupported_algorithm');
    expect(attempt(idToken({ nonce: 'expected-nonce' }, { alg: 'HS256' }))).toBe('unsupported_algorithm');
    expect(attempt(idToken({ nonce: 'expected-nonce' }, { kid: 'not-our-key' }))).toBe('unknown_key');
  });

  it('rejects a foreign issuer, a foreign audience, an expired token and a tampered payload', () => {
    const now = Math.floor(Date.now() / 1000);
    const [header, , signature] = idToken({ nonce: 'expected-nonce' }).split('.') as [string, string, string];
    const forged = base64url({ iss: ISSUER, aud: CLIENT_ID, sub: 'attacker', iat: now, exp: now + 300, nonce: 'expected-nonce' });

    expect(attempt(idToken({ nonce: 'expected-nonce', iss: 'https://other.example.invalid' }))).toBe('wrong_issuer');
    expect(attempt(idToken({ nonce: 'expected-nonce', aud: 'another-client' }))).toBe('wrong_audience');
    expect(attempt(idToken({ nonce: 'expected-nonce', iat: now - 7200, exp: now - 3600 }))).toBe('expired_token');
    expect(attempt(`${header}.${forged}.${signature}`)).toBe('bad_signature');
  });
});

describe('WHMCS sign-in start', () => {
  it('sends an authorization-code request with state, nonce and S256 PKCE, and keeps every secret out of the URL', async () => {
    const response = await authStart(startRequest());
    const location = new URL(response.headers.get('location')!);

    expect(response.status).toBe(303);
    expect(`${location.origin}${location.pathname}`).toBe(`${ISSUER}/oauth/authorize.php`);
    expect(location.searchParams.get('response_type')).toBe('code');
    expect(location.searchParams.get('scope')).toBe('openid profile email');
    expect(location.searchParams.get('client_id')).toBe(CLIENT_ID);
    expect(location.searchParams.get('redirect_uri')).toBe(REDIRECT_URI);
    expect(location.searchParams.get('code_challenge_method')).toBe('S256');
    expect(location.searchParams.get('state')).toMatch(/^[\w-]{43}$/);
    expect(location.searchParams.get('nonce')).toMatch(/^[\w-]{43}$/);
    expect(location.searchParams.get('state')).not.toBe(location.searchParams.get('nonce'));
    expect(response.headers.get('location')).not.toContain(CLIENT_SECRET);
    expect(response.headers.get('location')).not.toContain(PLATFORM_KEY);
  });

  it('seals one host-only transaction cookie and never issues a session cookie', async () => {
    const response = await authStart(startRequest());
    const cookies = response.headers.getSetCookie();

    expect(cookies).toHaveLength(1);
    expect(cookies[0]).toContain(`${LOGIN_COOKIE}=`);
    expect(cookies[0]).not.toContain(`${SESSION_COOKIE}=`);

    for (const flag of ['Path=/', 'HttpOnly', 'Secure', 'SameSite=Lax']) {
      expect(cookies[0]).toContain(flag);
    }

    expect(cookies[0]).not.toContain('Domain=');
    expect(Number(/Max-Age=(\d+)/.exec(cookies[0]!)?.[1])).toBeLessThanOrEqual(600);
  });

  it('refuses a cross-site start so another site cannot start a sign-in for this browser', async () => {
    const response = await authStart(startRequest({ 'sec-fetch-site': 'cross-site' }));

    expect(response.status).toBe(403);
    expect(response.headers.get('set-cookie')).toBeNull();
    expect(response.headers.get('location')).toBeNull();
  });

  it('reports missing configuration as a public code instead of issuing a transaction', async () => {
    vi.stubEnv('WHMCS_OIDC_CLIENT_SECRET', '');
    const response = await authStart(startRequest());

    expect(response.status).toBe(303);
    expect(failureCode(response)).toBe('unconfigured');
    expect(response.headers.get('set-cookie')).toBeNull();
  });

  it('reports a missing session secret as a public code instead of a generic failure', async () => {
    vi.stubEnv('SESSION_SECRET', '');
    resetSigningKeyCache();
    const response = await authStart(startRequest());

    expect(response.status).toBe(303);
    expect(failureCode(response)).toBe('unconfigured');
    expect(response.headers.get('set-cookie')).toBeNull();
  });

  it('rate limits sign-in starts', async () => {
    for (let attempt = 0; attempt < 20; attempt += 1) {
      await authStart(startRequest());
    }
    const blocked = await authStart(startRequest());

    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('Retry-After')).toBe('60');
  });
});

describe('WHMCS OIDC callback', () => {
  it('verifies the code, the PKCE binding, the ID token and the minted principal, then seals one session', async () => {
    const { state, nonce, challenge, cookie } = await startLogin();
    const response = await authCallback(callbackRequest({ code: 'authorization-code', state }, cookie));
    const cookies = response.headers.getSetCookie();

    expect(response.status).toBe(303);
    expect(new URL(response.headers.get('location')!, SITE).pathname).toBe('/citadel/app');
    expect(failureCode(response)).toBe('');
    expect(nonce).toMatch(/^[\w-]{43}$/);

    const form = new URLSearchParams(String(callFor('/oauth/token.php')![1].body));

    expect(form.get('grant_type')).toBe('authorization_code');
    expect(form.get('code')).toBe('authorization-code');
    expect(form.get('client_id')).toBe(CLIENT_ID);
    expect(form.get('redirect_uri')).toBe(REDIRECT_URI);
    expect(form.get('client_secret')).toBe(CLIENT_SECRET);
    // The S256 challenge the browser carried must match the verifier posted from the server.
    expect(challenge).toBe(createHash('sha256').update(form.get('code_verifier')!).digest('base64url'));

    const mint = callFor('/api/admin/platform/access-token')!;

    expect((mint[1].headers as Record<string, string>).Authorization).toBe(`Bearer ${PLATFORM_KEY}`);
    expect(JSON.parse(String(mint[1].body))).toEqual({ email: EMAIL });
    expect((callFor('/api/v1/auth/me')![1].headers as Record<string, string>).Authorization).toBe(`Bearer ${MINTED}`);

    const sessionHeader = cookies.find(header => header.startsWith(`${SESSION_COOKIE}=`))!;

    expect(cookies.some(header => header.startsWith(`${LOGIN_COOKIE}=`) && header.includes('Max-Age=0'))).toBe(true);
    expect(sessionHeader).not.toContain(MINTED);
    expect(sessionHeader).not.toContain(WHMCS_ACCESS_TOKEN);
    expect(sessionHeader).not.toContain(CLIENT_SECRET);

    const session = openSession(cookieValue(sessionHeader));

    expect(session?.bearer).toBe(MINTED);
    expect(session?.email).toBe(EMAIL);
    expect(session?.subject).toBe(USER_ID);
    expect(session?.expiresAt).toBeGreaterThan(Math.floor(Date.now() / 1000));
    expect(response.headers.get('cache-control')).toContain('no-store');
    expect(response.headers.get('referrer-policy')).toBe('no-referrer');
  });

  it('refuses a state that does not match the transaction and never calls the token endpoint', async () => {
    const { state, cookie } = await startLogin();
    const response = await authCallback(callbackRequest({ code: 'authorization-code', state: `${state}x` }, cookie));

    expect(response.status).toBe(303);
    expect(failureCode(response)).toBe('state');
    expect(callFor('/oauth/token.php')).toBeUndefined();
    expect(callFor('/api/admin/platform/access-token')).toBeUndefined();
  });

  it('refuses a replayed callback and one without a transaction cookie', async () => {
    const { state, cookie } = await startLogin();
    const first = await authCallback(callbackRequest({ code: 'authorization-code', state }, cookie));
    const replay = await authCallback(callbackRequest({ code: 'authorization-code', state }, cookie));
    const foreign = await authCallback(callbackRequest({ code: 'authorization-code', state }));

    expect(failureCode(first)).toBe('');
    expect(failureCode(replay)).toBe('expired');
    expect(failureCode(foreign)).toBe('expired');
  });

  it('refuses a session cookie presented as a sign-in transaction', async () => {
    const session = sealSession({ bearer: MINTED, email: EMAIL, subject: USER_ID, expiresAt: Math.floor(Date.now() / 1000) + 900 });
    const response = await authCallback(callbackRequest({ code: 'authorization-code', state: 'x'.repeat(43) }, `${LOGIN_COOKIE}=${session.value}`));

    expect(failureCode(response)).toBe('expired');
    expect(callFor('/oauth/token.php')).toBeUndefined();
  });

  it('refuses a provider error response and an incomplete callback', async () => {
    const denied = await authCallback(callbackRequest({ error: 'access_denied' }));
    const { cookie } = await startLogin();
    const incomplete = await authCallback(callbackRequest({ state: 'x'.repeat(43) }, cookie));

    expect(failureCode(denied)).toBe('denied');
    expect(failureCode(incomplete)).toBe('invalid_request');
  });

  it('fails closed when the provider does not return the nonce this browser sent', async () => {
    const { state, cookie } = await startLogin();
    setHandlers({
      token: () => Response.json({ id_token: idToken({ email: EMAIL, email_verified: true }), access_token: WHMCS_ACCESS_TOKEN }),
    });

    const response = await authCallback(callbackRequest({ code: 'authorization-code', state }, cookie));

    expect(failureCode(response)).toBe('nonce');
    expect(callFor('/api/admin/platform/access-token')).toBeUndefined();
  });

  it('requires a verified email, from the token or from userinfo for the same subject', async () => {
    const first = await startLogin();
    setHandlers({ userinfo: () => Response.json({ sub: 'whmcs-user-1', email: EMAIL, email_verified: false }) });
    const unverified = await authCallback(callbackRequest({ code: 'authorization-code', state: first.state }, first.cookie));

    const second = await startLogin();
    setHandlers({ userinfo: () => Response.json({ sub: 'another-whmcs-user', email: EMAIL, email_verified: true }) });
    const mismatched = await authCallback(callbackRequest({ code: 'authorization-code', state: second.state }, second.cookie));

    expect(failureCode(unverified)).toBe('email_unverified');
    expect(failureCode(mismatched)).toBe('email_unverified');
    expect(callFor('/api/admin/platform/access-token')).toBeUndefined();
  });

  it('accepts an email that only the signed token carries', async () => {
    const { state, cookie } = await startLogin();
    setHandlers({ token: () => Response.json({ id_token: idToken({ nonce: currentNonce, email: EMAIL, email_verified: true }) }) });

    const response = await authCallback(callbackRequest({ code: 'authorization-code', state }, cookie));

    expect(failureCode(response)).toBe('');
    expect(callFor('/oauth/userinfo.php')).toBeUndefined();
  });

  it('rejects a minted credential for another account and revokes it', async () => {
    const { state, cookie } = await startLogin();
    setHandlers({
      me: () =>
        Response.json({
          user: {
            id: USER_ID,
            email: 'someone.else@example.invalid',
            organization_id: ORG_ID,
            organization_name: 'Test organisation',
            role: 'owner',
            email_verified: true,
            auth_type: 'session',
          },
        }),
    });

    const response = await authCallback(callbackRequest({ code: 'authorization-code', state }, cookie));

    expect(failureCode(response)).toBe('identity');
    expect(callFor('/api/v1/auth/logout')).toBeDefined();
    expect(response.headers.getSetCookie().some(header => header.startsWith(`${SESSION_COOKIE}=`) && header.includes('Max-Age=0'))).toBe(false);
  });

  it('reports a refused exchange and an unconfigured platform key without leaking either secret', async () => {
    const first = await startLogin();
    setHandlers({ token: () => Response.json({ error: 'invalid_grant' }, { status: 400 }) });
    const rejected = await authCallback(callbackRequest({ code: 'authorization-code', state: first.state }, first.cookie));

    const second = await startLogin();
    setHandlers({});
    vi.stubEnv('CITADEL_PLATFORM_API_KEY', '');
    const unconfigured = await authCallback(callbackRequest({ code: 'authorization-code', state: second.state }, second.cookie));

    expect(failureCode(rejected)).toBe('provider');
    expect(failureCode(unconfigured)).toBe('unconfigured');

    for (const response of [rejected, unconfigured]) {
      const text = await response.text();

      expect(text).not.toContain(CLIENT_SECRET);
      expect(text).not.toContain(PLATFORM_KEY);
      expect(text).not.toContain(WHMCS_ACCESS_TOKEN);
      expect(response.headers.get('location')).not.toContain(PLATFORM_KEY);
    }
  });

  it('refuses to use a production platform key outside production', async () => {
    const { state, cookie } = await startLogin();
    vi.stubEnv('APP_ENV', 'preview');

    const response = await authCallback(callbackRequest({ code: 'authorization-code', state }, cookie));

    expect(failureCode(response)).toBe('unconfigured');
    expect(callFor('/api/admin/platform/access-token')).toBeUndefined();
  });

  it('rate limits callbacks', async () => {
    for (let attempt = 0; attempt < 20; attempt += 1) {
      await authCallback(callbackRequest({ error: 'access_denied' }));
    }
    const blocked = await authCallback(callbackRequest({ error: 'access_denied' }));

    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('Retry-After')).toBe('60');
  });
});
