'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Kbd } from '@/components/ui/Kbd';

type Stage = 'setup' | 'recording';

function fmt(s: number): string {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function ToggleCard({ icon, label, sub }: { icon: IconName; label: string; sub: string }) {
  const [on, setOn] = useState(true);
  return (
    <button
      type="button"
      onClick={() => setOn((o) => !o)}
      style={{
        padding: '10px 12px',
        border: `1px solid ${on ? 'var(--line)' : 'var(--line-subtle)'}`,
        borderRadius: 8,
        cursor: 'pointer',
        background: on ? 'var(--panel)' : 'transparent',
        opacity: on ? 1 : 0.6,
        textAlign: 'left',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg)' }}>
        <Icon name={icon} size={14} color={on ? 'var(--fg)' : 'var(--fg-mute)'} />
        {label}
        <span style={{ flex: 1 }} />
        <span
          style={{
            width: 22,
            height: 12,
            borderRadius: 999,
            position: 'relative',
            background: on ? 'var(--fg)' : 'var(--fg-ghost)',
            transition: '0.15s',
            display: 'inline-block',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 1,
              left: on ? 11 : 1,
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: on ? '#000' : 'var(--fg-mute)',
              transition: '0.15s',
            }}
          />
        </span>
      </div>
      <div style={{ fontSize: 11, color: 'var(--fg-mute)', marginTop: 4 }}>{sub}</div>
    </button>
  );
}

export function LoomRecorderModal({ onClose }: { onClose: () => void }) {
  const [stage, setStage] = useState<Stage>('setup');
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (stage !== 'recording') return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [stage]);

  return (
    <div className="overlay" onClick={onClose}>
      <div
        style={{
          width: 480,
          background: 'var(--panel)',
          border: '1px solid var(--line)',
          borderRadius: 12,
          padding: 24,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--record-soft)',
              color: 'var(--record)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="record" size={14} color="var(--record)" />
          </span>
          <div>
            <div style={{ fontSize: 14, color: 'var(--fg)', fontWeight: 500 }}>
              {stage === 'setup' ? 'Record feedback' : 'Recording over v3'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg-mute)' }}>
              {stage === 'setup'
                ? 'Loom — screen + camera, attaches to V-241 thread'
                : 'Loom · attaches to V-241 thread'}
            </div>
          </div>
          <span style={{ flex: 1 }} />
          <button type="button" className="btn ghost sm" onClick={onClose}>
            <Icon name="x" size={13} />
          </button>
        </div>

        <div style={{ height: 18 }} />

        {stage === 'setup' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <ToggleCard icon="monitor" label="Capture" sub="Player only · current tab" />
              <ToggleCard icon="mic" label="Microphone" sub="MacBook Pro · Built-in" />
              <ToggleCard icon="video" label="Camera" sub="Bubble · bottom-left" />
              <ToggleCard icon="lightning" label="Auto-attach" sub="To this revision thread" />
            </div>
            <div style={{ height: 18 }} />
            <Button
              variant="record"
              icon="record"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setStage('recording')}
            >
              Start recording — 3, 2, 1…
            </Button>
            <div style={{ marginTop: 10, textAlign: 'center', fontSize: 11, color: 'var(--fg-faint)' }}>
              Press <Kbd>R</Kbd> from the player to start instantly.
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                padding: 20,
                borderRadius: 10,
                background: 'var(--bg)',
                border: '1px solid var(--line-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: 'var(--record)',
                  boxShadow: '0 0 0 4px rgba(255,58,58,0.2)',
                  animation: 'pulse-record 1s ease-in-out infinite',
                }}
              />
              <span className="mono" style={{ fontSize: 22, color: 'var(--fg)' }}>
                {fmt(seconds)}
              </span>
              <span style={{ flex: 1 }} />
              <Button icon="pause">Pause</Button>
              <Button variant="primary" icon="check" onClick={onClose}>
                Stop &amp; attach
              </Button>
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--fg-mute)', textAlign: 'center' }}>
              Auto-attaches to V-241 · v3 thread on stop.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
