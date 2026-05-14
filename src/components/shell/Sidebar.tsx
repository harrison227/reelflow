'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CARDS, CLIENTS, NOTIFICATIONS } from '@/lib/mock-data';
import type { Role } from '@/lib/auth/permissions';
import { signOutAction } from '@/app/auth-actions';
import { Icon } from '@/components/ui/Icon';

export type SidebarUser = {
  name: string;
  email: string;
  role: Role;
};

const NAV = [
  { id: 'board', href: '/', icon: 'kanban' as const, label: 'Board' },
  { id: 'inbox', href: '/inbox', icon: 'inbox' as const, label: 'Inbox' },
  { id: 'clients', href: '/clients', icon: 'users' as const, label: 'Clients' },
  { id: 'settings', href: '/settings', icon: 'cog' as const, label: 'Settings' },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

function roleLabel(role: Role): string {
  if (role === 'va') return 'Virtual Assistant';
  return role === 'owner' ? 'Owner' : 'Editor';
}

export function Sidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;
  const myQueueCount = CARDS.filter((c) => c.assignee === 'maya' || c.assignee === 'jules').length;

  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px 14px' }}>
        <Icon name="logo" size={18} />
        <span style={{ fontWeight: 500, letterSpacing: '-0.005em' }}>Reelflow</span>
        <span style={{ flex: 1 }} />
        <span
          className="mono"
          style={{ fontSize: 9, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}
        >
          Studio
        </span>
      </div>

      {NAV.map((n) => {
        const active = isActive(pathname, n.href);
        return (
          <Link key={n.id} href={n.href} className={`nav-item ${active ? 'active' : ''}`}>
            <Icon name={n.icon} size={14} color={active ? 'var(--fg)' : 'var(--fg-mute)'} />
            <span>{n.label}</span>
            {n.id === 'inbox' && unreadCount > 0 && (
              <span className="mono count" style={{ color: 'var(--record)' }}>
                {unreadCount}
              </span>
            )}
          </Link>
        );
      })}

      <div className="sidebar-section">Views</div>
      <button
        type="button"
        className={`nav-item ${pathname === '/' ? 'active' : ''}`}
        onClick={() => router.push('/?scope=mine')}
      >
        <Icon name="queue" size={14} color="var(--fg-mute)" />
        <span>My queue</span>
        <span className="count">{myQueueCount}</span>
      </button>

      <div className="sidebar-section">Clients</div>
      {CLIENTS.map((c) => (
        <button key={c.id} type="button" className="nav-item" onClick={() => router.push(`/?scope=${c.id}`)}>
          <span className="stripe" style={{ background: c.stripe }} />
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
          <span className="count">{c.active}</span>
        </button>
      ))}

      <div style={{ flex: 1 }} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 8px',
          borderTop: '1px solid var(--line-subtle)',
        }}
      >
        <span className="avatar sm" title={user.email}>
          {initialsOf(user.name)}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 12,
              color: 'var(--fg)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user.name}
          </div>
          <div style={{ fontSize: 10, color: 'var(--fg-mute)' }}>{roleLabel(user.role)}</div>
        </div>
        <form action={signOutAction}>
          <button type="submit" className="btn ghost sm" title="Sign out">
            <Icon name="back" size={12} />
          </button>
        </form>
      </div>
    </aside>
  );
}
