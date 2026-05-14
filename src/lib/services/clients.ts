import { NotFoundError } from '../errors';
import { assertCan, type Actor } from '../auth/permissions';
import * as repo from '../repositories/clients';
import { recordAuditEvent } from './audit';
import type { CreateClientInput, UpdateClientInput } from '../validators/clients';

export async function listClients(actor: Actor) {
  assertCan(actor.role, 'client.read');
  return repo.listActive();
}

export async function getClient(actor: Actor, id: string) {
  assertCan(actor.role, 'client.read');
  const client = await repo.findById(id);
  if (!client) throw new NotFoundError('Client');
  return client;
}

export async function createClient(actor: Actor, input: CreateClientInput) {
  assertCan(actor.role, 'client.write');
  const client = await repo.insert(input);
  await recordAuditEvent({ actorId: actor.id, action: 'client.created', after: client });
  return client;
}

export async function updateClient(actor: Actor, id: string, input: UpdateClientInput) {
  assertCan(actor.role, 'client.write');
  const before = await repo.findById(id);
  if (!before) throw new NotFoundError('Client');
  const after = await repo.update(id, input);
  if (!after) throw new NotFoundError('Client');
  await recordAuditEvent({ actorId: actor.id, action: 'client.updated', before, after });
  return after;
}

export async function archiveClient(actor: Actor, id: string) {
  assertCan(actor.role, 'client.delete');
  const before = await repo.findById(id);
  if (!before) throw new NotFoundError('Client');
  const after = await repo.archive(id);
  if (!after) throw new NotFoundError('Client');
  await recordAuditEvent({ actorId: actor.id, action: 'client.archived', before, after });
  return after;
}
