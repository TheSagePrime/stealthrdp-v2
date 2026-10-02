import { handleOperation } from '@/features/citadel/operations';

export const runtime = 'nodejs';

type Context = { params: Promise<{ organisation: string; resource: string[] }> };

async function handle(request: Request, context: Context): Promise<Response> {
  const { organisation, resource } = await context.params;
  return handleOperation(request, organisation, resource);
}

export { handle as DELETE, handle as GET, handle as POST };
