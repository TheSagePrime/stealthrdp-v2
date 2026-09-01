import { getHealthResponse } from '@/features/runtime/health';

export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json(getHealthResponse());
}
