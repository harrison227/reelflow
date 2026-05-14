'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { CLIENT_BY_ID } from '@/lib/mock-data';

export function Crumb() {
  const pathname = usePathname();
  const params = useSearchParams();

  if (pathname === '/') {
    const scope = params.get('scope') ?? 'all';
    const label =
      scope === 'all'
        ? 'All clients'
        : scope === 'mine'
          ? 'My queue'
          : (CLIENT_BY_ID[scope]?.name ?? 'All clients');
    return (
      <>
        Board <span style={{ margin: '0 6px', color: 'var(--fg-faint)' }}>/</span> <b>{label}</b>
      </>
    );
  }
  if (pathname.startsWith('/inbox')) return <b>Inbox</b>;
  if (pathname.startsWith('/clients')) return <b>Clients</b>;
  if (pathname.startsWith('/settings')) return <b>Settings</b>;
  return null;
}
