import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    logger.error({ err }, 'Health check failed');
    return NextResponse.json({ status: 'error' }, { status: 503 });
  }
}
