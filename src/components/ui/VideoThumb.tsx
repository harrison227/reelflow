'use client';

import { useEffect, useState, type CSSProperties } from 'react';

type Props = {
  seed: string;
  clientColor?: string;
  width?: number | string;
  height?: number | string;
  format?: string;
  rounded?: number;
  thumbnailUrl?: string | null;
  style?: CSSProperties;
};

// A "cover frame" for a video. When the card has an attached link that
// exposes a poster (Google Drive file, YouTube), that real frame grab is
// shown; otherwise it falls back to a client-tinted gradient placeholder.
// If the poster fails to load (e.g. a Drive file that isn't shared) it
// falls back to the gradient too.
export function VideoThumb({
  seed,
  clientColor = 'var(--fg-mute)',
  width,
  height,
  format,
  rounded = 4,
  thumbnailUrl,
  style,
}: Props) {
  const hash = Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const angle = 115 + (hash % 80);
  const shift = 14 + (hash % 18);

  const [imgFailed, setImgFailed] = useState(false);
  // Reset the failure flag if the thumbnail URL changes (e.g. a new attachment).
  useEffect(() => setImgFailed(false), [thumbnailUrl]);
  const showImage = Boolean(thumbnailUrl) && !imgFailed;

  return (
    <div
      style={{
        width: width ?? 'auto',
        height: height ?? 'auto',
        borderRadius: rounded,
        position: 'relative',
        overflow: 'hidden',
        flex: 'none',
        border: '1px solid var(--line)',
        background: showImage
          ? 'var(--panel-2)'
          : `linear-gradient(${angle}deg, color-mix(in srgb, ${clientColor} ${shift + 20}%, var(--panel-2)) 0%, color-mix(in srgb, ${clientColor} 10%, var(--panel)) 68%, var(--panel) 100%)`,
        ...style,
      }}
    >
      {showImage && thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      {!showImage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.045) 0 1px, transparent 1px 3px)',
            opacity: 0.6,
            pointerEvents: 'none',
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 38%, transparent 38%, rgba(0,0,0,0.34) 100%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span
          style={{
            width: '46%',
            maxWidth: 24,
            aspectRatio: '1',
            borderRadius: '50%',
            background: 'rgba(8,8,8,0.5)',
            border: '1px solid rgba(255,255,255,0.24)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg viewBox="0 0 16 16" width="44%" height="44%" style={{ marginLeft: '9%' }}>
            <path d="M4.5 3L13 8l-8.5 5z" fill="rgba(255,255,255,0.92)" />
          </svg>
        </span>
      </div>
      {format && (
        <span
          style={{
            position: 'absolute',
            bottom: 3,
            right: 3,
            fontFamily: 'var(--mono)',
            fontSize: 8,
            lineHeight: 1.5,
            color: 'rgba(255,255,255,0.8)',
            background: 'rgba(0,0,0,0.5)',
            padding: '0 3px',
            borderRadius: 2,
          }}
        >
          {format}
        </span>
      )}
    </div>
  );
}
