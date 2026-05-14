'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mono" style={{ color: 'var(--fg)', fontSize: 16 }}>
        {value}
      </div>
      <div style={{ color: 'var(--fg-mute)', fontSize: 11, marginTop: 2 }}>{label}</div>
    </div>
  );
}

export function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('maya@reelflow.studio');

  const onSignIn = () => router.push('/');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'stretch' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: 320 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
            <Icon name="logo" size={22} />
            <span style={{ fontWeight: 500, letterSpacing: '-0.01em' }}>Reelflow</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.015em', margin: '0 0 6px' }}>Sign in</h1>
          <div style={{ color: 'var(--fg-mute)', fontSize: 13, marginBottom: 24 }}>Continue to your queue.</div>

          <label
            style={{
              display: 'block',
              fontSize: 11,
              color: 'var(--fg-mute)',
              fontFamily: 'var(--mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 6,
            }}
          >
            Email
          </label>
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@studio.com"
          />
          <Button
            variant="primary"
            size="lg"
            style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
            onClick={onSignIn}
          >
            Continue <Icon name="arrow-r" size={14} />
          </Button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              margin: '20px 0',
              color: 'var(--fg-faint)',
              fontSize: 11,
            }}
          >
            <div style={{ flex: 1, height: 1, background: 'var(--line-subtle)' }} />
            <span>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--line-subtle)' }} />
          </div>

          <Button size="lg" style={{ width: '100%', justifyContent: 'center' }} onClick={onSignIn}>
            <Icon name="globe" size={14} /> Continue with Google
          </Button>
          <Button size="lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={onSignIn}>
            <Icon name="link" size={14} /> Magic link
          </Button>

          <div style={{ marginTop: 28, fontSize: 11, color: 'var(--fg-faint)' }}>
            Invited by your studio admin? Use the link they sent.
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          borderLeft: '1px solid var(--line-subtle)',
          background: 'var(--panel)',
          padding: 60,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ marginTop: 'auto', maxWidth: 380 }}>
          <div
            className="mono"
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--fg-faint)',
            }}
          >
            Built for one workflow
          </div>
          <p
            style={{
              fontSize: 22,
              fontWeight: 400,
              lineHeight: 1.35,
              color: 'var(--fg)',
              letterSpacing: '-0.01em',
              margin: '8px 0 0',
            }}
          >
            Brief, raw, edit, review, deliver — every step on one card. Loom feedback in the same place as the version
            it&rsquo;s about.
          </p>
        </div>
        <div style={{ marginTop: 40, display: 'flex', gap: 28, fontSize: 11, color: 'var(--fg-mute)' }}>
          <Stat label="Active cards" value="9" />
          <Stat label="This week" value="14 WIPs" />
          <Stat label="Avg. cycle" value="3.2 days" />
        </div>
      </div>
    </div>
  );
}
