'use client';

import type { MockCard } from '@/lib/mock-data';
import { CLIENT_BY_ID } from '@/lib/mock-data';
import { useUIState } from '@/components/ui-state';
import { VideoThumb } from '@/components/ui/VideoThumb';

// The first thing you see when you open a card: the attached video.
// If a link with an inline embed is attached (Google Drive, Loom, YouTube,
// Vimeo, Komodo) it plays here. Otherwise it shows the poster/gradient
// placeholder with a prompt to attach one.
export function CardVideo({ card, onAttach }: { card: MockCard; onAttach: () => void }) {
  const { attachments } = useUIState();
  const cardAttachments = attachments[card.id] ?? [];
  const video = [...cardAttachments].reverse().find((a) => a.kind === 'link' && a.embedUrl);
  const poster = [...cardAttachments].reverse().find((a) => a.kind === 'link' && a.thumbnailUrl)?.thumbnailUrl ?? null;
  const client = CLIENT_BY_ID[card.client];

  if (video?.embedUrl) {
    return (
      <div style={{ marginBottom: 22 }}>
        <div className="attach-embed">
          <iframe
            src={video.embedUrl}
            title={card.title}
            height={380}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div
          className="mono"
          style={{ marginTop: 6, fontSize: 10, color: 'var(--fg-faint)', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <span className="attach-badge">{video.label}</span>
          <a href={video.url} target="_blank" rel="noreferrer noopener" style={{ color: 'var(--fg-mute)' }}>
            open original
          </a>
        </div>
      </div>
    );
  }

  // No embeddable video — show the poster (or gradient) with an attach prompt.
  return (
    <div
      style={{
        marginBottom: 22,
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        padding: 16,
        border: '1px solid var(--line-subtle)',
        borderRadius: 10,
        background: 'var(--panel)',
      }}
    >
      <VideoThumb
        seed={card.id}
        clientColor={client?.stripe}
        thumbnailUrl={poster}
        width={120}
        height={Math.round((120 * 9) / 16)}
        format={card.format}
        rounded={6}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: 'var(--fg)' }}>No video attached yet</div>
        <div style={{ fontSize: 12, color: 'var(--fg-mute)', marginTop: 3, lineHeight: 1.5 }}>
          Paste a Google Drive or Loom link and it plays right here.
        </div>
        <button type="button" className="btn" style={{ marginTop: 10 }} onClick={onAttach}>
          Attach a video link
        </button>
      </div>
    </div>
  );
}
