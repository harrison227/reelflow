'use client';

import { useRouter } from 'next/navigation';
import { CARDS, CLIENT_BY_ID, COLUMNS } from '@/lib/mock-data';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { StatusChip } from '@/components/ui/StatusChip';
import { useUIState } from '@/components/ui-state';

export function ClientOverview({ clientId }: { clientId: string }) {
  const router = useRouter();
  const { setOpenCardId } = useUIState();
  const c = CLIENT_BY_ID[clientId];
  if (!c) {
    return (
      <div style={{ padding: 24, color: 'var(--fg-mute)' }}>Client not found.</div>
    );
  }
  const cards = CARDS.filter((card) => card.client === clientId);
  const counts = COLUMNS.map((col) => ({ ...col, n: cards.filter((card) => card.column === col.id).length }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          padding: '14px 24px',
          borderBottom: '1px solid var(--line-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <button type="button" className="btn ghost sm" onClick={() => router.push('/clients')}>
          <Icon name="back" size={13} />
        </button>
        <span style={{ width: 4, height: 18, background: c.stripe, borderRadius: 1 }} />
        <span style={{ fontSize: 14, fontWeight: 500 }}>{c.name}</span>
        <span style={{ color: 'var(--fg-faint)' }}>·</span>
        <span style={{ color: 'var(--fg-mute)', fontSize: 12 }}>{c.sector}</span>
        <span style={{ flex: 1 }} />
        <Button icon="plus">New card</Button>
        <Button icon="cog" variant="ghost" />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {counts.map((col) => (
            <div key={col.id} className="card" style={{ padding: '8px 12px', flex: 1, minWidth: 0 }}>
              <div
                className="mono"
                style={{
                  fontSize: 9,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--fg-faint)',
                }}
              >
                {col.name}
              </div>
              <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--fg)' }}>{col.n}</div>
            </div>
          ))}
        </div>

        <SectionLabel
          right={
            <button type="button" className="btn ghost sm">
              <Icon name="filter" size={12} />
            </button>
          }
        >
          All cards · {cards.length}
        </SectionLabel>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {cards.map((card) => (
            <button
              key={card.id}
              type="button"
              className="row"
              style={{
                borderRadius: 6,
                padding: '10px 12px',
                border: '1px solid var(--line-subtle)',
                width: '100%',
                textAlign: 'left',
              }}
              onClick={() => setOpenCardId(card.id)}
            >
              <span className="mono" style={{ color: 'var(--fg-faint)', fontSize: 11, width: 48 }}>
                {card.id}
              </span>
              <span style={{ flex: 1, color: 'var(--fg)', fontSize: 13 }}>{card.title}</span>
              <StatusChip status={card.column} />
              {card.assignee && <Avatar user={card.assignee} size="sm" />}
              <span className="mono" style={{ color: 'var(--fg-mute)', fontSize: 11, width: 64, textAlign: 'right' }}>
                {card.due}
              </span>
              <span className="mono" style={{ color: 'var(--fg-faint)', fontSize: 11, width: 56, textAlign: 'right' }}>
                v{card.versions}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
