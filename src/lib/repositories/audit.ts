import { db } from '../db';
import { auditLog } from '../db/schema';

export async function insertAuditEntry(params: {
  actorId: string;
  action: string;
  deliverableId?: string;
  before?: unknown;
  after?: unknown;
}): Promise<void> {
  await db.insert(auditLog).values({
    actorId: params.actorId,
    action: params.action,
    deliverableId: params.deliverableId,
    before: (params.before ?? null) as never,
    after: (params.after ?? null) as never,
  });
}
