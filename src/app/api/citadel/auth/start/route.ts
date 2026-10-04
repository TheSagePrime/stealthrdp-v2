import { errorResponse } from '@/features/citadel/http';
import { beginLogin, LoginError } from '@/features/citadel/login';
import { CitadelError } from '@/features/citadel/upstream';
import { consumeRateLimit } from '@/features/security/rate-limit';
import { sensitiveRedirect } from '@/features/security/response';

export const runtime = 'nodejs';

const APP_PATH = '/citadel/app';

/** Failures return to the dashboard with a public code only. No provider detail, no token. */
function failureRedirect(code: string): Response {
  const response = sensitiveRedirect(`${APP_PATH}?citadel_error=${code}`, 303);
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}

/**
 * Starts the WHMCS OpenID Connect sign-in. The browser navigates here with a full
 * document request, so the sealed transaction cookie and the cross-site redirect
 * to WHMCS both work without any script on the page.
 */
export async function GET(request: Request): Promise<Response> {
  try {
    if (!consumeRateLimit('citadel:auth:start', { limit: 20 }).allowed) {
      throw new CitadelError(429, 'Please wait before trying again.');
    }
    /* Login CSRF: a cross-site navigation must not start a sign-in for this browser. */
    if (request.headers.get('sec-fetch-site') === 'cross-site') {
      throw new CitadelError(403, 'Start the sign-in from this site.');
    }
    const { location, cookie } = beginLogin();
    const response = sensitiveRedirect(location, 303);
    response.headers.append('Set-Cookie', cookie);
    return response;
  } catch (error) {
    if (error instanceof LoginError) {
      return failureRedirect(error.code);
    }
    return errorResponse(error);
  }
}
