import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

type Props = {
  icon?: IconName;
  title: ReactNode;
  body?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({ icon = 'inbox', title, body, action }: Props) {
  return (
    <div style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--fg-mute)' }}>
      <div
        style={{
          display: 'inline-flex',
          width: 36,
          height: 36,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--fg-faint)',
          border: '1px dashed var(--line)',
        }}
      >
        <Icon name={icon} size={16} />
      </div>
      <div style={{ marginTop: 12, color: 'var(--fg-dim)', fontSize: 13 }}>{title}</div>
      {body && <div style={{ marginTop: 4, fontSize: 12, color: 'var(--fg-mute)' }}>{body}</div>}
      {action && <div style={{ marginTop: 14 }}>{action}</div>}
    </div>
  );
}
