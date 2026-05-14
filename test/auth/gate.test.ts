import { describe, it, expect } from 'vitest';
import { isCorrectPassword, issueSessionToken, isValidSessionToken } from '@/lib/auth/gate';

// SITE_PASSWORD is set to 'test-shared-password' in test/global-setup.ts.

describe('password gate', () => {
  it('accepts the configured site password', () => {
    expect(isCorrectPassword('test-shared-password')).toBe(true);
  });

  it('rejects a wrong, empty, or whitespace-padded password', () => {
    expect(isCorrectPassword('not-the-password')).toBe(false);
    expect(isCorrectPassword('')).toBe(false);
    expect(isCorrectPassword('test-shared-password ')).toBe(false);
  });

  it('round-trips a freshly issued session token', () => {
    expect(isValidSessionToken(issueSessionToken())).toBe(true);
  });

  it('rejects missing or tampered session tokens', () => {
    expect(isValidSessionToken(undefined)).toBe(false);
    expect(isValidSessionToken('')).toBe(false);
    expect(isValidSessionToken('deadbeef')).toBe(false);
    expect(isValidSessionToken(`${issueSessionToken()}x`)).toBe(false);
  });
});
