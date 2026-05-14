'use client';

import { useActionState, useState, type ReactNode } from 'react';
import { signInAction, signUpAction, type AuthFormState } from '@/app/auth-actions';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

const initialState: AuthFormState = { error: null };

function FieldLabel({ children }: { children: ReactNode }) {
  return (
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
      {children}
    </label>
  );
}

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
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [signInState, signInFormAction, signInPending] = useActionState(signInAction, initialState);
  const [signUpState, signUpFormAction, signUpPending] = useActionState(signUpAction, initialState);

  const isSignup = mode === 'signup';
  const state = isSignup ? signUpState : signInState;
  const pending = isSignup ? signUpPending : signInPending;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'stretch' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: 320 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36 }}>
            <Icon name="logo" size={22} />
            <span style={{ fontWeight: 500, letterSpacing: '-0.01em' }}>Reelflow</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.015em', margin: '0 0 6px' }}>
            {isSignup ? 'Create your account' : 'Sign in'}
          </h1>
          <div style={{ color: 'var(--fg-mute)', fontSize: 13, marginBottom: 22 }}>
            {isSignup ? 'Set up your studio in a few seconds.' : 'Welcome back.'}
          </div>

          {/* key={mode} resets the fields when toggling between sign in / sign up */}
          <form action={isSignup ? signUpFormAction : signInFormAction} key={mode}>
            {isSignup && (
              <div style={{ marginBottom: 12 }}>
                <FieldLabel>Name</FieldLabel>
                <input
                  className="input"
                  name="name"
                  autoComplete="name"
                  placeholder="Harrison Macourt"
                  required
                />
              </div>
            )}
            <div style={{ marginBottom: 12 }}>
              <FieldLabel>Email</FieldLabel>
              <input
                className="input"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@studio.com"
                required
              />
            </div>
            <div>
              <FieldLabel>Password</FieldLabel>
              <input
                className="input"
                name="password"
                type="password"
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                placeholder={isSignup ? 'At least 8 characters' : '••••••••'}
                required
                minLength={isSignup ? 8 : undefined}
              />
            </div>

            {state.error && (
              <div style={{ marginTop: 10, fontSize: 12, color: 'var(--record)' }}>{state.error}</div>
            )}

            <Button
              variant="primary"
              size="lg"
              type="submit"
              disabled={pending}
              style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
            >
              {pending ? 'One moment…' : isSignup ? 'Create account' : 'Sign in'}
              {!pending && <Icon name="arrow-r" size={14} />}
            </Button>
          </form>

          <div style={{ marginTop: 18, fontSize: 12, color: 'var(--fg-mute)' }}>
            {isSignup ? 'Already have an account? ' : 'New here? '}
            <button
              type="button"
              onClick={() => setMode(isSignup ? 'signin' : 'signup')}
              style={{ color: 'var(--fg)', textDecoration: 'underline', textUnderlineOffset: 2 }}
            >
              {isSignup ? 'Sign in' : 'Create an account'}
            </button>
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
            Brief, raw, edit, review, deliver — every step on one card, with the video right where the work happens.
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
