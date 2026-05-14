import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { auth } from '@/lib/auth';
import { AppShell } from '@/components/shell/AppShell';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect('/signin');

  return (
    <AppShell
      user={{
        name: session.user.name ?? 'Studio',
        email: session.user.email ?? '',
        role: session.user.role,
      }}
    >
      {children}
    </AppShell>
  );
}
