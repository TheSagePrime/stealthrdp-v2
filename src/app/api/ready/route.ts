import { getReadinessResponse } from '@/features/runtime/readiness';

export const dynamic = 'force-dynamic';

export function GET() {
  const response = getReadinessResponse();

  return Response.json(response, { status: response.status === 'ready' ? 200 : 503 });
}
