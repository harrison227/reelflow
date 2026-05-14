'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { ClientId, ColumnId, MockCard, UserId } from '@/lib/mock-data';
import { CARDS } from '@/lib/mock-data';
import type { LinkProvider } from '@/lib/parse-link';

const BOARD_KEY = 'reelflow.board.v2';
const ATTACH_KEY = 'reelflow.attachments.v1';

export type NewCardInput = {
  title: string;
  client: ClientId;
  column: ColumnId;
  assignee: UserId | null;
  due: string;
  format: string;
};

export type Attachment = {
  id: string;
  kind: 'link' | 'file';
  label: string;
  addedAt: number;
  // link attachments
  provider?: LinkProvider;
  url?: string;
  embedUrl?: string | null;
  thumbnailUrl?: string | null;
  // file attachments
  fileName?: string;
  fileSize?: number;
};

type AttachmentMap = Record<string, Attachment[]>;

type UIState = {
  cards: MockCard[];
  moveCard: (cardId: string, toColumn: ColumnId) => void;
  addCard: (input: NewCardInput) => string;
  newCardColumn: ColumnId | null;
  openNewCard: (column?: ColumnId) => void;
  closeNewCard: () => void;
  attachments: AttachmentMap;
  addAttachment: (cardId: string, input: Omit<Attachment, 'id' | 'addedAt'>) => void;
  removeAttachment: (cardId: string, attachmentId: string) => void;
  openCardId: string | null;
  paletteOpen: boolean;
  openCard: MockCard | null;
  setOpenCardId: (id: string | null) => void;
  setPaletteOpen: (open: boolean) => void;
  togglePalette: () => void;
};

const UIStateContext = createContext<UIState | null>(null);

function persistBoard(cards: MockCard[]) {
  try {
    localStorage.setItem(BOARD_KEY, JSON.stringify(cards));
  } catch {
    /* localStorage unavailable — fall back to in-memory only */
  }
}

function persistAttachments(map: AttachmentMap) {
  try {
    localStorage.setItem(ATTACH_KEY, JSON.stringify(map));
  } catch {
    /* localStorage unavailable — fall back to in-memory only */
  }
}

export function UIStateProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<MockCard[]>(CARDS);
  const [attachments, setAttachments] = useState<AttachmentMap>({});
  const [newCardColumn, setNewCardColumn] = useState<ColumnId | null>(null);
  const [openCardId, setOpenCardIdState] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpenState] = useState(false);

  // Mirror of `cards` so addCard can compute the next id and return it
  // synchronously (a setState updater can't return a value to the caller).
  const cardsRef = useRef(cards);
  cardsRef.current = cards;

  // Restore the saved board + attachments from a previous session after mount.
  useEffect(() => {
    try {
      const rawBoard = localStorage.getItem(BOARD_KEY);
      if (rawBoard) {
        const saved = JSON.parse(rawBoard) as MockCard[];
        if (Array.isArray(saved) && saved.length > 0) setCards(saved);
      }
    } catch {
      /* ignore malformed storage */
    }
    try {
      const rawAttach = localStorage.getItem(ATTACH_KEY);
      if (rawAttach) {
        const saved = JSON.parse(rawAttach) as AttachmentMap;
        if (saved && typeof saved === 'object') setAttachments(saved);
      }
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  const moveCard = useCallback((cardId: string, toColumn: ColumnId) => {
    setCards((prev) => {
      const card = prev.find((c) => c.id === cardId);
      if (!card || card.column === toColumn) return prev;
      const next = prev.map((c) => (c.id === cardId ? { ...c, column: toColumn } : c));
      persistBoard(next);
      return next;
    });
  }, []);

  const addCard = useCallback((input: NewCardInput): string => {
    const prev = cardsRef.current;
    const maxNum = prev.reduce((m, c) => {
      const n = Number.parseInt(c.id.replace(/\D/g, ''), 10);
      return Number.isFinite(n) && n > m ? n : m;
    }, 240);
    const id = `V-${maxNum + 1}`;
    const card: MockCard = {
      id,
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
    cardsRef.current = next;
    persistBoard(next);
    setCards(next);
    return id;
  }, []);

  const addAttachment = useCallback((cardId: string, input: Omit<Attachment, 'id' | 'addedAt'>) => {
    setAttachments((prev) => {
      const attachment: Attachment = {
        ...input,
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        addedAt: Date.now(),
      };
      const next = { ...prev, [cardId]: [...(prev[cardId] ?? []), attachment] };
      persistAttachments(next);
      return next;
    });
  }, []);

  const removeAttachment = useCallback((cardId: string, attachmentId: string) => {
    setAttachments((prev) => {
      const list = prev[cardId];
      if (!list) return prev;
      const next = { ...prev, [cardId]: list.filter((a) => a.id !== attachmentId) };
      persistAttachments(next);
      return next;
    });
  }, []);

  const openNewCard = useCallback((column: ColumnId = 'brief') => setNewCardColumn(column), []);
  const closeNewCard = useCallback(() => setNewCardColumn(null), []);
  const setOpenCardId = useCallback((id: string | null) => setOpenCardIdState(id), []);
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
        else if (openCardId) setOpenCardIdState(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paletteOpen, newCardColumn, openCardId, togglePalette]);

  const openCard = useMemo(() => cards.find((c) => c.id === openCardId) ?? null, [cards, openCardId]);

  const value: UIState = {
    cards,
    moveCard,
    addCard,
    newCardColumn,
    openNewCard,
    closeNewCard,
    attachments,
    addAttachment,
    removeAttachment,
    openCardId,
    paletteOpen,
    openCard,
    setOpenCardId,
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
