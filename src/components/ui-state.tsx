'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ColumnId, MockCard } from '@/lib/mock-data';
import { CARDS, COLUMNS } from '@/lib/mock-data';

const STORAGE_KEY = 'reelflow.board.v1';
const VALID_COLUMNS = new Set<string>(COLUMNS.map((c) => c.id));

type UIState = {
  cards: MockCard[];
  moveCard: (cardId: string, toColumn: ColumnId) => void;
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

function persistColumns(cards: MockCard[]) {
  try {
    const payload = cards.map((c) => ({ id: c.id, column: c.column }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* localStorage unavailable — fall back to in-memory only */
  }
}

export function UIStateProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<MockCard[]>(CARDS);
  const [openCardId, setOpenCardIdState] = useState<string | null>(null);
  const [reviewCardId, setReviewCardIdState] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpenState] = useState(false);

  // Restore saved column positions from a previous session after mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Array<{ id: string; column: string }>;
      const byId = new Map(saved.map((s) => [s.id, s.column]));
      setCards((prev) =>
        prev.map((c) => {
          const col = byId.get(c.id);
          return col && VALID_COLUMNS.has(col) ? { ...c, column: col as ColumnId } : c;
        }),
      );
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  const moveCard = useCallback((cardId: string, toColumn: ColumnId) => {
    setCards((prev) => {
      const card = prev.find((c) => c.id === cardId);
      if (!card || card.column === toColumn) return prev;
      const next = prev.map((c) => (c.id === cardId ? { ...c, column: toColumn } : c));
      persistColumns(next);
      return next;
    });
  }, []);

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

  const openCard = useMemo(() => cards.find((c) => c.id === openCardId) ?? null, [cards, openCardId]);
  const reviewCard = useMemo(() => cards.find((c) => c.id === reviewCardId) ?? null, [cards, reviewCardId]);

  const value: UIState = {
    cards,
    moveCard,
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
