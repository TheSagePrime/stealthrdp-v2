import { authorize, errorResponse, privateJson } from '@/features/citadel/http';

export const runtime = 'nodejs';

export async function GET(request: Request): Promise<Response> {
  try {
    const { session, principal } = await authorize(request);
    return privateJson({
      email: principal.email,
      role: principal.role,
      organisation: { id: principal.organization_id, name: principal.organization_name },
      csrf: session.csrf,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
