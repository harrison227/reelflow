'use client';

import Link from 'next/link';
import { CARDS, CLIENTS } from '@/lib/mock-data';
import { Icon } from '@/components/ui/Icon';

export function ClientsView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '20px 24px 12px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.015em', margin: 0 }}>Clients</h1>
        <div style={{ color: 'var(--fg-mute)', fontSize: 12, marginTop: 2 }}>
          {CLIENTS.length} clients · {CLIENTS.reduce((n, c) => n + c.active, 0)} active cards
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div
          style={{
            padding: '0 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
            paddingBottom: 24,
          }}
        >
          {CLIENTS.map((c) => (
            <Link key={c.id} href={`/?scope=${c.id}`} className="card" style={{ padding: 16, cursor: 'pointer', display: 'block' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 4, height: 22, background: c.stripe, borderRadius: 1 }} />
                <span style={{ fontSize: 14, color: 'var(--fg)', fontWeight: 500 }}>{c.name}</span>
                <span style={{ flex: 1 }} />
                <span className="mono" style={{ fontSize: 10, color: 'var(--fg-faint)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {c.active} active
                  <Icon name="arrow-r" size={11} />
                </span>
              </div>
              <div style={{ color: 'var(--fg-mute)', fontSize: 12, marginTop: 4, marginLeft: 14 }}>{c.sector}</div>
              <div style={{ marginTop: 12, marginLeft: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {CARDS.filter((card) => card.client === c.id)
                  .slice(0, 4)
                  .map((card) => (
                    <div key={card.id} className="chip" style={{ fontSize: 10 }}>
                      <span className="mono" style={{ color: 'var(--fg-faint)' }}>
                        {card.id}
                      </span>
                      <span style={{ color: 'var(--fg-dim)' }}>{card.title.split('—')[0]?.trim()}</span>
                    </div>
                  ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
