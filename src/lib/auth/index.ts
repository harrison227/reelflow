import NextAuth from 'next-auth';
import Resend from 'next-auth/providers/resend';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { accounts, sessions, users, verificationTokens } from '../db/schema';
import { allowedEmails, env } from '../env';
import { logger } from '../logger';
import type { Role } from './permissions';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Resend({
      apiKey: env.RESEND_API_KEY ?? '',
      from: env.EMAIL_FROM,
    }),
  ],
  session: { strategy: 'database' },
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase();
      if (!email) return false;
      if (allowedEmails.size === 0) {
        if (env.NODE_ENV === 'production') {
          logger.warn({ email }, 'Sign-in blocked: ALLOWED_EMAILS is empty in production');
          return false;
        }
        return true;
      }
      if (!allowedEmails.has(email)) {
        logger.warn({ email }, 'Sign-in blocked: email not on allowlist');
        return false;
      }
      return true;
    },
    async session({ session, user }) {
      if (session.user && user.id) {
        session.user.id = user.id;
        const [row] = await db
          .select({ role: users.role })
          .from(users)
          .where(eq(users.id, user.id))
          .limit(1);
        if (row) {
          session.user.role = row.role as Role;
        }
      }
      return session;
    },
  },
});
