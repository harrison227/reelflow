'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useUIState } from '@/components/ui-state';
import { Icon } from '@/components/ui/Icon';
import { Kbd } from '@/components/ui/Kbd';
import { NOTIFICATIONS } from '@/lib/mock-data';
import { ThemeToggle } from './ThemeToggle';
import { Crumb } from './Crumb';

export function Topbar() {
  const { setPaletteOpen } = useUIState();
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div className="topbar">
      <div className="crumb">
        <Suspense fallback={null}>
          <Crumb />
        </Suspense>
      </div>
      <span className="spacer" />
      <button type="button" className="search-pill" onClick={() => setPaletteOpen(true)}>
        <Icon name="search" size={13} />
        <span>Jump to anything…</span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>
      <ThemeToggle />
      <Link href="/inbox" className="btn ghost" title="Inbox">
        <Icon name="bell" size={13} />
        {unread > 0 && (
          <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--record)', marginLeft: -2 }} />
        )}
      </Link>
    </div>
  );
}
