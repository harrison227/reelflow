'use client';

import { useRef, useState, type DragEvent } from 'react';
import type { Column, ColumnId, MockCard } from '@/lib/mock-data';
import { Icon } from '@/components/ui/Icon';
import { KanbanCard } from './KanbanCard';

type Props = {
  column: Column;
  cards: MockCard[];
  onOpenCard: (card: MockCard) => void;
  onCardDrop: (cardId: string, columnId: ColumnId) => void;
  draggingId: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
};

export function KanbanColumn({
  column,
  cards,
  onOpenCard,
  onCardDrop,
  draggingId,
  onDragStart,
  onDragEnd,
}: Props) {
  const visible = cards.filter((c) => c.column === column.id);
  const [isOver, setIsOver] = useState(false);
  const enterCount = useRef(0);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    enterCount.current += 1;
    setIsOver(true);
  };
  const handleDragLeave = () => {
    enterCount.current -= 1;
    if (enterCount.current <= 0) {
      enterCount.current = 0;
      setIsOver(false);
    }
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    enterCount.current = 0;
    setIsOver(false);
    const id = e.dataTransfer.getData('text/plain');
    if (id) onCardDrop(id, column.id);
  };

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
      <div
        className={`column-cards${isOver ? ' drop-over' : ''}`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {visible.length === 0 ? (
          <div className="column-empty">— empty —</div>
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
