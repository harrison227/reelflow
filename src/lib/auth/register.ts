import { ConflictError } from '../errors';
import { hashPassword } from './password';
import { createUser, findUserByEmail } from './users';
import type { Role } from './permissions';

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type RegisteredUser = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
};

export async function registerUser(input: RegisterInput): Promise<RegisteredUser> {
  const email = input.email.trim().toLowerCase();
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new ConflictError('An account with that email already exists.');
  }
  const passwordHash = await hashPassword(input.password);
  // Whoever signs up is running their own studio view — give them owner.
  const user = await createUser({ name: input.name.trim(), email, passwordHash, role: 'owner' });
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
