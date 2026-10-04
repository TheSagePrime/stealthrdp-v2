import { errorResponse } from '@/features/citadel/http';
import { completeLogin, LoginError } from '@/features/citadel/login';
import { loginCookie, sealSession, sessionCookie } from '@/features/citadel/session';
import { CitadelError } from '@/features/citadel/upstream';
import { consumeRateLimit } from '@/features/security/rate-limit';
import { sensitiveRedirect } from '@/features/security/response';

export const runtime = 'nodejs';

const APP_PATH = '/citadel/app';

/**
 * The only response that can create a Citadel session cookie. It is reachable only
 * with a code, a matching state and the sealed transaction cookie for this browser.
 */
export async function GET(request: Request): Promise<Response> {
  try {
    if (!consumeRateLimit('citadel:auth:callback', { limit: 20 }).allowed) {
      throw new CitadelError(429, 'Please wait before trying again.');
    }
    const identity = await completeLogin(new URL(request.url).searchParams, request.headers.get('cookie') ?? '');
    let sealed: { value: string; maxAge: number };
    try {
      sealed = sealSession(identity);
    } catch {
      throw new LoginError('unconfigured', 503);
    }
    const response = sensitiveRedirect(APP_PATH, 303);
    response.headers.set('Referrer-Policy', 'no-referrer');
    response.headers.append('Set-Cookie', sessionCookie(sealed.value, sealed.maxAge));
    // One transaction, one sign-in: the transaction cookie never survives the callback.
    response.headers.append('Set-Cookie', loginCookie('', 0));
    return response;
  } catch (error) {
    if (error instanceof LoginError) {
      const response = sensitiveRedirect(`${APP_PATH}?citadel_error=${error.code}`, 303);
      response.headers.set('Referrer-Policy', 'no-referrer');
      response.headers.append('Set-Cookie', loginCookie('', 0));
      return response;
    }
    return errorResponse(error);
  }
}
