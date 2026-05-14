'use server';

import { redirect } from 'next/navigation';
import { isCorrectPassword } from '@/lib/auth/gate';
import { startSession, endSession } from '@/lib/auth/session';

export type AuthFormState = { error: string | null };

export async function signInAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const raw = formData.get('password');
  const password = typeof raw === 'string' ? raw : '';
  if (!password) {
    return { error: 'Enter the password.' };
  }
  if (!isCorrectPassword(password)) {
    return { error: 'Wrong password.' };
  }
  await startSession();
  redirect('/');
}

export async function signOutAction(): Promise<void> {
  await endSession();
  redirect('/signin');
}
