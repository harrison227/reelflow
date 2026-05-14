import * as auditRepo from '../repositories/audit';

export type AuditAction =
  | 'client.created'
  | 'client.updated'
  | 'client.archived'
  | 'deliverable.created'
  | 'deliverable.updated'
  | 'deliverable.status_changed'
  | 'deliverable.assigned'
  | 'deliverable.approved'
  | 'deliverable.archived'
  | 'asset.uploaded'
  | 'asset.deleted'
  | 'comment.created'
  | 'revision.opened'
  | 'revision.closed';

export async function recordAuditEvent(params: {
  actorId: string;
  action: AuditAction;
  deliverableId?: string;
  before?: unknown;
  after?: unknown;
}): Promise<void> {
  await auditRepo.insertAuditEntry(params);
}
