import { Buffer } from 'node:buffer';
import { timingSafeEqual } from 'node:crypto';

import { z } from 'zod';
import { isSameOriginMutation } from '@/features/security/origin';
import { consumeRateLimit } from '@/features/security/rate-limit';
import { sensitiveJson } from '@/features/security/response';
import { openSession, SESSION_COOKIE } from './session';
import { CitadelError, citadelRequest } from './upstream';
import 'server-only';

const principalSchema = z.object({
  user: z.object({
    id: z.uuid(),
    email: z.email(),
    organization_id: z.uuid(),
    organization_name: z.string().max(200),
    role: z.enum(['owner', 'admin', 'member']),
    email_verified: z.literal(true),
    auth_type: z.literal('session'),
  }),
});

export function privateJson(body: unknown, status = 200, headers?: HeadersInit): Response {
  const response = sensitiveJson(body, { status, headers });
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  response.headers.set('Referrer-Policy', 'no-referrer');
  if (status === 429) {
    response.headers.set('Retry-After', '60');
  }
  return response;
}

export function errorResponse(error: unknown): Response {
  return error instanceof CitadelError
    ? privateJson({ error: error.message }, error.status)
    : privateJson({ error: 'Citadel is temporarily unavailable.' }, 502);
}

export function sessionForRequest(request: Request, mutation = false) {
  // An aggregate anonymous bucket cannot be evaded by spoofing forwarding headers.
  if (!consumeRateLimit('citadel:requests', { limit: 600 }).allowed) {
    throw new CitadelError(429, 'Please wait before trying again.');
  }
  const cookie = request.headers
    .get('cookie')
    ?.split(';')
    .map(part => part.trim())
    .find(part => part.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);
  const session = openSession(cookie);
  if (!session) {
    throw new CitadelError(401, 'Sign in with your StealthRDP account to continue.');
  }
  if (!consumeRateLimit(`citadel:subject:${session.subject}`, { limit: 90 }).allowed) {
    throw new CitadelError(429, 'Please wait before trying again.');
  }
  if (mutation) {
    const csrf = request.headers.get('x-citadel-csrf') || '';
    if (
      !isSameOriginMutation(request)
      || !/^[a-f0-9]{64}$/.test(csrf)
      || !timingSafeEqual(Buffer.from(csrf), Buffer.from(session.csrf))
    ) {
      throw new CitadelError(403, 'Refresh the dashboard and try again.');
    }
  }
  return session;
}

export async function authorize(request: Request, mutation = false) {
  const session = sessionForRequest(request, mutation);
  // Revalidate membership and revocation with the user-scoped credential on EVERY request.
  const parsed = principalSchema.safeParse(await citadelRequest(session.bearer, '/api/v1/auth/me'));
  if (!parsed.success) {
    throw new CitadelError(401, 'Your Citadel session could not be verified.');
  }
  const principal = parsed.data.user;
  if (principal.id !== session.subject || principal.email.toLowerCase() !== session.email.toLowerCase()) {
    throw new CitadelError(401, 'Your Citadel session could not be verified.');
  }
  return { session, principal };
}

export function checkOrganisation(principal: { organization_id: string }, organisation: string): void {
  if (principal.organization_id !== organisation) {
    throw new CitadelError(403, 'This organisation is not available to your account.');
  }
}
