import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().trim().toLowerCase().email('Enter a valid email').max(200),
  password: z.string().min(8, 'Password must be at least 8 characters').max(200),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
});

export type SignInInput = z.infer<typeof signInSchema>;
