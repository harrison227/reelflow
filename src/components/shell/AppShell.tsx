'use client';

import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { UIStateProvider, useUIState } from '@/components/ui-state';
import { CardDetailDrawer } from '@/components/card-detail/CardDetailDrawer';
import { CommandPalette } from '@/components/views/CommandPalette';
import { NewCardModal } from '@/components/board/NewCardModal';

function GlobalOverlays() {
  const { openCard, paletteOpen, newCardColumn, setOpenCardId, setPaletteOpen } = useUIState();

  return (
    <>
      {openCard && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 80 }}
            onClick={() => setOpenCardId(null)}
          />
          <CardDetailDrawer card={openCard} onClose={() => setOpenCardId(null)} />
        </>
      )}
      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
      {newCardColumn && <NewCardModal />}
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <UIStateProvider>
      <div className="app-shell">
        <Sidebar />
        <main style={{ display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          <Topbar />
          <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>{children}</div>
        </main>
        <GlobalOverlays />
      </div>
    </UIStateProvider>
  );
}
