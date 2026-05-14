'use client';

import { useState, type CSSProperties } from 'react';
import { CLIENTS, COLUMNS, USERS, type ClientId, type ColumnId, type UserId } from '@/lib/mock-data';
import { parseLink } from '@/lib/parse-link';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useUIState } from '@/components/ui-state';

const fieldLabel: CSSProperties = {
  display: 'block',
  fontSize: 11,
  color: 'var(--fg-mute)',
  fontFamily: 'var(--mono)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 6,
};

export function NewCardModal() {
  const { newCardColumn, closeNewCard, addCard, addAttachment } = useUIState();
  const [title, setTitle] = useState('');
  const [client, setClient] = useState<ClientId>('ppd');
  const [column, setColumn] = useState<ColumnId>(newCardColumn ?? 'brief');
  const [assignee, setAssignee] = useState<UserId | ''>('');
  const [due, setDue] = useState('');
  const [format, setFormat] = useState('9:16');
  const [videoLink, setVideoLink] = useState('');
  const [linkError, setLinkError] = useState<string | null>(null);

  const canSubmit = title.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    const link = videoLink.trim();
    // Validate the optional video link before creating anything.
    const parsed = link ? parseLink(link) : null;
    if (link && !parsed) {
      setLinkError('That doesn’t look like a valid link.');
      return;
    }
    const newId = addCard({
      title: title.trim(),
      client,
      column,
      assignee: assignee || null,
      due: due.trim(),
      format,
    });
    if (parsed) {
      addAttachment(newId, {
        kind: 'link',
        label: parsed.label,
        provider: parsed.provider,
        url: parsed.url,
        embedUrl: parsed.embedUrl,
        thumbnailUrl: parsed.thumbnailUrl,
      });
    }
    closeNewCard();
  };

  return (
    <div className="overlay" onClick={closeNewCard}>
      <div className="modal-panel" style={{ width: 460 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--panel-2)',
              border: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="plus" size={15} />
          </span>
          <div>
            <div style={{ fontSize: 14, color: 'var(--fg)', fontWeight: 500 }}>New card</div>
            <div style={{ fontSize: 11, color: 'var(--fg-mute)' }}>Add a video to the board</div>
          </div>
          <span style={{ flex: 1 }} />
          <button type="button" className="btn ghost sm" onClick={closeNewCard} aria-label="Close">
            <Icon name="x" size={13} />
          </button>
        </div>

        <label style={fieldLabel}>Title</label>
        <input
          className="input"
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Haynes Reel — testimonial cut"
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          <div>
            <label style={fieldLabel}>Client</label>
            <select className="input" value={client} onChange={(e) => setClient(e.target.value as ClientId)}>
              {CLIENTS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={fieldLabel}>Column</label>
            <select className="input" value={column} onChange={(e) => setColumn(e.target.value as ColumnId)}>
              {COLUMNS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={fieldLabel}>Assignee</label>
            <select
              className="input"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value as UserId | '')}
            >
              <option value="">Unassigned</option>
              {Object.values(USERS).map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={fieldLabel}>Due</label>
            <input
              className="input"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              placeholder="e.g. May 24"
            />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={fieldLabel}>Format</label>
          <select className="input" value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="9:16">9:16 — vertical</option>
            <option value="1:1">1:1 — square</option>
            <option value="16:9">16:9 — landscape</option>
          </select>
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={fieldLabel}>Video link — optional</label>
          <input
            className="input"
            value={videoLink}
            onChange={(e) => {
              setVideoLink(e.target.value);
              if (linkError) setLinkError(null);
            }}
            placeholder="Paste a Google Drive or Loom link"
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit();
            }}
          />
          {linkError && <div style={{ marginTop: 6, fontSize: 11, color: 'var(--record)' }}>{linkError}</div>}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <span style={{ flex: 1 }} />
          <Button onClick={closeNewCard}>Cancel</Button>
          <Button variant="primary" icon="plus" onClick={submit} disabled={!canSubmit}>
            Create card
          </Button>
        </div>
      </div>
    </div>
  );
}
