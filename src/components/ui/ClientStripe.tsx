import type { CSSProperties } from 'react';
import { CLIENT_BY_ID } from '@/lib/mock-data';

export function ClientStripe({ clientId, style = {} }: { clientId: string; style?: CSSProperties }) {
  const c = CLIENT_BY_ID[clientId];
  return (
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: 2,
        background: c?.stripe ?? '#444',
        display: 'inline-block',
        flex: 'none',
        ...style,
      }}
    />
  );
}
