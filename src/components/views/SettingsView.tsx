'use client';

import { useState } from 'react';
import { USERS } from '@/lib/mock-data';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SectionLabel } from '@/components/ui/SectionLabel';

type Tab = 'team' | 'notif' | 'integ' | 'storage' | 'billing';

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div style={{ padding: 14, border: '1px solid var(--line-subtle)', borderRadius: 10, background: 'var(--panel)' }}>
      <div
        className="mono"
        style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-faint)' }}
      >
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 500, color: 'var(--fg)', marginTop: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-mute)', marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function TeamSettings() {
  const users = Object.values(USERS);
  const matrix: Array<[string, boolean, boolean, boolean]> = [
    ['See all clients', true, false, true],
    ['Approve videos', true, false, false],
    ['Record feedback', true, false, false],
    ['Upload raw footage', true, false, true],
    ['Upload WIP', false, true, false],
    ['Generate client preview links', true, false, true],
    ['See billing', true, false, false],
  ];
  return (
    <div>
      <SectionLabel right={<Button icon="plus">Invite</Button>}>Team — 3 members</SectionLabel>
      <div style={{ border: '1px solid var(--line-subtle)', borderRadius: 8, overflow: 'hidden' }}>
        {users.map((u, i) => (
          <div
            key={u.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              borderBottom: i === users.length - 1 ? 'none' : '1px solid var(--line-subtle)',
            }}
          >
            <Avatar user={u} size="lg" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--fg)' }}>{u.name}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-mute)' }}>{u.id}@reelflow.studio</div>
            </div>
            <span className="chip" style={{ color: 'var(--fg-dim)', textTransform: 'capitalize' }}>
              {u.role === 'va' ? 'Virtual Assistant' : u.role}
            </span>
            <Button icon="more" variant="ghost" />
          </div>
        ))}
      </div>

      <div style={{ height: 28 }} />
      <SectionLabel>Role permissions</SectionLabel>
      <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ color: 'var(--fg-mute)', textAlign: 'left' }}>
            <th style={{ padding: '8px 0', fontWeight: 400 }}>Capability</th>
            <th style={{ padding: '8px 12px', fontWeight: 400 }}>Owner</th>
            <th style={{ padding: '8px 12px', fontWeight: 400 }}>Editor</th>
            <th style={{ padding: '8px 12px', fontWeight: 400 }}>VA</th>
          </tr>
        </thead>
        <tbody>
          {matrix.map((row) => (
            <tr key={row[0]} style={{ borderTop: '1px solid var(--line-subtle)' }}>
              <td style={{ padding: '10px 0', color: 'var(--fg)' }}>{row[0]}</td>
              {row.slice(1).map((v, i) => (
                <td key={i} style={{ padding: '10px 12px', color: v ? 'var(--fg-dim)' : 'var(--fg-faint)' }}>
                  {v ? <Icon name="check" size={13} /> : <span className="mono">—</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NotifSettings() {
  const events = [
    'A video is assigned to me',
    'A WIP is uploaded on a card I review',
    'Feedback is recorded on my WIP',
    'My card is approved',
    'A deadline is < 48h away',
    'Someone @mentions me',
    'A preview link is generated',
  ];
  return (
    <div>
      <SectionLabel>Notify me when…</SectionLabel>
      <div style={{ border: '1px solid var(--line-subtle)', borderRadius: 8 }}>
        <div
          style={{
            display: 'flex',
            padding: '10px 14px',
            borderBottom: '1px solid var(--line-subtle)',
            color: 'var(--fg-mute)',
            fontSize: 11,
            fontFamily: 'var(--mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          <span style={{ flex: 1 }}>Event</span>
          <span style={{ width: 60, textAlign: 'center' }}>In-app</span>
          <span style={{ width: 60, textAlign: 'center' }}>Email</span>
        </div>
        {events.map((e, i) => (
          <div
            key={e}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 14px',
              borderBottom: i === events.length - 1 ? 'none' : '1px solid var(--line-subtle)',
              fontSize: 13,
            }}
          >
            <span style={{ flex: 1 }}>{e}</span>
            <span style={{ width: 60, textAlign: 'center' }}>
              <Icon name="check" size={13} />
            </span>
            <span style={{ width: 60, textAlign: 'center' }}>
              {i % 3 !== 1 ? (
                <Icon name="check" size={13} />
              ) : (
                <span className="mono" style={{ color: 'var(--fg-faint)' }}>
                  —
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
      <div style={{ height: 24 }} />
      <SectionLabel>Quiet hours</SectionLabel>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: 'var(--fg-dim)' }}>
        Mute email between
        <input className="input" defaultValue="22:00" style={{ width: 90, fontFamily: 'var(--mono)' }} />
        and
        <input className="input" defaultValue="07:00" style={{ width: 90, fontFamily: 'var(--mono)' }} />
      </div>
    </div>
  );
}

function IntegrationsSettings() {
  const integrations = [
    {
      name: 'Loom',
      desc: 'Launch the Loom recorder inside cards. Recordings auto-attach to the active revision.',
      status: 'Connected · maya@reelflow.studio',
      on: true,
    },
    {
      name: 'Google Drive',
      desc: 'Pull raw footage from shoot drives directly into Reelflow.',
      status: 'Connected · 2 drives',
      on: true,
    },
    {
      name: 'Frame.io',
      desc: 'Mirror approved files to Frame.io for client review fallback.',
      status: 'Not connected',
      on: false,
    },
    { name: 'Slack', desc: 'Mirror notifications into a Slack channel.', status: 'Not connected', on: false },
  ];
  return (
    <div>
      {integrations.map((it) => (
        <div
          key={it.name}
          className="card"
          style={{ padding: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 14 }}
        >
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'var(--panel-2)',
              border: '1px solid var(--line-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--fg-dim)',
              fontFamily: 'var(--mono)',
              fontSize: 11,
            }}
          >
            {it.name[0]}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: 'var(--fg)', fontWeight: 500 }}>{it.name}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-mute)', marginTop: 2 }}>{it.desc}</div>
            <div
              className="mono"
              style={{ fontSize: 10, color: it.on ? 'var(--ok)' : 'var(--fg-faint)', marginTop: 6 }}
            >
              {it.status}
            </div>
          </div>
          <Button variant={it.on ? '' : 'primary'}>{it.on ? 'Manage' : 'Connect'}</Button>
        </div>
      ))}
    </div>
  );
}

function StorageSettings() {
  return (
    <div>
      <SectionLabel>This month</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <StatCard label="Used" value="2.4 TB" sub="of 5 TB · 47%" />
        <StatCard label="Raw uploads" value="184 GB" sub="this week" />
        <StatCard label="Outbound" value="48 GB" sub="preview links served" />
      </div>
      <SectionLabel>Retention</SectionLabel>
      <div style={{ fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.6 }}>
        Raw footage stays 90 days after card approval, then archives to cold storage. WIPs stay forever.
      </div>
    </div>
  );
}

function BillingSettings() {
  return (
    <div>
      <div className="card" style={{ padding: 20 }}>
        <div
          className="mono"
          style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-faint)' }}
        >
          Studio plan
        </div>
        <div style={{ fontSize: 28, fontWeight: 500, marginTop: 6 }}>
          $240 <span style={{ fontSize: 14, color: 'var(--fg-mute)' }}>/ month</span>
        </div>
        <div style={{ color: 'var(--fg-mute)', fontSize: 12, marginTop: 4 }}>
          3 seats · 5 TB storage · unlimited clients
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <Button>Change plan</Button>
          <Button variant="ghost">Download invoices</Button>
        </div>
      </div>
    </div>
  );
}

export function SettingsView() {
  const [tab, setTab] = useState<Tab>('team');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '20px 24px 0' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.015em', margin: 0 }}>Settings</h1>
      </div>
      <div className="tabs" style={{ padding: '0 24px', marginTop: 16 }}>
        {(
          [
            ['team', 'Team & permissions'],
            ['notif', 'Notifications'],
            ['integ', 'Integrations'],
            ['storage', 'Storage'],
            ['billing', 'Billing'],
          ] as const
        ).map(([k, l]) => (
          <button key={k} type="button" className={`tab ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>
            {l}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 60px' }}>
        {tab === 'team' && <TeamSettings />}
        {tab === 'notif' && <NotifSettings />}
        {tab === 'integ' && <IntegrationsSettings />}
        {tab === 'storage' && <StorageSettings />}
        {tab === 'billing' && <BillingSettings />}
      </div>
    </div>
  );
}
