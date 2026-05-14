'use client';

import type { DragEvent } from 'react';
import type { Column, ColumnId, MockCard } from '@/lib/mock-data';
import { Icon } from '@/components/ui/Icon';
import { KanbanCard } from './KanbanCard';

type Props = {
  column: Column;
  cards: MockCard[];
  onOpenCard: (card: MockCard) => void;
  onCardDrop: (cardId: string, columnId: ColumnId) => void;
  onAddCard: () => void;
  isOver: boolean;
  onDragOverColumn: (columnId: ColumnId) => void;
  draggingId: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
};

export function KanbanColumn({
  column,
  cards,
  onOpenCard,
  onCardDrop,
  onAddCard,
  isOver,
  onDragOverColumn,
  draggingId,
  onDragStart,
  onDragEnd,
}: Props) {
  const visible = cards.filter((c) => c.column === column.id);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    // Only signal up when the hovered column actually changes — avoids a
    // setState on every dragover tick.
    if (!isOver) onDragOverColumn(column.id);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) onCardDrop(id, column.id);
  };

  return (
    <div className="column">
      <div className="column-header">
        <span>{column.name}</span>
        <span className="count">{visible.length}</span>
        <span style={{ flex: 1 }} />
        <button type="button" className="btn ghost sm" title={`Add a card to ${column.name}`} onClick={onAddCard}>
          <Icon name="plus" size={12} />
        </button>
      </div>
      <div
        className={`column-cards${isOver && draggingId ? ' drop-over' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        // Clicking the empty space of a column (not a card) opens the
        // new-card box, pre-set to this column.
        onClick={(e) => {
          if (e.target === e.currentTarget) onAddCard();
        }}
        title="Click an empty area to add a card"
      >
        {visible.length === 0 ? (
          <button type="button" className="column-empty" onClick={onAddCard}>
            + Add a card
          </button>
        ) : (
          visible.map((c) => (
            <KanbanCard
              key={c.id}
              card={c}
              onOpen={onOpenCard}
              dragging={draggingId === c.id}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>
    </div>
  );
}
