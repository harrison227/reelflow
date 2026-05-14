'use client';

import { CARDS, CLIENT_BY_ID, type MockCard } from '@/lib/mock-data';
import { Icon } from '@/components/ui/Icon';
import { StatusChip } from '@/components/ui/StatusChip';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';

export function MobileQueue({ onPick }: { onPick: (card: MockCard) => void }) {
  const mine = CARDS.filter(
    (c) => c.assignee === 'jules' && (['editing', 'revisions', 'footage', 'review'] as const).includes(c.column as 'editing' | 'revisions' | 'footage' | 'review'),
  );
  const urgent = mine.filter((c) => c.unread);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: 80 }}>
      <div style={{ padding: '60px 18px 14px' }}>
        <div
          className="mono"
          style={{
            fontSize: 10,
            color: 'var(--fg-faint)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Editor · Jules
        </div>
        <h1 style={{ fontSize: 28, margin: '6px 0 0', fontWeight: 500, letterSpacing: '-0.02em' }}>Your queue</h1>
        <div style={{ color: 'var(--fg-mute)', fontSize: 13, marginTop: 3 }}>
          {mine.length} assigned · {urgent.length} need a response
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, padding: '0 18px 14px', overflow: 'auto' }}>
        {['All', 'Editing', 'Revisions', 'Review'].map((t, i) => (
          <span
            key={t}
            className="chip"
            style={{
              background: i === 0 ? 'var(--fg)' : 'transparent',
              color: i === 0 ? 'var(--inverse)' : 'var(--fg-dim)',
              borderColor: i === 0 ? 'var(--fg)' : 'var(--line)',
              padding: '4px 10px',
              fontSize: 12,
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 14px 20px' }}>
        {mine.map((c) => (
          <div key={c.id} className="kcard" onClick={() => onPick(c)} style={{ marginBottom: 8, padding: 12 }}>
            <span className="stripe" style={{ background: CLIENT_BY_ID[c.client]?.stripe ?? '#444' }} />
            {c.unread && <span className="unread" />}
            <VideoPlaceholder width={48} height={86} meta={[c.length || '—', c.format]} />
            <div className="body">
              <div className="client" style={{ fontSize: 10 }}>
                {CLIENT_BY_ID[c.client]?.name} · <span style={{ color: 'var(--fg-faint)' }}>{c.id}</span>
              </div>
              <div className="title" style={{ fontSize: 14 }}>
                {c.title}
              </div>
              <div className="meta" style={{ fontSize: 11 }}>
                <StatusChip status={c.column} />
                <span className="mono" style={{ color: 'var(--fg-mute)' }}>
                  {c.due}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '10px 0 28px',
          display: 'flex',
          justifyContent: 'space-around',
          borderTop: '1px solid var(--line-subtle)',
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {(
          [
            { i: 'queue', l: 'Queue', a: true },
            { i: 'inbox', l: 'Inbox' },
            { i: 'users', l: 'Clients' },
            { i: 'cog', l: 'Me' },
          ] as const
        ).map((t) => (
          <div key={t.l} style={{ textAlign: 'center', color: t.a ? 'var(--fg)' : 'var(--fg-faint)' }}>
            <Icon name={t.i} size={20} />
            <div style={{ fontSize: 10, marginTop: 2 }}>{t.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
