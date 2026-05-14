'use client';

import { Suspense, type ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/shell/AppShell';
import { CLIENT_BY_ID } from '@/lib/mock-data';

function CrumbInner() {
  const pathname = usePathname();
  const params = useSearchParams();

  if (pathname === '/') {
    const scope = params.get('scope') ?? 'all';
    const label =
      scope === 'all' ? 'All clients' : scope === 'mine' ? 'My queue' : CLIENT_BY_ID[scope]?.name ?? 'All clients';
    return (
      <>
        Board <span style={{ margin: '0 6px', color: 'var(--fg-faint)' }}>/</span> <b>{label}</b>
      </>
    );
  }
  if (pathname.startsWith('/inbox')) return <b>Inbox</b>;
  if (pathname.startsWith('/clients/')) {
    const id = pathname.split('/')[2];
    const c = id ? CLIENT_BY_ID[id] : null;
    return (
      <>
        Clients <span style={{ margin: '0 6px', color: 'var(--fg-faint)' }}>/</span> <b>{c?.name ?? 'Client'}</b>
      </>
    );
  }
  if (pathname.startsWith('/clients')) return <b>Clients</b>;
  if (pathname.startsWith('/settings')) return <b>Settings</b>;
  return null;
}

function Crumb() {
  return (
    <Suspense fallback={null}>
      <CrumbInner />
    </Suspense>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppShell crumb={<Crumb />}>{children}</AppShell>;
}
