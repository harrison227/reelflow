import { db } from '../src/lib/db';
import { clients, users } from '../src/lib/db/schema';

async function seed() {
  const ownerEmail = process.env.SEED_OWNER_EMAIL ?? 'harrison@macourtmedia.com.au';

  await db
    .insert(users)
    .values([
      { email: ownerEmail, name: 'Harrison', role: 'owner' },
      { email: 'editor@reelflow.local', name: 'Sam (Editor)', role: 'editor' },
      { email: 'va@reelflow.local', name: 'Mia (VA)', role: 'va' },
    ])
    .onConflictDoNothing();

  await db
    .insert(clients)
    .values([
      { name: 'Josh Harrison Realty', color: '#3B82F6' },
      { name: 'Mark Couré Wealth', color: '#10B981' },
      { name: 'Wolli Creek Properties', color: '#F59E0B' },
    ])
    .onConflictDoNothing();

  console.log('Seeded users and clients.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
