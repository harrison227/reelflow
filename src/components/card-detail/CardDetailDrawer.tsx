'use client';

import { useRef, type ReactNode } from 'react';
import { CLIENT_BY_ID, FOCUS_CARD_ID, FOCUS_FILES, FOCUS_THREAD, USERS, type MockCard } from '@/lib/mock-data';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { StatusChip } from '@/components/ui/StatusChip';
import { CardVideo } from './CardVideo';
import { ThreadView } from './ThreadView';
import { BriefView } from './BriefView';
import { FilesView } from './FilesView';

type Props = {
  card: MockCard;
  onClose: () => void;
};

function SidebarRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '6px 0', fontSize: 12 }}>
      <div style={{ width: 80, color: 'var(--fg-mute)', flex: 'none' }}>{label}</div>
      <div style={{ flex: 1, color: 'var(--fg)' }}>{children}</div>
    </div>
  );
}

function Section({ children, divided = true }: { children: ReactNode; divided?: boolean }) {
  return (
    <div
      style={{
        marginTop: divided ? 24 : 0,
        paddingTop: divided ? 24 : 0,
        borderTop: divided ? '1px solid var(--line-subtle)' : 'none',
      }}
    >
      {children}
    </div>
  );
}

export function CardDetailDrawer({ card, onClose }: Props) {
  const client = CLIENT_BY_ID[card.client];
  const assignee = card.assignee ? USERS[card.assignee] : null;
  const isFocus = card.id === FOCUS_CARD_ID;
  const thread = isFocus ? FOCUS_THREAD : [];
  const files = isFocus ? FOCUS_FILES : { raw: [], wips: [], refs: [] };
  const filesRef = useRef<HTMLDivElement>(null);

  const scrollToFiles = () => filesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

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
            <span>{card.format}</span>
          </div>

          {/* The video is the first thing — plays inline if a link is attached. */}
          <CardVideo card={card} onAttach={scrollToFiles} />

          <Section>
            <BriefView card={card} />
          </Section>

          <Section>
            <div ref={filesRef}>
              <SectionLabel>Files &amp; attachments</SectionLabel>
              <FilesView cardId={card.id} files={files} />
            </div>
          </Section>

          <Section>
            <SectionLabel>Activity</SectionLabel>
            <ThreadView thread={thread} onAttach={scrollToFiles} />
          </Section>
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
          <SidebarRow label="Format">
            <span className="mono">{card.format}</span>
          </SidebarRow>
          <SidebarRow label="Version">
            <span className="mono">v{card.versions || 0}</span>
          </SidebarRow>

          <div style={{ height: 14 }} />
          <SectionLabel>Deliverables</SectionLabel>
          {card.deliverables.length > 0 ? (
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
          ) : (
            <div style={{ fontSize: 12, color: 'var(--fg-faint)' }}>None set</div>
          )}

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
