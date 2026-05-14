'use client';

import { CLIENT_BY_ID, FOCUS_FILES, type MockCard } from '@/lib/mock-data';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { StatusChip } from '@/components/ui/StatusChip';

type Props = {
  card: MockCard;
  onBack: () => void;
};

export function MobileCard({ card, onBack }: Props) {
  const client = CLIENT_BY_ID[card.client];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: 80 }}>
      <div style={{ padding: '54px 14px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button type="button" className="btn ghost sm" onClick={onBack}>
          <Icon name="back" size={14} />
        </button>
        <span style={{ width: 4, height: 16, background: client?.stripe ?? '#444', borderRadius: 1 }} />
        <span className="mono" style={{ color: 'var(--fg-faint)', fontSize: 11 }}>
          {card.id}
        </span>
        <span style={{ flex: 1 }} />
        <button type="button" className="btn ghost sm">
          <Icon name="more" size={14} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 18px 120px' }}>
        <div
          style={{
            fontSize: 11,
            color: 'var(--fg-mute)',
            fontFamily: 'var(--mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {client?.name}
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.015em', margin: '4px 0 12px' }}>
          {card.title}
        </h1>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 18 }}>
          <StatusChip status={card.column} />
          <span className="mono" style={{ color: 'var(--fg-mute)', fontSize: 11 }}>
            Due {card.due}
          </span>
        </div>

        <div className="section-label">Brief</div>
        <div style={{ fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.55, marginBottom: 18 }}>
          {card.brief.slice(0, 220)}
          {card.brief.length > 220 && '…'}
        </div>

        <div className="section-label">Files</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
          {FOCUS_FILES.wips.slice(0, 2).map((f, i) => (
            <div key={i} className="file-row" style={{ padding: 10 }}>
              <div className="ico">
                <Icon name="video" size={13} />
              </div>
              <div className="info">
                <div className="name">
                  {f.name}
                  {f.current && (
                    <span style={{ marginLeft: 4, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ok)' }}>
                      current
                    </span>
                  )}
                </div>
                <div className="sub">
                  {f.size} · {f.dur}
                </div>
              </div>
              <Button icon="download" size="sm" variant="ghost" />
            </div>
          ))}
        </div>

        <div className="section-label">Raw footage</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {FOCUS_FILES.raw.slice(0, 2).map((f, i) => (
            <div key={i} className="file-row" style={{ padding: 10 }}>
              <div className="ico">
                <Icon name="video" size={13} />
              </div>
              <div className="info">
                <div className="name">{f.name}</div>
                <div className="sub">
                  {f.size} · {f.dur}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px 14px 28px',
          borderTop: '1px solid var(--line-subtle)',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          gap: 8,
        }}
      >
        <Button icon="upload" size="lg" style={{ flex: 1, justifyContent: 'center' }}>
          Upload WIP v3
        </Button>
        <Button icon="comment" size="lg" variant="ghost" style={{ justifyContent: 'center' }} />
      </div>
    </div>
  );
}
