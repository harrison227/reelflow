'use client';

import type { DragEvent } from 'react';
import { CLIENT_BY_ID, USERS, type MockCard } from '@/lib/mock-data';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { VideoThumb } from '@/components/ui/VideoThumb';
import { useUIState } from '@/components/ui-state';

type Props = {
  card: MockCard;
  onOpen: (card: MockCard) => void;
  dragging: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
};

export function KanbanCard({ card, onOpen, dragging, onDragStart, onDragEnd }: Props) {
  const { attachments } = useUIState();
  const client = CLIENT_BY_ID[card.client];
  const assignee = card.assignee ? USERS[card.assignee] : null;

  // The card cover auto-populates from the most recent attached link that
  // exposes a poster frame (Google Drive file, YouTube). Falls back to the
  // gradient placeholder when there's nothing to show.
  const coverThumb =
    [...(attachments[card.id] ?? [])].reverse().find((a) => a.kind === 'link' && a.thumbnailUrl)?.thumbnailUrl ??
    null;

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', card.id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(card.id);
  };

  return (
    <div
      className={`kcard${dragging ? ' dragging' : ''}`}
      draggable
      onClick={() => onOpen(card)}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      <span className="stripe" style={{ background: client?.stripe ?? '#444' }} />
      {card.unread && <span className="unread" />}
      <VideoThumb
        seed={card.id}
        clientColor={client?.stripe}
        width={46}
        height={82}
        format={card.format}
        rounded={4}
        thumbnailUrl={coverThumb}
      />
      <div className="body">
        <div className="client" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>{client?.name}</span>
          <span style={{ color: 'var(--fg-faint)' }}>·</span>
          <span className="mono" style={{ color: 'var(--fg-faint)' }}>{card.id}</span>
        </div>
        <div className="title">{card.title}</div>
        <div className="meta">
          {assignee ? (
            <Avatar user={assignee} size="sm" />
          ) : (
            <span className="chip" style={{ color: 'var(--fg-faint)', borderStyle: 'dashed' }}>
              Unassigned
            </span>
          )}
          <span className="mono" style={{ color: 'var(--fg-mute)' }}>{card.due}</span>
          {card.versions > 0 && (
            <>
              <span className="dot-sep">·</span>
              <span className="mono" style={{ color: 'var(--fg-mute)' }}>v{card.versions}</span>
            </>
          )}
          {card.comments > 0 && (
            <>
              <span className="dot-sep">·</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: 'var(--fg-mute)' }}>
                <Icon name="comment" size={11} /> {card.comments}
              </span>
            </>
          )}
        </div>
        <div className="activity">
          updated {card.updated} by {USERS[card.updatedBy].short}
        </div>
      </div>
    </div>
  );
}
