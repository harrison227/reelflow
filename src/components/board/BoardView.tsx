'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CLIENTS, CLIENT_BY_ID, COLUMNS } from '@/lib/mock-data';
import { Icon } from '@/components/ui/Icon';
import { useUIState } from '@/components/ui-state';
import { KanbanColumn } from './KanbanColumn';

type Scope = 'all' | 'mine' | string;

const scopeOptions: Array<{ id: string; name: string; stripe?: string }> = [
  { id: 'all', name: 'All clients' },
  { id: 'mine', name: 'My queue' },
  ...CLIENTS.map((c) => ({ id: c.id, name: c.name, stripe: c.stripe })),
];

export function BoardView() {
  const router = useRouter();
  const params = useSearchParams();
  const scope = (params.get('scope') as Scope | null) ?? 'all';
  const { cards, moveCard, setOpenCardId } = useUIState();
  const [scopeOpen, setScopeOpen] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const visibleCards = cards.filter((c) => {
    if (scope === 'all') return true;
    if (scope === 'mine') return c.assignee === 'jules' || c.assignee === 'maya';
    return c.client === scope;
  });

  const currentScope = scopeOptions.find((o) => o.id === scope) ?? scopeOptions[0]!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          height: 44,
          borderBottom: '1px solid var(--line-subtle)',
          padding: '0 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div style={{ position: 'relative' }}>
          <button type="button" className="btn" onClick={() => setScopeOpen((o) => !o)} style={{ paddingLeft: 8 }}>
            {currentScope.stripe && (
              <span style={{ width: 8, height: 8, borderRadius: 2, background: currentScope.stripe }} />
            )}
            <span style={{ color: 'var(--fg)' }}>{currentScope.name}</span>
            <Icon name="chev-d" size={12} style={{ color: 'var(--fg-mute)' }} />
          </button>
          {scopeOpen && (
            <div
              style={{
                position: 'absolute',
                top: 32,
                left: 0,
                zIndex: 50,
                background: 'var(--panel)',
                border: '1px solid var(--line)',
                borderRadius: 8,
                padding: 4,
                minWidth: 200,
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
            >
              {scopeOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className="cmdk-item"
                  onClick={() => {
                    const sp = new URLSearchParams(params.toString());
                    if (opt.id === 'all') sp.delete('scope');
                    else sp.set('scope', opt.id);
                    router.push(`/${sp.toString() ? `?${sp.toString()}` : ''}`);
                    setScopeOpen(false);
                  }}
                  style={{ width: '100%', textAlign: 'left' }}
                >
                  {opt.stripe ? (
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: opt.stripe }} />
                  ) : (
                    <Icon name={opt.id === 'mine' ? 'queue' : 'globe'} size={13} style={{ color: 'var(--fg-mute)' }} />
                  )}
                  <span>{opt.name}</span>
                  {scope === opt.id && (
                    <Icon name="check" size={13} style={{ marginLeft: 'auto', color: 'var(--fg-dim)' }} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: 1, height: 18, background: 'var(--line-subtle)', margin: '0 4px' }} />

        <button type="button" className="btn ghost">
          <Icon name="filter" size={13} /> Filter
        </button>
        <button type="button" className="btn ghost">
          <Icon name="sort" size={13} /> Deadline
        </button>

        <div style={{ flex: 1 }} />

        <div className="mono" style={{ color: 'var(--fg-faint)', fontSize: 11 }}>
          {visibleCards.length} cards · {visibleCards.filter((c) => c.unread).length} unread
        </div>

        <button type="button" className="btn">
          <Icon name="plus" size={12} /> New card
        </button>
      </div>

      <div className="kanban">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            cards={visibleCards}
            onOpenCard={(card) => setOpenCardId(card.id)}
            onCardDrop={(cardId, columnId) => moveCard(cardId, columnId)}
            draggingId={draggingId}
            onDragStart={setDraggingId}
            onDragEnd={() => setDraggingId(null)}
          />
        ))}
      </div>
    </div>
  );
}

export function getScopeName(scope: string): string {
  if (scope === 'all') return 'All clients';
  if (scope === 'mine') return 'My queue';
  return CLIENT_BY_ID[scope]?.name ?? '';
}
