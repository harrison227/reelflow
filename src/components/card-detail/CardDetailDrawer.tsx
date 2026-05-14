'use client';

import { useState, type ReactNode } from 'react';
import { CLIENT_BY_ID, FOCUS_ACTIVITY, FOCUS_CARD_ID, FOCUS_FILES, FOCUS_THREAD, USERS, type MockCard } from '@/lib/mock-data';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { StatusChip } from '@/components/ui/StatusChip';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';
import { useUIState } from '@/components/ui-state';
import { ThreadView } from './ThreadView';
import { BriefView } from './BriefView';
import { FilesView } from './FilesView';
import { ActivityView } from './ActivityView';

type Tab = 'thread' | 'brief' | 'files' | 'activity';

type Props = {
  card: MockCard;
  onClose: () => void;
  onOpenReview: () => void;
};

function SidebarRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '6px 0', fontSize: 12 }}>
      <div style={{ width: 80, color: 'var(--fg-mute)', flex: 'none' }}>{label}</div>
      <div style={{ flex: 1, color: 'var(--fg)' }}>{children}</div>
    </div>
  );
}

export function CardDetailDrawer({ card, onClose, onOpenReview }: Props) {
  const [tab, setTab] = useState<Tab>('thread');
  const { attachments } = useUIState();
  const client = CLIENT_BY_ID[card.client];
  const assignee = card.assignee ? USERS[card.assignee] : null;
  const isFocus = card.id === FOCUS_CARD_ID;
  const thread = isFocus ? FOCUS_THREAD : [];
  const files = isFocus ? FOCUS_FILES : { raw: [], wips: [], refs: [] };
  const activity = isFocus ? FOCUS_ACTIVITY : [];
  const latestWip = files.wips[0];
  const fileCount =
    files.raw.length + files.wips.length + files.refs.length + (attachments[card.id]?.length ?? 0);

  return (
    <div className="drawer" onClick={(e) => e.stopPropagation()}>
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
        <span style={{ width: 4, height: 18, background: client?.stripe ?? '#444', borderRadius: 1 }} />
        <span className="mono" style={{ color: 'var(--fg-faint)', fontSize: 11 }}>
          {card.id}
        </span>
        <span style={{ color: 'var(--fg-faint)' }}>·</span>
        <span style={{ color: 'var(--fg-mute)', fontSize: 12 }}>{client?.name}</span>
        <span style={{ flex: 1 }} />
        <StatusChip status={card.column} />
        <button type="button" className="btn ghost sm" title="Copy link">
          <Icon name="link" size={13} />
        </button>
        <button type="button" className="btn ghost sm" title="More">
          <Icon name="more" size={13} />
        </button>
        <button type="button" className="btn ghost sm" onClick={onClose}>
          <Icon name="x" size={13} />
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: '20px 24px 80px' }}>
          <h1 style={{ fontSize: 24, fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.015em', color: 'var(--fg)' }}>
            {card.title}
          </h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              color: 'var(--fg-mute)',
              fontSize: 12,
              marginBottom: 20,
            }}
          >
            <span>Created {isFocus ? 'May 12 by Sam' : card.updated}</span>
            <span style={{ color: 'var(--fg-faint)' }}>·</span>
            <span>Due {card.due}</span>
            <span style={{ color: 'var(--fg-faint)' }}>·</span>
            <span>
              {card.length} · {card.format}
            </span>
          </div>

          {latestWip && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                background: 'var(--panel)',
                border: '1px solid var(--line-subtle)',
                borderRadius: 10,
                marginBottom: 24,
              }}
            >
              <VideoPlaceholder width={36} height={64} style={{ borderRadius: 4 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--fg)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  Current WIP
                  <span className="mono" style={{ color: 'var(--fg-mute)', fontSize: 11 }}>
                    {latestWip.version}
                  </span>
                </div>
                <div className="mono" style={{ color: 'var(--fg-faint)', fontSize: 11, marginTop: 2 }}>
                  {latestWip.name} · {latestWip.size} · {latestWip.dur} · {latestWip.when}
                </div>
              </div>
              <Button variant="record" icon="record" onClick={onOpenReview}>
                Review &amp; record
              </Button>
              <Button icon="play" onClick={onOpenReview}>
                Watch
              </Button>
            </div>
          )}

          <div className="tabs" style={{ marginBottom: 16 }}>
            {(['thread', 'brief', 'files', 'activity'] as const).map((t) => (
              <button
                key={t}
                type="button"
                className={`tab ${tab === t ? 'active' : ''}`}
                onClick={() => setTab(t)}
              >
                {t === 'thread' && 'Revision thread'}
                {t === 'brief' && 'Brief'}
                {t === 'files' && `Files (${fileCount})`}
                {t === 'activity' && 'Activity'}
              </button>
            ))}
          </div>

          {tab === 'thread' && (
            <ThreadView thread={thread} onOpenReview={onOpenReview} onAttach={() => setTab('files')} />
          )}
          {tab === 'brief' && <BriefView card={card} />}
          {tab === 'files' && <FilesView cardId={card.id} files={files} />}
          {tab === 'activity' && <ActivityView activity={activity} />}
        </div>

        <div style={{ width: 240, flex: 'none', borderLeft: '1px solid var(--line-subtle)', padding: 16, overflowY: 'auto' }}>
          <SidebarRow label="Status">
            <StatusChip status={card.column} />
          </SidebarRow>
          <SidebarRow label="Client">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: client?.stripe ?? '#444' }} />
              <span>{client?.name}</span>
            </span>
          </SidebarRow>
          <SidebarRow label="Assignee">
            {assignee ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Avatar user={assignee} size="sm" /> {assignee.name}
              </span>
            ) : (
              <span style={{ color: 'var(--fg-faint)' }}>Unassigned</span>
            )}
          </SidebarRow>
          <SidebarRow label="Reviewer">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Avatar user="maya" size="sm" /> Maya Chen
            </span>
          </SidebarRow>
          <SidebarRow label="Due">
            <span className="mono">{card.due}</span>
          </SidebarRow>
          <SidebarRow label="Length">
            <span className="mono">{card.length}</span>
          </SidebarRow>
          <SidebarRow label="Format">
            <span className="mono">{card.format}</span>
          </SidebarRow>
          <SidebarRow label="Version">
            <span className="mono">v{card.versions || 0}</span>
          </SidebarRow>

          <div style={{ height: 14 }} />
          <SectionLabel>Deliverables</SectionLabel>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 12, color: 'var(--fg-dim)' }}>
            {card.deliverables.map((d, i) => (
              <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '4px 0' }}>
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    background: 'var(--fg-faint)',
                    marginTop: 7,
                    flex: 'none',
                  }}
                />
                <span>{d}</span>
              </li>
            ))}
          </ul>

          {card.column === 'approved' && (
            <>
              <div style={{ height: 16 }} />
              <Button variant="primary" icon="globe" style={{ width: '100%' }}>
                Generate preview link
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
