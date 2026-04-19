'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';

type Status = 'loading' | 'success' | 'expired' | 'invalid' | 'error';

function ConfirmContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status,   setStatus]   = useState<Status>('loading');
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!token) { setStatus('invalid'); return; }

    fetch(`/api/confirm-deletion?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsername(data.username ?? '');
          setStatus('success');
        } else if (data.error?.includes('expired')) {
          setStatus('expired');
        } else if (data.error?.includes('Invalid')) {
          setStatus('invalid');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [token]);

  const content: Record<Status, { icon: string; iconColor: string; title: string; body: string; cta?: React.ReactNode }> = {
    loading: {
      icon: '⏳', iconColor: 'var(--text-muted)',
      title: 'Deleting your portfolio…',
      body:  'Please wait while we process your request.',
    },
    success: {
      icon: '✓', iconColor: 'var(--success-400)',
      title: 'Portfolio deleted',
      body:  `${username ? `${username}.cvtoweb.com` : 'Your portfolio'} has been permanently deleted. All associated data has been removed.`,
      cta: (
        <Link href="/">
          <Button variant="primary" size="md">Create a new portfolio</Button>
        </Link>
      ),
    },
    expired: {
      icon: '!', iconColor: 'var(--warning-400)',
      title: 'Link expired',
      body:  'This deletion link has expired. Links are valid for 24 hours. Please submit a new request.',
      cta: (
        <Link href="/delete">
          <Button variant="secondary" size="md">Request again</Button>
        </Link>
      ),
    },
    invalid: {
      icon: '✕', iconColor: 'var(--text-error)',
      title: 'Invalid link',
      body:  'This deletion link is invalid or has already been used.',
      cta: (
        <Link href="/delete">
          <Button variant="secondary" size="md">Go to deletion page</Button>
        </Link>
      ),
    },
    error: {
      icon: '✕', iconColor: 'var(--text-error)',
      title: 'Something went wrong',
      body:  'We couldn\'t process your request. Please try again or contact carlyneket@gmail.com.',
      cta: (
        <Link href="/delete">
          <Button variant="secondary" size="md">Try again</Button>
        </Link>
      ),
    },
  };

  const c = content[status];

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full text-center" style={{ maxWidth: '440px' }}>
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-6"
          style={{
            backgroundColor: 'oklch(1 0 0 / 0.06)',
            border: '1px solid oklch(1 0 0 / 0.1)',
            fontSize: '1.25rem',
            color: c.iconColor,
            fontWeight: 700,
          }}
        >
          {status === 'loading' ? (
            <svg width={20} height={20} viewBox="0 0 16 16" fill="none"
              style={{ animation: 'btn-spin 0.7s linear infinite' }}>
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
              <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          ) : c.icon}
        </div>

        <h1 style={{ fontSize: 'var(--type-h4-size)', fontWeight: 700, marginBottom: '0.75rem' }}>
          {c.title}
        </h1>
        <p style={{ fontSize: 'var(--type-body-md-size)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
          {c.body}
        </p>
        {c.cta}
      </div>
    </div>
  );
}

export default function ConfirmDeletionPage() {
  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--brand-800)', color: 'var(--text-primary)' }}
    >
      <nav
        className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5"
        style={{ borderBottom: '1px solid oklch(1 0 0 / 0.08)' }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo size="md" />
        </Link>
      </nav>

      <Suspense fallback={<div className="flex-1" />}>
        <ConfirmContent />
      </Suspense>
    </main>
  );
}
