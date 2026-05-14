'use client';

import { useEffect, useState } from 'react';
import { CLIENT_BY_ID, FOCUS_THREAD, USERS, type MockCard, type ThreadItem } from '@/lib/mock-data';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';
import { LoomCard } from '@/components/card-detail/LoomCard';
import { Scrubber, type Marker } from './Scrubber';
import { LoomRecorderModal } from './LoomRecorderModal';

const MARKERS: Marker[] = [
  { at: 0.5, who: 'maya', label: 'Cold open tighter' },
  { at: 4.2, who: 'maya', label: 'Lower-third name' },
  { at: 12.6, who: 'jules', label: 'B-roll swap' },
  { at: 21.0, who: 'maya', label: 'Music dip here' },
  { at: 37.5, who: 'maya', label: 'CTA needs 4 more frames' },
];

const DUR = 42;

export function WIPReview({ card, onClose }: { card: MockCard; onClose: () => void }) {
  const [playing, setPlaying] = useState(true);
  const [t, setT] = useState(11);
  const [recordOpen, setRecordOpen] = useState(false);
  const client = CLIENT_BY_ID[card.client];

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT((x) => (x + 0.25) % DUR), 250);
    return () => clearInterval(id);
  }, [playing]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'r' && !e.metaKey && !e.ctrlKey && !recordOpen) {
        e.preventDefault();
        setRecordOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [recordOpen]);

  const threadItems = FOCUS_THREAD.filter(
    (x): x is Extract<ThreadItem, { kind: 'feedback' | 'wip' }> => x.kind === 'feedback' || x.kind === 'wip',
  )
    .slice()
    .reverse();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--bg)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          height: 44,
          borderBottom: '1px solid var(--line-subtle)',
          padding: '0 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <button type="button" className="btn ghost sm" onClick={onClose}>
          <Icon name="back" size={14} />
        </button>
        <span style={{ width: 4, height: 18, background: client?.stripe ?? '#444', borderRadius: 1 }} />
        <span className="mono" style={{ fontSize: 11, color: 'var(--fg-faint)' }}>
          {card.id}
        </span>
        <span style={{ fontSize: 13, color: 'var(--fg)' }}>{card.title}</span>
        <span className="chip" style={{ color: 'var(--fg-mute)' }}>
          v3 · current
        </span>
        <span style={{ flex: 1 }} />
        <span className="mono" style={{ fontSize: 11, color: 'var(--fg-faint)' }}>
          HAYNES_REEL_v3.mp4 · 178 MB
        </span>
        <Button icon="download" variant="ghost">
          Download
        </Button>
        <Button icon="check" variant="primary">
          Approve v3
        </Button>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 360px', minHeight: 0 }}>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px 24px',
              minHeight: 0,
            }}
          >
            <div style={{ position: 'relative', height: '100%', maxWidth: '100%', aspectRatio: '9 / 16' }}>
              <VideoPlaceholder
                width="100%"
                height="100%"
                playing={playing}
                style={{ borderRadius: 8, height: '100%' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    color: 'var(--fg-faint)',
                    fontFamily: 'var(--mono)',
                    fontSize: 11,
                  }}
                >
                  <Icon name="video" size={28} style={{ color: 'var(--fg-ghost)' }} />
                  <div style={{ marginTop: 6 }}>9:16 · 1080×1920</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setRecordOpen(true)}
                style={{
                  position: 'absolute',
                  right: -76,
                  bottom: 60,
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'var(--record)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid var(--bg)',
                  boxShadow: '0 0 0 6px rgba(255,58,58,0.18)',
                  cursor: 'pointer',
                }}
                title="Record feedback (R)"
              >
                <Icon name="record" size={22} color="#fff" />
              </button>
              <div
                style={{
                  position: 'absolute',
                  right: -76,
                  bottom: 32,
                  fontFamily: 'var(--mono)',
                  fontSize: 10,
                  color: 'var(--fg-mute)',
                  textAlign: 'center',
                  width: 60,
                }}
              >
                Rec · R
              </div>
            </div>
          </div>

          <div style={{ padding: '0 24px 18px' }}>
            <Scrubber
              t={t}
              dur={DUR}
              markers={MARKERS}
              onSeek={setT}
              onTogglePlay={() => setPlaying((p) => !p)}
              playing={playing}
            />
          </div>
        </div>

        <div
          style={{
            borderLeft: '1px solid var(--line-subtle)',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <div
            style={{
              padding: '12px 14px',
              borderBottom: '1px solid var(--line-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Icon name="comment" size={14} style={{ color: 'var(--fg-mute)' }} />
            <span style={{ fontSize: 13, color: 'var(--fg)' }}>Revision thread</span>
            <span className="mono" style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--fg-faint)' }}>
              v1 → v3
            </span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
            {threadItems.map((item) => (
              <div key={item.id} style={{ marginBottom: 14 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 6,
                    fontSize: 11,
                    color: 'var(--fg-mute)',
                  }}
                >
                  <Avatar user={item.who} size="sm" />
                  <b style={{ color: 'var(--fg-dim)', fontWeight: 500 }}>{USERS[item.who].short}</b>
                  <span>{item.kind === 'feedback' ? 'recorded' : 'uploaded'}</span>
                  <span className="mono" style={{ color: 'var(--fg-faint)' }}>
                    {item.version}
                  </span>
                  <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)' }}>{item.when}</span>
                </div>
                {item.kind === 'feedback' ? (
                  <LoomCard loom={item.loom} onPlay={() => {}} />
                ) : (
                  <div className="file-row">
                    <div className="ico">
                      <Icon name="video" size={14} />
                    </div>
                    <div className="info">
                      <div className="name">{item.file.name}</div>
                      <div className="sub">
                        {item.file.size} · {item.file.dur}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--line-subtle)', padding: 12 }}>
            <textarea className="input" placeholder="Add a note (or hit R to record)…" rows={2} />
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <Button icon="paperclip" variant="ghost" />
              <Button icon="at" variant="ghost" />
              <span style={{ flex: 1 }} />
              <Button variant="primary" icon="send" size="sm">
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>

      {recordOpen && <LoomRecorderModal onClose={() => setRecordOpen(false)} />}
    </div>
  );
}
