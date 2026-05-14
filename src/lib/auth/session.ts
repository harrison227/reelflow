import { cookies } from 'next/headers';
import { UnauthorizedError } from '../errors';
import { env } from '../env';
import type { Actor } from './permissions';
import { issueSessionToken, isValidSessionToken } from './gate';

const SESSION_COOKIE = 'reelflow_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function startSession(): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, issueSessionToken(), {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function hasValidSession(): Promise<boolean> {
  const jar = await cookies();
  return isValidSessionToken(jar.get(SESSION_COOKIE)?.value);
}

// The shared password grants full studio access — anyone through the gate
// acts as the owner. There are no per-user roles in the password-gate model.
export async function requireActor(): Promise<Actor> {
  if (!(await hasValidSession())) {
    throw new UnauthorizedError();
  }
  return { id: 'studio', role: 'owner' };
}
