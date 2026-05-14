'use client';

import { CLIENT_BY_ID, USERS, type MockCard } from '@/lib/mock-data';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';

export function KanbanCard({ card, onOpen }: { card: MockCard; onOpen: (card: MockCard) => void }) {
  const client = CLIENT_BY_ID[card.client];
  const assignee = card.assignee ? USERS[card.assignee] : null;

  return (
    <div className="kcard" onClick={() => onOpen(card)}>
      <span className="stripe" style={{ background: client?.stripe ?? '#444' }} />
      {card.unread && <span className="unread" />}
      <VideoPlaceholder width={44} height={78} meta={[card.length || '—', card.format]} style={{ borderRadius: 3 }} />
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
