'use client';

import type { FocusFiles, FileEntry } from '@/lib/mock-data';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { useUIState } from '@/components/ui-state';
import { AttachZone } from './AttachZone';
import { AttachmentItem } from './AttachmentItem';

function iconForFile(name: string): 'mic' | 'file' | 'video' {
  if (name.toLowerCase().endsWith('.wav')) return 'mic';
  if (name.toLowerCase().endsWith('.pdf')) return 'file';
  return 'video';
}

function Group({ title, items }: { title: string; items: FileEntry[] }) {
  if (items.length === 0) return null;
  return (
    <div style={{ marginBottom: 20 }}>
      <SectionLabel
        right={
          <span className="mono" style={{ fontSize: 10, color: 'var(--fg-faint)' }}>
            {items.length} files
          </span>
        }
      >
        {title}
      </SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((f, i) => (
          <div key={i} className="file-row">
            <div className="ico">
              <Icon name={iconForFile(f.name)} size={14} />
            </div>
            <div className="info">
              <div className="name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {f.name}
                {f.current && (
                  <span
                    className="chip status"
                    style={{ color: 'var(--fg)', background: 'var(--hover)', fontSize: 9 }}
                  >
                    CURRENT
                  </span>
                )}
                {f.version && !f.current && (
                  <span className="mono" style={{ color: 'var(--fg-faint)' }}>
                    {f.version}
                  </span>
                )}
              </div>
              <div className="sub">
                {f.size} · {f.dur} · {f.when}
              </div>
            </div>
            <Button icon="download" size="sm" variant="ghost" />
            <Button icon="more" size="sm" variant="ghost" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FilesView({ cardId, files }: { cardId: string; files: FocusFiles }) {
  const { attachments } = useUIState();
  const cardAttachments = attachments[cardId] ?? [];

  return (
    <div>
      <AttachZone cardId={cardId} />

      {cardAttachments.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <SectionLabel
            right={
              <span className="mono" style={{ fontSize: 10, color: 'var(--fg-faint)' }}>
                {cardAttachments.length} attached
              </span>
            }
          >
            Attached
          </SectionLabel>
          {cardAttachments.map((a) => (
            <AttachmentItem key={a.id} cardId={cardId} attachment={a} />
          ))}
        </div>
      )}

      <Group title="Work-in-progress" items={files.wips} />
      <Group title="Raw footage" items={files.raw} />
      <Group title="References" items={files.refs} />
    </div>
  );
}
