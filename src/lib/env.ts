import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  DATABASE_URL: z.string().url(),

  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 characters'),
  AUTH_URL: z.string().url(),

  B2_ENDPOINT: z.string().url(),
  B2_REGION: z.string().default('auto'),
  B2_BUCKET: z.string().min(1),
  B2_ACCESS_KEY_ID: z.string().min(1),
  B2_SECRET_ACCESS_KEY: z.string().min(1),

  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const flat = parsed.error.flatten().fieldErrors;
  console.error('Invalid environment variables:', JSON.stringify(flat, null, 2));
  throw new Error('Invalid environment variables. See errors above.');
}

export const env = parsed.data;
