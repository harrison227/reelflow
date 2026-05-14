'use client';

import { useState } from 'react';
import { CARDS, type MockCard } from '@/lib/mock-data';
import { MobileQueue } from './MobileQueue';
import { MobileCard } from './MobileCard';
import { MobilePlayback } from './MobilePlayback';

type View = 'queue' | 'card' | 'playback';

const FALLBACK = CARDS.find((c) => c.id === 'V-241') ?? CARDS[0]!;

export function MobileEditor() {
  const [view, setView] = useState<View>('queue');
  const [card, setCard] = useState<MockCard>(FALLBACK);

  return (
    <div
      style={{
        background: '#000',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {view === 'queue' && (
        <MobileQueue
          onPick={(c) => {
            setCard(c);
            setView('card');
          }}
        />
      )}
      {view === 'card' && (
        <MobileCard card={card} onBack={() => setView('queue')} onPlay={() => setView('playback')} />
      )}
      {view === 'playback' && <MobilePlayback card={card} onBack={() => setView('card')} />}
    </div>
  );
}
