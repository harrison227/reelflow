import { desc, eq, isNull } from 'drizzle-orm';
import { db } from '../db';
import { clients } from '../db/schema';
import type { CreateClientInput, UpdateClientInput } from '../validators/clients';

export async function listActive() {
  return db.select().from(clients).where(isNull(clients.archivedAt)).orderBy(desc(clients.createdAt));
}

export async function findById(id: string) {
  const [row] = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return row ?? null;
}

export async function insert(data: CreateClientInput) {
  const [row] = await db.insert(clients).values(data).returning();
  if (!row) throw new Error('Failed to insert client');
  return row;
}

export async function update(id: string, data: UpdateClientInput) {
  const [row] = await db
    .update(clients)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(clients.id, id))
    .returning();
  return row ?? null;
}

export async function archive(id: string) {
  const [row] = await db
    .update(clients)
    .set({ archivedAt: new Date(), updatedAt: new Date() })
    .where(eq(clients.id, id))
    .returning();
  return row ?? null;
}
