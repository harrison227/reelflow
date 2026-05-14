import { NextResponse, type NextRequest } from 'next/server';
import { requireActor } from '@/lib/auth/session';
import { toHttpResponse } from '@/lib/errors/http';
import { clientIdParam, updateClientSchema } from '@/lib/validators/clients';
import * as service from '@/lib/services/clients';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = clientIdParam.parse(await ctx.params);
    const actor = await requireActor();
    const client = await service.getClient(actor, id);
    return NextResponse.json({ client });
  } catch (err) {
    return toHttpResponse(err);
  }
}

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = clientIdParam.parse(await ctx.params);
    const actor = await requireActor();
    const body = updateClientSchema.parse(await req.json());
    const client = await service.updateClient(actor, id, body);
    return NextResponse.json({ client });
  } catch (err) {
    return toHttpResponse(err);
  }
}

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = clientIdParam.parse(await ctx.params);
    const actor = await requireActor();
    const client = await service.archiveClient(actor, id);
    return NextResponse.json({ client });
  } catch (err) {
    return toHttpResponse(err);
  }
}
