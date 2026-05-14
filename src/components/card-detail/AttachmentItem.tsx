'use client';

import type { Attachment } from '@/components/ui-state';
import { useUIState } from '@/components/ui-state';
import { Icon } from '@/components/ui/Icon';

function formatBytes(bytes?: number): string {
  if (bytes == null) return '';
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes / 1024;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[i]}`;
}

// Folder embeds are a file grid (shorter); media embeds get a 16:9 stage.
function embedHeight(provider: Attachment['provider']): number {
  return provider === 'gdrive-folder' ? 260 : 320;
}

export function AttachmentItem({ cardId, attachment }: { cardId: string; attachment: Attachment }) {
  const { removeAttachment } = useUIState();
  const remove = () => removeAttachment(cardId, attachment.id);

  if (attachment.kind === 'file') {
    return (
      <div className="attach-card" style={{ marginBottom: 8 }}>
        <div className="ico" style={{ width: 28, height: 28, flex: 'none' }}>
          <Icon name="file" size={14} />
        </div>
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
            {attachment.fileName}
          </div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--fg-faint)', marginTop: 2 }}>
            {formatBytes(attachment.fileSize)} · local reference — not yet uploaded to cloud storage
          </div>
        </div>
        <button type="button" className="btn ghost sm" onClick={remove} title="Remove">
          <Icon name="x" size={12} />
        </button>
      </div>
    );
  }

  const header = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: attachment.embedUrl ? 8 : 0 }}>
      <span className="attach-badge">{attachment.label}</span>
      <a
        href={attachment.url}
        target="_blank"
        rel="noreferrer noopener"
        style={{
          flex: 1,
          minWidth: 0,
          fontSize: 11,
          color: 'var(--fg-mute)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {attachment.url}
      </a>
      <a href={attachment.url} target="_blank" rel="noreferrer noopener" className="btn ghost sm" title="Open in new tab">
        <Icon name="link" size={12} />
      </a>
      <button type="button" className="btn ghost sm" onClick={remove} title="Remove">
        <Icon name="x" size={12} />
      </button>
    </div>
  );

  if (attachment.embedUrl) {
    return (
      <div style={{ marginBottom: 12 }}>
        {header}
        <div className="attach-embed">
          <iframe
            src={attachment.embedUrl}
            title={attachment.label}
            height={embedHeight(attachment.provider)}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  // Non-embeddable provider (Dropbox / Frame.io / WeTransfer / generic) — link card only.
  return (
    <div className="attach-card" style={{ marginBottom: 8 }}>
      <span className="attach-badge">{attachment.label}</span>
      <a
        href={attachment.url}
        target="_blank"
        rel="noreferrer noopener"
        style={{
          flex: 1,
          minWidth: 0,
          fontSize: 12,
          color: 'var(--fg-dim)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {attachment.url}
      </a>
      <a href={attachment.url} target="_blank" rel="noreferrer noopener" className="btn ghost sm" title="Open in new tab">
        <Icon name="link" size={12} />
      </a>
      <button type="button" className="btn ghost sm" onClick={remove} title="Remove">
        <Icon name="x" size={12} />
      </button>
    </div>
  );
}
