'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CARDS, CLIENTS, CLIENT_BY_ID, COLUMNS, USERS, type MockCard, type MockClient, type MockUser } from '@/lib/mock-data';
import { Avatar } from '@/components/ui/Avatar';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Kbd } from '@/components/ui/Kbd';
import { useUIState } from '@/components/ui-state';

type Item =
  | { kind: 'action'; group: string; icon: IconName; label: string; kbd?: string; fn: () => void }
  | { kind: 'card'; group: string; card: MockCard }
  | { kind: 'client'; group: string; client: MockClient }
  | { kind: 'user'; group: string; user: MockUser }
  | { kind: 'jump'; group: string; icon: IconName; label: string; target: string };

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { setOpenCardId } = useUIState();
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQ('');
    setIdx(0);
    const id = setTimeout(() => inputRef.current?.focus(), 10);
    return () => clearTimeout(id);
  }, []);

  const items = useMemo<Item[]>(() => {
    const ql = q.toLowerCase();
    const out: Item[] = [];
    if ('record feedback'.includes(ql) || ql === '') {
      out.push({ kind: 'action', group: 'Actions', icon: 'record', label: 'Record feedback on current WIP', kbd: 'R', fn: () => router.push('/') });
    }
    if ('new card'.includes(ql) || ql === '') {
      out.push({ kind: 'action', group: 'Actions', icon: 'plus', label: 'New card…', kbd: 'C', fn: () => router.push('/') });
    }
    if ('generate preview link'.includes(ql) || ql === '') {
      out.push({ kind: 'action', group: 'Actions', icon: 'globe', label: 'Generate preview link…', fn: () => router.push('/preview/V-241') });
    }
    CARDS.forEach((c) => {
      const text = `${c.id} ${c.title} ${CLIENT_BY_ID[c.client]?.name}`.toLowerCase();
      if (!ql || text.includes(ql)) out.push({ kind: 'card', group: 'Cards', card: c });
    });
    CLIENTS.forEach((c) => {
      if (!ql || c.name.toLowerCase().includes(ql)) out.push({ kind: 'client', group: 'Clients', client: c });
    });
    Object.values(USERS).forEach((u) => {
      if (!ql || u.name.toLowerCase().includes(ql)) out.push({ kind: 'user', group: 'People', user: u });
    });
    if (!ql || 'inbox notifications'.includes(ql)) {
      out.push({ kind: 'jump', group: 'Go to', icon: 'inbox', label: 'Inbox', target: '/inbox' });
    }
    if (!ql || 'board'.includes(ql)) {
      out.push({ kind: 'jump', group: 'Go to', icon: 'kanban', label: 'Board', target: '/' });
    }
    if (!ql || 'clients'.includes(ql)) {
      out.push({ kind: 'jump', group: 'Go to', icon: 'users', label: 'Clients', target: '/clients' });
    }
    if (!ql || 'settings'.includes(ql)) {
      out.push({ kind: 'jump', group: 'Go to', icon: 'cog', label: 'Settings', target: '/settings' });
    }
    return out.slice(0, 24);
  }, [q, router]);

  const fire = (it: Item) => {
    if (it.kind === 'action') it.fn();
    else if (it.kind === 'card') setOpenCardId(it.card.id);
    else if (it.kind === 'client') router.push(`/clients/${it.client.id}`);
    else if (it.kind === 'jump') router.push(it.target);
    else if (it.kind === 'user') router.push('/settings');
    onClose();
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIdx((i) => Math.min(items.length - 1, i + 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIdx((i) => Math.max(0, i - 1));
    }
    if (e.key === 'Enter') {
      const it = items[idx];
      if (it) {
        e.preventDefault();
        fire(it);
      }
    }
  };

  const grouped: Array<{ header: string } | { item: Item; i: number }> = [];
  let last: string | null = null;
  items.forEach((it, i) => {
    if (it.group !== last) {
      grouped.push({ header: it.group });
      last = it.group;
    }
    grouped.push({ item: it, i });
  });

  return (
    <div
      className="overlay"
      onClick={onClose}
      style={{ alignItems: 'flex-start', paddingTop: '14vh' }}
    >
      <div className="cmdk" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="cmdk-input"
          placeholder="Jump to a card, client, action…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setIdx(0);
          }}
          onKeyDown={onKey}
        />
        <div className="cmdk-list">
          {grouped.map((g, k) =>
            'header' in g ? (
              <div key={`h${k}`} className="cmdk-group">
                {g.header}
              </div>
            ) : (
              <button
                key={k}
                type="button"
                className={`cmdk-item ${g.i === idx ? 'active' : ''}`}
                onClick={() => fire(g.item)}
                onMouseEnter={() => setIdx(g.i)}
                style={{ width: '100%', textAlign: 'left' }}
              >
                {g.item.kind === 'card' && (
                  <>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 2,
                        background: CLIENT_BY_ID[g.item.card.client]?.stripe ?? '#444',
                      }}
                    />
                    <span className="mono" style={{ color: 'var(--fg-faint)', fontSize: 11 }}>
                      {g.item.card.id}
                    </span>
                    <span style={{ color: 'var(--fg)' }}>{g.item.card.title}</span>
                    <span className="right">{COLUMNS.find((c) => c.id === g.item.card.column)?.name}</span>
                  </>
                )}
                {g.item.kind === 'client' && (
                  <>
                    <span style={{ width: 6, height: 6, borderRadius: 2, background: g.item.client.stripe }} />
                    <span style={{ color: 'var(--fg)' }}>{g.item.client.name}</span>
                    <span className="right">{g.item.client.active} active</span>
                  </>
                )}
                {g.item.kind === 'user' && (
                  <>
                    <Avatar user={g.item.user} size="sm" />
                    <span style={{ color: 'var(--fg)' }}>{g.item.user.name}</span>
                    <span className="right" style={{ textTransform: 'capitalize' }}>
                      {g.item.user.role === 'va' ? 'VA' : g.item.user.role}
                    </span>
                  </>
                )}
                {g.item.kind === 'jump' && (
                  <>
                    <Icon name={g.item.icon} size={13} style={{ color: 'var(--fg-mute)' }} />
                    <span>{g.item.label}</span>
                  </>
                )}
                {g.item.kind === 'action' && (
                  <>
                    <Icon name={g.item.icon} size={13} style={{ color: 'var(--fg-mute)' }} />
                    <span style={{ color: 'var(--fg)' }}>{g.item.label}</span>
                    {g.item.kbd && (
                      <span className="right">
                        <Kbd>{g.item.kbd}</Kbd>
                      </span>
                    )}
                  </>
                )}
              </button>
            ),
          )}
          {items.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--fg-mute)', fontSize: 13 }}>
              No matches for &ldquo;{q}&rdquo;
            </div>
          )}
        </div>
        <div className="cmdk-footer">
          <span>
            <Kbd>↑</Kbd> <Kbd>↓</Kbd> navigate
          </span>
          <span>
            <Kbd>↵</Kbd> select
          </span>
          <span>
            <Kbd>esc</Kbd> close
          </span>
          <span style={{ marginLeft: 'auto' }}>{items.length} results</span>
        </div>
      </div>
    </div>
  );
}
