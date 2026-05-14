import { describe, expect, it } from 'vitest';
import { db } from '@/lib/db';
import { users, auditLog } from '@/lib/db/schema';
import { ForbiddenError, NotFoundError } from '@/lib/errors';
import * as service from '@/lib/services/clients';
import type { Role } from '@/lib/auth/permissions';
import { eq } from 'drizzle-orm';

async function seedUser(role: Role, suffix: string) {
  const [row] = await db
    .insert(users)
    .values({
      name: `Test ${role}`,
      email: `${role}-${suffix}@test.example.com`,
      role,
    })
    .returning();
  if (!row) throw new Error('Failed to seed user');
  return row;
}

describe('clients service', () => {
  it('lets the owner create a client and records an audit entry', async () => {
    const owner = await seedUser('owner', 'create');
    const client = await service.createClient(
      { id: owner.id, role: 'owner' },
      { name: 'Josh Harrison Realty', color: '#3B82F6' },
    );

    expect(client.name).toBe('Josh Harrison Realty');
    expect(client.color).toBe('#3B82F6');

    const entries = await db.select().from(auditLog).where(eq(auditLog.actorId, owner.id));
    expect(entries).toHaveLength(1);
    expect(entries[0]?.action).toBe('client.created');
  });

  it('lets the VA create a client', async () => {
    const va = await seedUser('va', 'create');
    const client = await service.createClient(
      { id: va.id, role: 'va' },
      { name: 'Mark Couré Wealth', color: '#10B981' },
    );
    expect(client.name).toBe('Mark Couré Wealth');
  });

  it('blocks editors from creating clients', async () => {
    const editor = await seedUser('editor', 'create');
    await expect(
      service.createClient(
        { id: editor.id, role: 'editor' },
        { name: 'Wolli Creek Properties', color: '#F59E0B' },
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('blocks the VA from archiving a client', async () => {
    const owner = await seedUser('owner', 'archive-owner');
    const va = await seedUser('va', 'archive-va');
    const client = await service.createClient(
      { id: owner.id, role: 'owner' },
      { name: 'To be archived', color: '#888888' },
    );
    await expect(service.archiveClient({ id: va.id, role: 'va' }, client.id)).rejects.toBeInstanceOf(
      ForbiddenError,
    );
  });

  it('returns NotFoundError when reading a missing client', async () => {
    const owner = await seedUser('owner', 'missing');
    await expect(
      service.getClient({ id: owner.id, role: 'owner' }, '00000000-0000-0000-0000-000000000000'),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('updates a client and records before/after in the audit log', async () => {
    const owner = await seedUser('owner', 'update');
    const created = await service.createClient(
      { id: owner.id, role: 'owner' },
      { name: 'Original', color: '#000000' },
    );
    const updated = await service.updateClient({ id: owner.id, role: 'owner' }, created.id, {
      name: 'Renamed',
    });
    expect(updated.name).toBe('Renamed');
    expect(updated.color).toBe('#000000');

    const entries = await db
      .select()
      .from(auditLog)
      .where(eq(auditLog.actorId, owner.id));
    const updateEntry = entries.find((e) => e.action === 'client.updated');
    expect(updateEntry).toBeDefined();
  });

  it('archives a client (sets archivedAt)', async () => {
    const owner = await seedUser('owner', 'archive');
    const created = await service.createClient(
      { id: owner.id, role: 'owner' },
      { name: 'Archive me', color: '#CCCCCC' },
    );
    const archived = await service.archiveClient({ id: owner.id, role: 'owner' }, created.id);
    expect(archived.archivedAt).not.toBeNull();
  });
});
