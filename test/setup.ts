import { afterAll, beforeEach } from 'vitest';
import postgres from 'postgres';

const TABLES = [
  'audit_log',
  'notifications',
  'comments',
  'revision_threads',
  'assets',
  'deliverables',
  'clients',
  'verification_token',
  'session',
  'account',
  '"user"',
];

let truncator: ReturnType<typeof postgres> | undefined;

function getTruncator() {
  if (!truncator) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not set in test environment');
    truncator = postgres(url, { max: 1 });
  }
  return truncator;
}

beforeEach(async () => {
  const sql = getTruncator();
  await sql.unsafe(`TRUNCATE TABLE ${TABLES.join(', ')} RESTART IDENTITY CASCADE`);
});

afterAll(async () => {
  await truncator?.end();
});
