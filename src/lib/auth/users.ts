import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';
import type { Role } from './permissions';

export type AuthUser = typeof users.$inferSelect;

export async function findUserByEmail(email: string): Promise<AuthUser | null> {
  const [row] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return row ?? null;
}

export async function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
}): Promise<AuthUser> {
  const [row] = await db
    .insert(users)
    .values({
      name: input.name,
      email: input.email,
      passwordHash: input.passwordHash,
      role: input.role,
    })
    .returning();
  if (!row) throw new Error('Failed to create user');
  return row;
}
