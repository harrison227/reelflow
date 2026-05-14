import { NextResponse, type NextRequest } from 'next/server';
import { requireActor } from '@/lib/auth/session';
import { toHttpResponse } from '@/lib/errors/http';
import { createClientSchema } from '@/lib/validators/clients';
import * as service from '@/lib/services/clients';

export async function GET() {
  try {
    const actor = await requireActor();
    const clients = await service.listClients(actor);
    return NextResponse.json({ clients });
  } catch (err) {
    return toHttpResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const actor = await requireActor();
    const body = createClientSchema.parse(await req.json());
    const client = await service.createClient(actor, body);
    return NextResponse.json({ client }, { status: 201 });
  } catch (err) {
    return toHttpResponse(err);
  }
}
