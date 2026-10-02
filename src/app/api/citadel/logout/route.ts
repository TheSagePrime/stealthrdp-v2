import { errorResponse, privateJson, sessionForRequest } from '@/features/citadel/http';
import { sessionCookie } from '@/features/citadel/session';
import { CitadelError, citadelRequest } from '@/features/citadel/upstream';

export const runtime = 'nodejs';

export async function POST(request: Request): Promise<Response> {
  try {
    const session = sessionForRequest(request, true);
    try {
      await citadelRequest(session.bearer, '/api/v1/auth/logout', 'POST');
    } catch {
      // Always clear the local session; the upstream credential expires independently.
    }
    return privateJson({ ok: true }, 200, { 'Set-Cookie': sessionCookie('', 0) });
  } catch (error) {
    const response = errorResponse(error);
    if (error instanceof CitadelError && error.status === 401) {
      response.headers.set('Set-Cookie', sessionCookie('', 0));
    }
    return response;
  }
}
