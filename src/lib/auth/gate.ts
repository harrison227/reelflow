import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '../env';

// The workspace is protected by a single shared password. There are no
// per-user accounts: anyone who knows the password gets in. AUTH_SECRET keys
// every HMAC here, so a leaked cookie can't be forged without the server key.

function hmac(input: string): Buffer {
  return createHmac('sha256', env.AUTH_SECRET).update(input).digest();
}

// timingSafeEqual throws on length mismatch, so guard the length first.
function constantTimeEqual(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b);
}

export function isCorrectPassword(input: string): boolean {
  return constantTimeEqual(hmac(input), hmac(env.SITE_PASSWORD));
}

// The session cookie carries no data — it's an HMAC of a fixed marker whose
// only job is to prove "this browser entered the right password".
export function issueSessionToken(): string {
  return hmac('reelflow:session:v1').toString('hex');
}

export function isValidSessionToken(value: string | undefined): boolean {
  if (!value) return false;
  return constantTimeEqual(Buffer.from(value), Buffer.from(issueSessionToken()));
}
