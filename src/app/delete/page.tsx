'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function DeletePage() {
  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [status,   setStatus]   = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');

  const canSubmit = username.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/request-deletion', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username: username.trim(), email: email.trim() }),
      });

      if (!res.ok) throw new Error();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--brand-800)', color: 'var(--text-primary)' }}
    >
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5"
        style={{ borderBottom: '1px solid oklch(1 0 0 / 0.08)' }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo size="md" />
        </Link>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full" style={{ maxWidth: '440px' }}>

          {status === 'sent' ? (
            /* ── Success state ── */
            <div className="text-center">
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-6"
                style={{ backgroundColor: 'oklch(1 0 0 / 0.06)', border: '1px solid oklch(1 0 0 / 0.1)' }}
              >
                <svg width={24} height={24} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 style={{ fontSize: 'var(--type-h4-size)', fontWeight: 700, marginBottom: '0.75rem' }}>
                Check your email
              </h1>
              <p style={{ fontSize: 'var(--type-body-md-size)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
                If that username and email match a portfolio, we've sent a confirmation link. Click it to permanently delete your portfolio.
              </p>
              <p style={{ fontSize: 'var(--type-body-sm-size)', color: 'var(--text-muted)' }}>
                The link expires in 24 hours.
              </p>
            </div>

          ) : (
            /* ── Request form ── */
            <>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: 'var(--type-h4-size)', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Delete your portfolio
                </h1>
                <p style={{ fontSize: 'var(--type-body-md-size)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Enter your portfolio username and the email you used when publishing. We'll send you a confirmation link.
                </p>
              </div>

              {/* Warning banner */}
              <div
                className="flex gap-3 p-4 rounded-xl mb-6"
                style={{
                  backgroundColor: 'oklch(0.40 0.15 25 / 0.15)',
                  border: '1px solid oklch(0.49 0.19 25 / 0.3)',
                }}
              >
                <svg width={18} height={18} fill="none" stroke="var(--text-error)" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <p style={{ fontSize: 'var(--type-body-sm-size)', color: 'var(--text-error)', lineHeight: 1.5, margin: 0 }}>
                  This is permanent. Your portfolio, URL, and all associated data will be deleted and cannot be recovered.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Input
                  label="Portfolio username"
                  placeholder="yourname"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  size="md"
                  helperText="The username in your portfolio URL (e.g. yourname.cvtoweb.com)"
                />
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  size="md"
                  helperText="The email you used when publishing"
                />

                {status === 'error' && (
                  <p style={{ fontSize: 'var(--type-body-sm-size)', color: 'var(--text-error)', margin: 0 }}>
                    Something went wrong. Please try again.
                  </p>
                )}

                <Button
                  variant="danger"
                  size="md"
                  disabled={!canSubmit}
                  loading={status === 'loading'}
                  onClick={handleSubmit}
                  style={{ marginTop: '0.5rem' }}
                >
                  Send deletion confirmation
                </Button>
              </form>

              <p style={{ fontSize: 'var(--type-body-sm-size)', color: 'var(--text-muted)', marginTop: '1.5rem', textAlign: 'center' }}>
                Changed your mind?{' '}
                <Link href="/" style={{ color: 'var(--text-brand)', textDecoration: 'none' }}>
                  Go back home
                </Link>
              </p>
            </>
          )}

        </div>
      </div>
    </main>
  );
}
