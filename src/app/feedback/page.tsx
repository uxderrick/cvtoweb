'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Mascot } from '@/components/ui/Mascot';

const CATEGORIES = [
  { value: 'general', label: 'General feedback',  emoji: '💬' },
  { value: 'feature', label: 'Feature request',   emoji: '✦'  },
  { value: 'bug',     label: 'Bug report',         emoji: '⚑'  },
  { value: 'other',   label: 'Other',              emoji: '·'  },
];

/* ── Floating orb (decorative) ───────────────────────────── */
function Orb({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        filter: 'blur(1px)',
        ...style,
      }}
    />
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function FeedbackPage() {
  const [category, setCategory] = useState('general');
  const [message,  setMessage]  = useState('');
  const [email,    setEmail]    = useState('');
  const [status,   setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  const canSubmit = message.trim().length >= 5 && status !== 'loading';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus('loading');

    try {
      const res = await fetch('/api/feedback', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ category, message, email }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
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

      {/* Fixed radial gradients */}
      <div className="fixed pointer-events-none" style={{
        top: 0, right: 0, width: '650px', height: '650px', borderRadius: '50%', zIndex: 0,
        background: 'radial-gradient(circle, oklch(0.60 0.18 280 / 0.18) 0%, oklch(0.60 0.18 280 / 0.07) 45%, transparent 70%)',
        transform: 'translate(25%, -25%)',
      }} />
      <div className="fixed pointer-events-none" style={{
        bottom: 0, left: 0, width: '500px', height: '500px', borderRadius: '50%', zIndex: 0,
        background: 'radial-gradient(circle, oklch(0.68 0.18 220 / 0.10) 0%, transparent 65%)',
        transform: 'translate(-25%, 25%)',
      }} />

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16 relative" style={{ zIndex: 1 }}>
        <div className="w-full" style={{ maxWidth: '520px' }}>

          {status === 'success' ? (
            /* ── Success state ───────────────────────────────── */
            <div
              className="text-center"
              style={{
                opacity: 1,
                animation: 'feedback-fadein 0.5s ease both',
              }}
            >
              <style>{`
                @keyframes feedback-fadein {
                  from { opacity: 0; transform: translateY(16px); }
                  to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes feedback-pop {
                  0%   { transform: scale(0.6); opacity: 0; }
                  60%  { transform: scale(1.15); }
                  100% { transform: scale(1); opacity: 1; }
                }
              `}</style>

              {/* Success mascot */}
              <div
                className="flex justify-center"
                style={{
                  marginBottom: '0.5rem',
                  animation: 'feedback-pop 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.05s both',
                }}
              >
                <Mascot state="success" size="lg" aria-label="Success" />
              </div>

              <h1 style={{ fontSize: 'var(--type-h4-size)', fontWeight: 700, marginBottom: '0.5rem' }}>
                Thanks for the feedback
              </h1>
              <p style={{ fontSize: 'var(--type-body-md-size)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                We read every submission and use it to make CVtoWeb better.
                We appreciate you taking the time.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={() => { setMessage(''); setEmail(''); setCategory('general'); setStatus('idle'); }}
                  style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: '0.75rem',
                    backgroundColor: 'oklch(1 0 0 / 0.08)',
                    border: '1px solid oklch(1 0 0 / 0.12)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--type-body-sm-size)',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Send more feedback
                </button>
                <Link href="/" style={{
                  padding: '0.625rem 1.25rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'var(--text-brand)',
                  color: 'white',
                  fontSize: 'var(--type-body-sm-size)',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}>
                  Back to home
                </Link>
              </div>
            </div>

          ) : (
            /* ── Form ────────────────────────────────────────── */
            <>
              <style>{`
                @keyframes feedback-fadein {
                  from { opacity: 0; transform: translateY(20px); }
                  to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes feedback-slide {
                  from { opacity: 0; transform: translateY(14px); }
                  to   { opacity: 1; transform: translateY(0); }
                }
                .fb-category:focus-within,
                .fb-category:hover {
                  border-color: oklch(1 0 0 / 0.25) !important;
                  background: oklch(1 0 0 / 0.07) !important;
                }
                .fb-category input:checked + .fb-category-inner {
                  background: oklch(1 0 0 / 0.1);
                  border-color: var(--text-brand);
                }
                .fb-textarea:focus {
                  outline: none;
                  border-color: oklch(1 0 0 / 0.3) !important;
                  background: oklch(1 0 0 / 0.06) !important;
                }
                .fb-input:focus {
                  outline: none;
                  border-color: oklch(1 0 0 / 0.3) !important;
                  background: oklch(1 0 0 / 0.06) !important;
                }
              `}</style>

              {/* Header */}
              <div
                style={{
                  marginBottom: '2.5rem',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'none' : 'translateY(20px)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                }}
              >
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5"
                  style={{
                    backgroundColor: 'oklch(1 0 0 / 0.06)',
                    border: '1px solid oklch(1 0 0 / 0.1)',
                    fontSize: 'var(--type-body-sm-size)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span style={{ color: 'var(--text-brand)' }}>✦</span>
                  We read every submission
                </div>
                <h1 style={{
                  fontSize: 'clamp(2rem, 5vw, 2.75rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  marginBottom: '0.75rem',
                }}>
                  What's on your mind?
                </h1>
                <p style={{ fontSize: 'var(--type-body-md-size)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Bug, idea, or just a thought — we want to hear it.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'none' : 'translateY(16px)',
                  transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
                }}
              >
                {/* Category picker */}
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--type-body-sm-size)', fontWeight: 600, marginBottom: '0.625rem', color: 'var(--text-primary)' }}>
                    Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map(cat => (
                      <label
                        key={cat.value}
                        className="fb-category"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.625rem',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.875rem',
                          border: `1px solid ${category === cat.value ? 'var(--text-brand)' : 'oklch(1 0 0 / 0.1)'}`,
                          backgroundColor: category === cat.value ? 'oklch(1 0 0 / 0.08)' : 'oklch(1 0 0 / 0.04)',
                          cursor: 'pointer',
                          transition: 'border-color 0.18s, background 0.18s',
                          userSelect: 'none',
                        }}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={cat.value}
                          checked={category === cat.value}
                          onChange={() => setCategory(cat.value)}
                          style={{ display: 'none' }}
                        />
                        <span style={{ fontSize: '1rem', lineHeight: 1 }}>{cat.emoji}</span>
                        <span style={{ fontSize: 'var(--type-body-sm-size)', fontWeight: 500, color: 'var(--text-primary)' }}>
                          {cat.label}
                        </span>
                        {category === cat.value && (
                          <span style={{ marginLeft: 'auto', color: 'var(--text-brand)', fontSize: '0.75rem', fontWeight: 700 }}>✓</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--type-body-sm-size)', fontWeight: 600, marginBottom: '0.625rem', color: 'var(--text-primary)' }}>
                    Your feedback <span style={{ color: 'var(--text-brand)' }}>*</span>
                  </label>
                  <textarea
                    className="fb-textarea"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Tell us what you think, what's broken, or what you'd love to see…"
                    rows={5}
                    required
                    style={{
                      width: '100%',
                      resize: 'vertical',
                      padding: '0.875rem 1rem',
                      borderRadius: '0.875rem',
                      border: '1px solid oklch(1 0 0 / 0.12)',
                      backgroundColor: 'oklch(1 0 0 / 0.04)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--type-body-md-size)',
                      lineHeight: 1.6,
                      fontFamily: 'inherit',
                      transition: 'border-color 0.18s, background 0.18s',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.375rem' }}>
                    <span style={{ fontSize: 'var(--type-caption-size)', color: message.length > 0 ? 'var(--text-muted)' : 'transparent' }}>
                      {message.length} chars
                    </span>
                  </div>
                </div>

                {/* Optional email */}
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--type-body-sm-size)', fontWeight: 600, marginBottom: '0.625rem', color: 'var(--text-primary)' }}>
                    Email <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional — only if you'd like a reply)</span>
                  </label>
                  <input
                    className="fb-input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      borderRadius: '0.875rem',
                      border: '1px solid oklch(1 0 0 / 0.12)',
                      backgroundColor: 'oklch(1 0 0 / 0.04)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--type-body-md-size)',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.18s, background 0.18s',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {status === 'error' && (
                  <p style={{ fontSize: 'var(--type-body-sm-size)', color: 'var(--text-error)', margin: 0 }}>
                    Something went wrong. Please try again.
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  style={{
                    padding: '0.875rem',
                    borderRadius: '0.875rem',
                    border: 'none',
                    backgroundColor: canSubmit ? 'var(--text-brand)' : 'oklch(1 0 0 / 0.08)',
                    color: canSubmit ? 'white' : 'var(--text-muted)',
                    fontSize: 'var(--type-body-md-size)',
                    fontWeight: 700,
                    cursor: canSubmit ? 'pointer' : 'not-allowed',
                    transition: 'background 0.2s, color 0.2s, transform 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                  onMouseEnter={e => { if (canSubmit) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
                >
                  {status === 'loading' ? (
                    <>
                      <svg width={16} height={16} viewBox="0 0 16 16" fill="none"
                        style={{ animation: 'btn-spin 0.7s linear infinite' }}>
                        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
                        <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                      Sending…
                    </>
                  ) : 'Send feedback'}
                </button>

              </form>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer
        className="px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderTop: '1px solid oklch(1 0 0 / 0.08)', fontSize: 'var(--type-body-sm-size)', color: 'white' }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo size="sm" />
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/privacy" style={{ color: 'white', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/terms"   style={{ color: 'white', textDecoration: 'none' }}>Terms</Link>
          <Link href="/faq"     style={{ color: 'white', textDecoration: 'none' }}>FAQ</Link>
        </div>
        <span style={{ color: 'var(--text-muted)' }}>© 2026 CVtoWeb</span>
      </footer>
    </main>
  );
}
