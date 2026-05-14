import { UnauthorizedError } from '../errors';
import { auth } from './index';
import type { Actor } from './permissions';

export async function requireActor(): Promise<Actor> {
  const session = await auth();
  if (!session?.user?.id || !session.user.role) {
    throw new UnauthorizedError();
  }
  return { id: session.user.id, role: session.user.role };
}
