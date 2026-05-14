'use client';

import { USERS, type UserId } from '@/lib/mock-data';
import { Icon } from '@/components/ui/Icon';

export type Marker = {
  at: number;
  who: UserId;
  label: string;
};

type Props = {
  t: number;
  dur: number;
  markers: Marker[];
  onSeek: (t: number) => void;
  onTogglePlay: () => void;
  playing: boolean;
};

function fmt(s: number): string {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, '0')}`;
}

export function Scrubber({ t, dur, markers, onSeek, onTogglePlay, playing }: Props) {
  const pct = (t / dur) * 100;
  const myMarkers = markers.filter((m) => m.who === 'maya').length;

  return (
    <div>
      <div
        style={{ position: 'relative', height: 28, cursor: 'pointer' }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          onSeek(Math.max(0, Math.min(dur, x * dur)));
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 12,
            height: 4,
            background: 'var(--panel-2)',
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 12,
            height: 4,
            width: `${pct}%`,
            background: 'var(--fg)',
            borderRadius: 2,
          }}
        />
        {markers.map((m, i) => (
          <div
            key={i}
            title={m.label}
            style={{
              position: 'absolute',
              left: `${(m.at / dur) * 100}%`,
              top: 6,
              transform: 'translateX(-50%)',
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: m.who === 'maya' ? 'var(--record-soft)' : 'var(--panel-2)',
              border: `1px solid ${m.who === 'maya' ? 'var(--record)' : 'var(--line)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: 8,
                fontFamily: 'var(--mono)',
                color: m.who === 'maya' ? 'var(--record)' : 'var(--fg-dim)',
              }}
            >
              {USERS[m.who].initials[0]}
            </span>
          </div>
        ))}
        <div
          style={{
            position: 'absolute',
            left: `${pct}%`,
            top: 8,
            transform: 'translateX(-50%)',
            width: 2,
            height: 14,
            background: 'var(--fg)',
            borderRadius: 1,
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
        <button
          type="button"
          className="btn ghost"
          onClick={onTogglePlay}
          style={{ width: 30, height: 30, borderRadius: 6, padding: 0, justifyContent: 'center' }}
        >
          <Icon name={playing ? 'pause' : 'play'} size={14} />
        </button>
        <span className="mono" style={{ fontSize: 11, color: 'var(--fg-dim)' }}>
          {fmt(t)} <span style={{ color: 'var(--fg-faint)' }}>/ {fmt(dur)}</span>
        </span>
        <span style={{ flex: 1 }} />
        <span className="mono" style={{ fontSize: 10, color: 'var(--fg-faint)' }}>
          {markers.length} markers · {myMarkers} from you
        </span>
        <button type="button" className="btn ghost sm">
          <Icon name="cog" size={12} />
        </button>
      </div>
    </div>
  );
}
