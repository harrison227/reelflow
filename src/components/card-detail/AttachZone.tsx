'use client';

import { useRef, useState, type DragEvent } from 'react';
import { parseLink } from '@/lib/parse-link';
import { useUIState } from '@/components/ui-state';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

export function AttachZone({ cardId }: { cardId: string }) {
  const { addAttachment } = useUIState();
  const [dragOver, setDragOver] = useState(false);
  const [linkValue, setLinkValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const attachLink = (raw: string): boolean => {
    const parsed = parseLink(raw);
    if (!parsed) {
      setError('That doesn’t look like a valid link.');
      return false;
    }
    addAttachment(cardId, {
      kind: 'link',
      label: parsed.label,
      provider: parsed.provider,
      url: parsed.url,
      embedUrl: parsed.embedUrl,
      thumbnailUrl: parsed.thumbnailUrl,
    });
    setError(null);
    return true;
  };

  const attachFiles = (files: FileList | File[]) => {
    Array.from(files).forEach((f) => {
      addAttachment(cardId, {
        kind: 'file',
        label: f.name,
        fileName: f.name,
        fileSize: f.size,
      });
    });
    setError(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      attachFiles(e.dataTransfer.files);
      return;
    }
    const dropped =
      e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
    if (dropped) attachLink(dropped.split('\n')[0]!.trim());
  };

  const submitLink = () => {
    const value = linkValue.trim();
    if (!value) return;
    if (attachLink(value)) setLinkValue('');
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <div
        className={`attach-zone${dragOver ? ' dragover' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!dragOver) setDragOver(true);
        }}
        onDragLeave={(e) => {
          if (e.currentTarget === e.target) setDragOver(false);
        }}
        onDrop={handleDrop}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: 'var(--panel-2)',
              border: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
            }}
          >
            <Icon name="paperclip" size={14} />
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, color: 'var(--fg)' }}>Attach a file or paste a link</div>
            <div style={{ fontSize: 11, color: 'var(--fg-mute)', marginTop: 1 }}>
              Google Drive, Loom, Komodo, YouTube &amp; Vimeo links embed inline. Drop files here too.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <input
            className="input"
            value={linkValue}
            placeholder="Paste a link — e.g. drive.google.com/file/d/…"
            onChange={(e) => {
              setLinkValue(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitLink();
            }}
          />
          <Button variant="primary" icon="plus" onClick={submitLink} disabled={!linkValue.trim()}>
            Add
          </Button>
          <Button icon="upload" onClick={() => fileInputRef.current?.click()}>
            Browse
          </Button>
        </div>

        {error && (
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--record)' }}>{error}</div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files) attachFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}
