'use client';

import { CLIENT_BY_ID, type MockCard } from '@/lib/mock-data';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';

export function PreviewPage({ card }: { card: MockCard }) {
  const c = CLIENT_BY_ID[card.client];
  return (
    <div className="preview-page">
      <div
        style={{
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'var(--panel-2)',
          borderBottom: '1px solid var(--line-subtle)',
          fontSize: 11,
          color: 'var(--fg-mute)',
          fontFamily: 'var(--mono)',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: c?.stripe ?? '#444' }} />
          <span>
            Preview for {c?.name} · expires in 7 days · {card.id}
          </span>
        </span>
        <span style={{ flex: 1 }} />
      </div>

      <div style={{ maxWidth: 940, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            className="mono"
            style={{
              fontSize: 11,
              color: 'var(--fg-faint)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {c?.name} · Review &amp; approval
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em', margin: '8px 0 6px' }}>
            {card.title}
          </h1>
          <div style={{ color: 'var(--fg-mute)', fontSize: 13 }}>
            v3 · {card.length} · {card.format} · prepared by Reelflow Studio
          </div>
        </div>

        <div style={{ maxWidth: 380, margin: '0 auto', aspectRatio: '9 / 16', position: 'relative' }}>
          <VideoPlaceholder width="100%" height="100%" style={{ borderRadius: 12, height: '100%' }} />
          <button
            type="button"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'var(--fg)',
                color: 'var(--inverse)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: 4,
              }}
            >
              <Icon name="play" size={20} />
            </span>
          </button>
        </div>

        <div
          style={{
            maxWidth: 540,
            margin: '40px auto 0',
            textAlign: 'center',
            color: 'var(--fg-dim)',
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          {card.brief}
        </div>

        <div
          style={{
            maxWidth: 540,
            margin: '32px auto 0',
            padding: 20,
            border: '1px solid var(--line-subtle)',
            borderRadius: 12,
            background: 'var(--panel)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Icon name="check" size={14} style={{ color: 'var(--ok)' }} />
            <div style={{ fontSize: 14, color: 'var(--fg)', fontWeight: 500 }}>Ready to approve?</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-mute)', marginBottom: 16 }}>
            One click approval. We&rsquo;ll deliver the final files to your team within 24 hours.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" size="lg" icon="check" style={{ flex: 1, justifyContent: 'center' }}>
              Approve &amp; deliver
            </Button>
            <Button size="lg" icon="comment" style={{ flex: 1, justifyContent: 'center' }}>
              Request changes
            </Button>
          </div>
        </div>

        <div style={{ marginTop: 60, textAlign: 'center', fontSize: 11, color: 'var(--fg-faint)' }}>
          <Icon name="logo" size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Sent by Reelflow Studio · reelflow.studio/preview/k4n2-x91d
        </div>
      </div>
    </div>
  );
}
