'use client';

import type { ThreadItem } from '@/lib/mock-data';
import { USERS } from '@/lib/mock-data';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';
import { LoomCard } from './LoomCard';

type Props = {
  thread: ThreadItem[];
  onOpenReview: () => void;
  onAttach: () => void;
};

export function ThreadView({ thread, onOpenReview, onAttach }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {thread.map((t) => (
        <ThreadItemRow key={t.id} item={t} onOpenReview={onOpenReview} />
      ))}
      <div style={{ height: 8 }} />
      <textarea
        className="input"
        placeholder="Reply, attach a file, or @mention…"
        style={{ fontFamily: 'var(--sans)' }}
      />
      <div style={{ display: 'flex', gap: 6 }}>
        <Button icon="paperclip" onClick={onAttach}>
          Attach
        </Button>
        <Button icon="at">Mention</Button>
        <span style={{ flex: 1 }} />
        <Button variant="record" icon="record" onClick={onOpenReview}>
          Record over WIP
        </Button>
        <Button variant="primary" icon="send">
          Send
        </Button>
      </div>
    </div>
  );
}

function ThreadItemRow({ item, onOpenReview }: { item: ThreadItem; onOpenReview: () => void }) {
  const u = USERS[item.who];

  if (item.kind === 'wip') {
    return (
      <div style={{ display: 'flex', gap: 12, position: 'relative' }}>
        <Avatar user={u} size="sm" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: 'var(--fg-dim)' }}>
            <b style={{ color: 'var(--fg)', fontWeight: 500 }}>{u.short}</b> uploaded{' '}
            <span className="mono" style={{ color: 'var(--fg)' }}>
              {item.version}
            </span>
            <span style={{ color: 'var(--fg-faint)', marginLeft: 8 }} className="mono">
              {item.when}
            </span>
          </div>
          <div
            style={{
              marginTop: 8,
              padding: 12,
              border: '1px solid var(--line-subtle)',
              borderRadius: 8,
              background: 'var(--panel)',
              display: 'flex',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <VideoPlaceholder width={40} height={72} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: 'var(--fg)' }}>{item.file.name}</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--fg-faint)', marginTop: 2 }}>
                {item.file.size} · {item.file.dur} · uploaded by {USERS[item.file.uploader].short}
              </div>
            </div>
            <Button icon="play" onClick={onOpenReview}>
              Watch
            </Button>
            <Button icon="download" size="sm" variant="ghost" />
          </div>
        </div>
      </div>
    );
  }

  if (item.kind === 'feedback') {
    return (
      <div style={{ display: 'flex', gap: 12, position: 'relative' }}>
        <Avatar user={u} size="sm" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: 'var(--fg-dim)' }}>
            <b style={{ color: 'var(--fg)', fontWeight: 500 }}>{u.short}</b> recorded feedback on{' '}
            <span className="mono">{item.version}</span>
            <span style={{ color: 'var(--fg-faint)', marginLeft: 8 }} className="mono">
              {item.when}
            </span>
          </div>
          <LoomCard loom={item.loom} onPlay={onOpenReview} />
        </div>
      </div>
    );
  }

  if (item.kind === 'upload') {
    return (
      <div style={{ display: 'flex', gap: 12 }}>
        <Avatar user={u} size="sm" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: 'var(--fg-dim)' }}>
            <b style={{ color: 'var(--fg)', fontWeight: 500 }}>{u.short}</b> {item.body}
            <span style={{ color: 'var(--fg-faint)', marginLeft: 8 }} className="mono">
              {item.when}
            </span>
          </div>
          <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {item.files.map((f, i) => (
              <div key={i} className="file-row">
                <div className="ico">
                  <Icon name="file" size={14} />
                </div>
                <div className="info">
                  <div className="name">{f.name}</div>
                  <div className="sub">
                    {f.size} · {f.dur}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--fg-mute)', padding: '2px 0' }}>
      <Avatar user={u} size="sm" />
      <div style={{ flex: 1 }}>
        <b style={{ color: 'var(--fg-dim)', fontWeight: 500 }}>{u.short}</b> {item.body}
        <span style={{ color: 'var(--fg-faint)', marginLeft: 8 }} className="mono">
          {item.when}
        </span>
      </div>
    </div>
  );
}
