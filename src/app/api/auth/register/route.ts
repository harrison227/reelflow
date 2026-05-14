import { NextResponse, type NextRequest } from 'next/server';
import { registerUser } from '@/lib/auth/register';
import { registerSchema } from '@/lib/validators/auth';
import { toHttpResponse } from '@/lib/errors/http';

export async function POST(req: NextRequest) {
  try {
    const body = registerSchema.parse(await req.json());
    const user = await registerUser(body);
    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    return toHttpResponse(err);
  }
}
