'use server';

import { AuthError } from 'next-auth';
import { signIn, signOut } from '@/lib/auth';
import { registerUser } from '@/lib/auth/register';
import { registerSchema, signInSchema } from '@/lib/validators/auth';
import { ConflictError } from '@/lib/errors';

export type AuthFormState = { error: string | null };

export async function signInAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Enter your email and password.' };
  }
  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: '/',
    });
  } catch (error) {
    // A successful sign-in throws a redirect — that must propagate.
    if (error instanceof AuthError) return { error: 'Wrong email or password.' };
    throw error;
  }
  return { error: null };
}

export async function signUpAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Check your details and try again.' };
  }
  try {
    await registerUser(parsed.data);
  } catch (error) {
    if (error instanceof ConflictError) return { error: error.message };
    throw error;
  }
  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: '/',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Account created, but sign-in failed. Try logging in.' };
    }
    throw error;
  }
  return { error: null };
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: '/signin' });
}
