import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

let container: StartedPostgreSqlContainer | undefined;

export async function setup() {
  container = await new PostgreSqlContainer('postgres:16-alpine').start();
  const uri = container.getConnectionUri();

  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = uri;
  process.env.AUTH_SECRET = 'test-secret-must-be-at-least-32-characters-long';
  process.env.AUTH_URL = 'http://localhost:3000';
  process.env.EMAIL_FROM = 'test@example.com';
  process.env.B2_ENDPOINT = 'http://localhost:9000';
  process.env.B2_REGION = 'auto';
  process.env.B2_BUCKET = 'test';
  process.env.B2_ACCESS_KEY_ID = 'test';
  process.env.B2_SECRET_ACCESS_KEY = 'test';
  process.env.LOG_LEVEL = 'error';

  const migrationsFolder = resolve('./src/lib/db/migrations');
  if (!existsSync(migrationsFolder)) {
    throw new Error(
      `Migrations folder not found at ${migrationsFolder}. Run \`pnpm db:generate\` before running tests.`,
    );
  }

  const sql = postgres(uri);
  const db = drizzle(sql);
  await migrate(db, { migrationsFolder });
  await sql.end();
}

export async function teardown() {
  await container?.stop();
}
