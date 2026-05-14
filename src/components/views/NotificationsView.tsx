'use client';

import { useState } from 'react';
import { NOTIFICATIONS, USERS, type NotificationKind } from '@/lib/mock-data';
import { Avatar } from '@/components/ui/Avatar';
import { Icon, type IconName } from '@/components/ui/Icon';
import { useUIState } from '@/components/ui-state';

type Filter = 'all' | 'unread' | 'mentions';

const ICON_MAP: Record<NotificationKind, IconName> = {
  wip: 'upload',
  feedback: 'comment',
  mention: 'at',
  assign: 'plus',
  deadline: 'clock',
  approved: 'check',
  delivered: 'send',
};

export function NotificationsView() {
  const [filter, setFilter] = useState<Filter>('all');
  const { setOpenCardId } = useUIState();
  const filtered = NOTIFICATIONS.filter((n) => {
    if (filter === 'unread') return n.unread;
    if (filter === 'mentions') return n.kind === 'mention';
    return true;
  });
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '20px 24px 0' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.015em', margin: '0 0 4px' }}>Inbox</h1>
        <div style={{ color: 'var(--fg-mute)', fontSize: 12 }}>
          {unreadCount} unread · everything that needs your eyes
        </div>
      </div>
      <div className="tabs" style={{ marginTop: 16, padding: '0 24px' }}>
        {(
          [
            ['all', `All (${NOTIFICATIONS.length})`],
            ['unread', `Unread (${unreadCount})`],
            ['mentions', 'Mentions'],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            type="button"
            className={`tab ${filter === k ? 'active' : ''}`}
            onClick={() => setFilter(k)}
          >
            {l}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.map((n) => (
          <button
            key={n.id}
            type="button"
            className="row"
            style={{ width: '100%', textAlign: 'left' }}
            onClick={() => setOpenCardId(n.card)}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                flex: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--fg-dim)',
                background: 'var(--panel)',
                border: '1px solid var(--line-subtle)',
              }}
            >
              <Icon name={ICON_MAP[n.kind]} size={13} color="currentColor" />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--fg)' }}>
                {n.who && <Avatar user={n.who} size="sm" />}
                <span style={{ color: n.who ? 'var(--fg)' : 'var(--fg-mute)' }}>
                  {n.who && <b style={{ fontWeight: 500 }}>{USERS[n.who].short}</b>} {n.body}
                </span>
                {n.unread && <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--record)' }} />}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  marginTop: 3,
                  color: 'var(--fg-mute)',
                  fontSize: 12,
                }}
              >
                <span className="mono" style={{ color: 'var(--fg-faint)' }}>
                  {n.card}
                </span>
                <span style={{ color: 'var(--fg-faint)' }}>·</span>
                <span>{n.title}</span>
              </div>
            </div>
            <div className="meta">{n.when}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
