import type { CSSProperties } from 'react';

type Props = {
  width?: number | string;
  height?: number | string;
  label?: string;
  meta?: [string, string];
  playing?: boolean;
  style?: CSSProperties;
};

export function VideoPlaceholder({ width, height, label, meta, playing = false, style = {} }: Props) {
  return (
    <div
      className={'video-placeholder' + (playing ? ' playing' : '')}
      style={{ width: width ?? 'auto', height: height ?? 'auto', borderRadius: 4, ...style }}
    >
      {label && (
        <div style={{ position: 'absolute', top: 6, left: 8, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-faint)' }}>
          {label}
        </div>
      )}
      {meta && (
        <div className="vp-meta">
          <span>{meta[0]}</span>
          <span>{meta[1]}</span>
        </div>
      )}
    </div>
  );
}
