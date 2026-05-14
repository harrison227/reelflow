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
import type { ClientId, ColumnId, MockCard, UserId } from '@/lib/mock-data';
import { CARDS } from '@/lib/mock-data';

const STORAGE_KEY = 'reelflow.board.v2';

export type NewCardInput = {
  title: string;
  client: ClientId;
  column: ColumnId;
  assignee: UserId | null;
  due: string;
  format: string;
};

type UIState = {
  cards: MockCard[];
  moveCard: (cardId: string, toColumn: ColumnId) => void;
  addCard: (input: NewCardInput) => void;
  newCardColumn: ColumnId | null;
  openNewCard: (column?: ColumnId) => void;
  closeNewCard: () => void;
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

function persist(cards: MockCard[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch {
    /* localStorage unavailable — fall back to in-memory only */
  }
}

export function UIStateProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<MockCard[]>(CARDS);
  const [newCardColumn, setNewCardColumn] = useState<ColumnId | null>(null);
  const [openCardId, setOpenCardIdState] = useState<string | null>(null);
  const [reviewCardId, setReviewCardIdState] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpenState] = useState(false);

  // Restore the saved board (column moves + any cards added previously) after mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as MockCard[];
      if (Array.isArray(saved) && saved.length > 0) setCards(saved);
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  const moveCard = useCallback((cardId: string, toColumn: ColumnId) => {
    setCards((prev) => {
      const card = prev.find((c) => c.id === cardId);
      if (!card || card.column === toColumn) return prev;
      const next = prev.map((c) => (c.id === cardId ? { ...c, column: toColumn } : c));
      persist(next);
      return next;
    });
  }, []);

  const addCard = useCallback((input: NewCardInput) => {
    setCards((prev) => {
      const maxNum = prev.reduce((m, c) => {
        const n = Number.parseInt(c.id.replace(/\D/g, ''), 10);
        return Number.isFinite(n) && n > m ? n : m;
      }, 240);
      const card: MockCard = {
        id: `V-${maxNum + 1}`,
        title: input.title,
        client: input.client,
        column: input.column,
        assignee: input.assignee,
        length: '—',
        format: input.format,
        due: input.due || 'TBD',
        updated: 'just now',
        updatedBy: 'maya',
        unread: false,
        versions: 0,
        comments: 0,
        files: 0,
        brief: '',
        deliverables: [],
      };
      const next = [...prev, card];
      persist(next);
      return next;
    });
  }, []);

  const openNewCard = useCallback((column: ColumnId = 'brief') => setNewCardColumn(column), []);
  const closeNewCard = useCallback(() => setNewCardColumn(null), []);
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
        else if (newCardColumn) setNewCardColumn(null);
        else if (reviewCardId) setReviewCardIdState(null);
        else if (openCardId) setOpenCardIdState(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paletteOpen, newCardColumn, reviewCardId, openCardId, togglePalette]);

  const openCard = useMemo(() => cards.find((c) => c.id === openCardId) ?? null, [cards, openCardId]);
  const reviewCard = useMemo(() => cards.find((c) => c.id === reviewCardId) ?? null, [cards, reviewCardId]);

  const value: UIState = {
    cards,
    moveCard,
    addCard,
    newCardColumn,
    openNewCard,
    closeNewCard,
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
