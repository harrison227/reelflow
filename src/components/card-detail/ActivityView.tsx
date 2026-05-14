'use client';

import type { ActivityEntry } from '@/lib/mock-data';
import { USERS } from '@/lib/mock-data';
import { Avatar } from '@/components/ui/Avatar';

export function ActivityView({ activity }: { activity: ActivityEntry[] }) {
  return (
    <div>
      {activity.map((a, i) => (
        <div key={i} className="act">
          <span className="when">{a.when}</span>
          <Avatar user={a.who} size="sm" />
          <div style={{ flex: 1 }}>
            <b style={{ color: 'var(--fg)', fontWeight: 500 }}>{USERS[a.who].short}</b> {a.what}
          </div>
        </div>
      ))}
    </div>
  );
}
