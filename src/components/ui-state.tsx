'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { MockCard } from '@/lib/mock-data';
import { CARDS } from '@/lib/mock-data';

type UIState = {
  openCardId: string | null;
  reviewCardId: string | null;
  paletteOpen: boolean;
  openCard: MockCard | null;
  reviewCard: MockCard | null;
  setOpenCardId: (id: string | null) => void;
  setReviewCardId: (id: string | null) => void;
  setPaletteOpen: (open: boolean) => void;
  togglePalette: () => void;
};

const UIStateContext = createContext<UIState | null>(null);

export function UIStateProvider({ children }: { children: ReactNode }) {
  const [openCardId, setOpenCardIdState] = useState<string | null>(null);
  const [reviewCardId, setReviewCardIdState] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpenState] = useState(false);

  const setOpenCardId = useCallback((id: string | null) => setOpenCardIdState(id), []);
  const setReviewCardId = useCallback((id: string | null) => setReviewCardIdState(id), []);
  const setPaletteOpen = useCallback((open: boolean) => setPaletteOpenState(open), []);
  const togglePalette = useCallback(() => setPaletteOpenState((o) => !o), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        togglePalette();
        return;
      }
      if (e.key === 'Escape') {
        if (paletteOpen) setPaletteOpenState(false);
        else if (reviewCardId) setReviewCardIdState(null);
        else if (openCardId) setOpenCardIdState(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paletteOpen, reviewCardId, openCardId, togglePalette]);

  const openCard = useMemo(() => CARDS.find((c) => c.id === openCardId) ?? null, [openCardId]);
  const reviewCard = useMemo(() => CARDS.find((c) => c.id === reviewCardId) ?? null, [reviewCardId]);

  const value: UIState = {
    openCardId,
    reviewCardId,
    paletteOpen,
    openCard,
    reviewCard,
    setOpenCardId,
    setReviewCardId,
    setPaletteOpen,
    togglePalette,
  };

  return <UIStateContext.Provider value={value}>{children}</UIStateContext.Provider>;
}

export function useUIState(): UIState {
  const ctx = useContext(UIStateContext);
  if (!ctx) throw new Error('useUIState must be used inside UIStateProvider');
  return ctx;
}
