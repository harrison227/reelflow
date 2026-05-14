'use client';

import type { Column, MockCard } from '@/lib/mock-data';
import { Icon } from '@/components/ui/Icon';
import { KanbanCard } from './KanbanCard';

type Props = {
  column: Column;
  cards: MockCard[];
  onOpenCard: (card: MockCard) => void;
};

export function KanbanColumn({ column, cards, onOpenCard }: Props) {
  const visible = cards.filter((c) => c.column === column.id);
  return (
    <div className="column">
      <div className="column-header">
        <span>{column.name}</span>
        <span className="count">{visible.length}</span>
        <span style={{ flex: 1 }} />
        <button type="button" className="btn ghost sm" title="Add card">
          <Icon name="plus" size={12} />
        </button>
      </div>
      <div className="column-cards">
        {visible.length === 0 ? (
          <div
            style={{
              border: '1px dashed var(--line-subtle)',
              borderRadius: 6,
              padding: '14px 10px',
              textAlign: 'center',
              color: 'var(--fg-faint)',
              fontFamily: 'var(--mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            — empty —
          </div>
        ) : (
          visible.map((c) => <KanbanCard key={c.id} card={c} onOpen={onOpenCard} />)
        )}
      </div>
    </div>
  );
}
