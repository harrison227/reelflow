'use client';

import type { LoomFeedback } from '@/lib/mock-data';
import { Icon } from '@/components/ui/Icon';

export function LoomCard({ loom, onPlay }: { loom: LoomFeedback; onPlay: () => void }) {
  return (
    <div
      style={{
        marginTop: 8,
        padding: 12,
        borderRadius: 8,
        border: '1px solid var(--line-subtle)',
        background: 'var(--panel)',
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div
          style={{
            width: 132,
            height: 80,
            borderRadius: 5,
            flex: 'none',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #1a1a1a, #0a0a0a)',
            border: '1px solid var(--line-subtle)',
          }}
        >
          <button
            type="button"
            onClick={onPlay}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.3)',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--fg)',
                color: 'var(--inverse)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: 2,
              }}
            >
              <Icon name="play" size={14} />
            </span>
          </button>
          <div
            style={{
              position: 'absolute',
              bottom: 4,
              right: 4,
              fontFamily: 'var(--mono)',
              fontSize: 9,
              color: 'var(--fg)',
              padding: '1px 4px',
              borderRadius: 3,
              background: 'rgba(0,0,0,0.6)',
            }}
          >
            {loom.duration}
          </div>
          <svg viewBox="0 0 132 80" style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
            {Array.from({ length: 22 }).map((_, i) => {
              const h = 6 + ((i * 37) % 36);
              return <rect key={i} x={4 + i * 6} y={(80 - h) / 2} width="2" height={h} fill="#e8e6e1" />;
            })}
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, color: 'var(--fg)' }}>{loom.summary}</div>
          <ul style={{ margin: '8px 0 0', padding: 0, listStyle: 'none', fontSize: 12, color: 'var(--fg-dim)' }}>
            {loom.points.map((p, i) => (
              <li key={i} style={{ display: 'flex', gap: 8, padding: '2px 0', alignItems: 'flex-start' }}>
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    background: 'var(--fg-faint)',
                    marginTop: 7,
                    flex: 'none',
                  }}
                />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
