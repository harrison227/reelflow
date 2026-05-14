import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { hasValidSession } from '@/lib/auth/session';
import { AppShell } from '@/components/shell/AppShell';

export default async function AppLayout({ children }: { children: ReactNode }) {
  if (!(await hasValidSession())) redirect('/signin');

  return <AppShell>{children}</AppShell>;
}
