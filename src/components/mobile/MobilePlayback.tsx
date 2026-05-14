'use client';

import { useState } from 'react';
import type { MockCard } from '@/lib/mock-data';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';

export function MobilePlayback({ card, onBack }: { card: MockCard; onBack: () => void }) {
  const [paused, setPaused] = useState(false);
  return (
    <div data-theme="dark" style={{ flex: 1, position: 'relative', background: '#000', color: '#e8e6e1', overflow: 'hidden' }}>
      <VideoPlaceholder
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, borderRadius: 0 }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 20%, transparent 75%, rgba(0,0,0,0.85) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'absolute', top: 54, left: 14, right: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(20,20,20,0.6)',
            border: '1px solid var(--line-subtle)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
          }}
        >
          <Icon name="back" size={14} color="#fff" />
        </button>
        <div style={{ flex: 1, textAlign: 'center', color: '#fff', fontSize: 12 }}>
          <div style={{ color: 'var(--fg-mute)', fontSize: 10, fontFamily: 'var(--mono)' }}>
            {card.id} · v2 feedback
          </div>
          <div style={{ fontWeight: 500 }}>From Maya · 1:42</div>
        </div>
        <button
          type="button"
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(20,20,20,0.6)',
            border: '1px solid var(--line-subtle)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="more" size={14} color="#fff" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'rgba(232,230,225,0.92)',
          color: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: paused ? 4 : 0,
        }}
      >
        <Icon name={paused ? 'play' : 'pause'} size={22} color="#000" />
      </button>

      <div
        style={{
          position: 'absolute',
          bottom: 130,
          left: 14,
          width: 88,
          height: 88,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #222, #0a0a0a)',
          border: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Avatar user="maya" size="lg" />
        <div
          style={{
            position: 'absolute',
            bottom: 4,
            right: 4,
            width: 6,
            height: 6,
            borderRadius: 3,
            background: 'var(--record)',
          }}
        />
      </div>

      <div style={{ position: 'absolute', bottom: 30, left: 14, right: 14 }}>
        <div style={{ position: 'relative', height: 16, marginBottom: 10 }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 7,
              height: 2,
              background: 'rgba(255,255,255,0.18)',
              borderRadius: 1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 7,
              height: 2,
              width: '36%',
              background: 'var(--fg)',
              borderRadius: 1,
            }}
          />
          {[0.2, 0.45, 0.78].map((p, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${p * 100}%`,
                top: 4,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--record)',
                border: '1px solid #000',
              }}
            />
          ))}
          <div
            style={{
              position: 'absolute',
              left: '36%',
              top: 3,
              width: 2,
              height: 10,
              background: 'var(--fg)',
              borderRadius: 1,
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12,
            color: '#fff',
            fontFamily: 'var(--mono)',
            fontSize: 11,
          }}
        >
          <span>0:37</span>
          <span style={{ color: 'var(--fg-mute)' }}>/ 1:42</span>
          <span style={{ flex: 1 }} />
          <span style={{ color: 'var(--fg-mute)' }}>3 markers</span>
        </div>
        <Button
          icon="upload"
          size="lg"
          style={{
            width: '100%',
            justifyContent: 'center',
            background: 'var(--fg)',
            color: 'var(--inverse)',
          }}
        >
          Reply with WIP v3
        </Button>
      </div>
    </div>
  );
}
