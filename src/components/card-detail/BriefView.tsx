'use client';

import type { MockCard } from '@/lib/mock-data';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';

export function BriefView({ card }: { card: MockCard }) {
  return (
    <div style={{ fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.6 }}>
      <SectionLabel>Brief</SectionLabel>
      <p style={{ marginTop: 0 }}>{card.brief}</p>
      <div style={{ height: 18 }} />
      <SectionLabel>Hook</SectionLabel>
      <p style={{ marginTop: 0 }}>&ldquo;You won&rsquo;t believe what this client just told me on the phone.&rdquo;</p>
      <div style={{ height: 18 }} />
      <SectionLabel>References</SectionLabel>
      <div style={{ display: 'flex', gap: 8 }}>
        <VideoPlaceholder width={64} height={114} meta={['ref', '0:38']} />
        <VideoPlaceholder width={64} height={114} meta={['ref', '0:42']} />
      </div>
      <div style={{ height: 18 }} />
      <SectionLabel>Output specs</SectionLabel>
      <table className="mono" style={{ fontSize: 12, color: 'var(--fg-dim)', borderCollapse: 'collapse' }}>
        <tbody>
          {(
            [
              ['Aspect', card.format],
              ['Resolution', '1080 × 1920'],
              ['Codec', 'H.264 · 12 Mbps'],
              ['Framerate', '30 fps'],
              ['Audio', '-14 LUFS · stereo'],
              ['Length', card.length],
            ] as const
          ).map(([k, v]) => (
            <tr key={k}>
              <td style={{ padding: '3px 24px 3px 0', color: 'var(--fg-mute)' }}>{k}</td>
              <td>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
