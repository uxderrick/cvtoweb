'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFile = async (file: File) => {
    const isPdf = file.type === 'application/pdf';
    const isDocx =
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.name.toLowerCase().endsWith('.docx');

    if (!isPdf && !isDocx) {
      setError('Please upload a PDF or Word document (.pdf or .docx)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parse-cv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse CV');
      }

      router.push(`/preview/${data.portfolioId}?token=${encodeURIComponent(data.editToken)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute -top-64 -left-64 w-[700px] h-[700px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--brand-200), transparent 70%)' }}
        />
        <div
          className="absolute top-1/3 -right-48 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--brand-100), transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(ellipse, var(--brand-300), transparent 70%)' }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <span className="font-semibold tracking-tight" style={{ fontSize: 'var(--type-h6-size)', color: 'var(--text-primary)' }}>
          CV<span style={{ color: 'var(--text-brand)' }}>to</span>Web
        </span>
        <div className="flex items-center gap-6">
          <a
            href="#how-it-works"
            className="transition-colors hidden sm:block"
            style={{ fontSize: 'var(--type-body-sm-size)', color: 'var(--text-muted)' }}
          >
            How it works
          </a>
          <a
            href="#upload"
            className="px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{
              fontSize: 'var(--type-btn-md-size)',
              backgroundColor: 'var(--bg-brand)',
              color: 'var(--text-inverse)',
            }}
          >
            Try free
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-12 text-center">

        {/* Eyebrow badge */}
        <span
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-8"
          style={{
            fontSize: 'var(--type-overline-size)',
            fontWeight: 'var(--type-overline-weight)',
            letterSpacing: 'var(--type-overline-ls)',
            textTransform: 'uppercase',
            color: 'var(--text-brand)',
            borderColor: 'var(--border-brand)',
            backgroundColor: 'var(--bg-brand-muted)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--text-brand)' }} />
          AI-powered · No sign-up required
        </span>

        {/* Headline */}
        <h1
          className="max-w-3xl mb-6"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
          }}
        >
          Turn your CV into a{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, var(--brand-50) 0%, var(--brand-200) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            live portfolio
          </span>
          {' '}in seconds.
        </h1>

        {/* Subheadline */}
        <p
          className="mb-12 max-w-xl"
          style={{
            fontSize: 'var(--type-body-lg-size)',
            lineHeight: 'var(--type-body-lg-lh)',
            color: 'var(--text-secondary)',
          }}
        >
          Upload your CV and our AI builds a beautiful, shareable portfolio — instantly. No code, no fuss.
        </p>

        {/* ── Upload Zone ── */}
        <div id="upload" className="w-full max-w-xl">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative w-full rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200 ${isLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
            style={{
              borderColor: isDragging ? 'var(--border-brand)' : 'var(--border-default)',
              backgroundColor: isDragging ? 'var(--bg-brand-muted)' : 'var(--bg-subtle)',
              boxShadow: isDragging
                ? '0 0 0 4px color-mix(in oklch, var(--brand-200) 15%, transparent)'
                : '0 1px 3px rgba(0,0,0,0.3)',
            }}
          >
            <input
              type="file"
              accept="application/pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isLoading}
            />

            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full border-2 animate-spin"
                  style={{ borderColor: 'var(--border-brand)', borderTopColor: 'transparent' }}
                />
                <p style={{ fontSize: 'var(--type-body-md-size)', color: 'var(--text-secondary)' }}>
                  Analysing your CV…
                </p>
                <p style={{ fontSize: 'var(--type-caption-size)', color: 'var(--text-muted)' }}>
                  This usually takes 10–20 seconds
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-1"
                  style={{ backgroundColor: 'var(--bg-brand-subtle)' }}
                >
                  <svg className="w-7 h-7" style={{ color: 'var(--text-brand)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p style={{ fontSize: 'var(--type-body-md-size)', fontWeight: 'var(--type-subheading-lg-weight)', color: 'var(--text-primary)' }}>
                  {isDragging ? 'Drop it here' : 'Drop your CV or click to upload'}
                </p>
                <p style={{ fontSize: 'var(--type-caption-size)', color: 'var(--text-muted)' }}>
                  PDF or Word (.docx) · Max 5 MB
                </p>
              </div>
            )}
          </div>

          {error && (
            <div
              className="w-full mt-4 px-4 py-3 rounded-xl border text-center"
              style={{
                fontSize: 'var(--type-body-sm-size)',
                color: 'var(--text-error)',
                backgroundColor: 'var(--error-900)',
                borderColor: 'var(--error-600)',
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Social proof row */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
          <AvatarStack />
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-default)' }} className="hidden sm:block" />
          <p style={{ fontSize: 'var(--type-body-sm-size)', color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>2,400+</span> portfolios created this week
          </p>
        </div>
      </section>

      {/* ── Mock portfolio preview card ── */}
      <section className="relative z-10 flex justify-center px-6 pb-20">
        <div
          className="w-full max-w-3xl rounded-2xl overflow-hidden border"
          style={{
            borderColor: 'var(--border-default)',
            backgroundColor: 'var(--bg-surface)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          }}
        >
          {/* Browser chrome */}
          <div
            className="flex items-center gap-2 px-4 py-3 border-b"
            style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-subtle)' }}
          >
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-400/60" />
            <span className="w-3 h-3 rounded-full bg-green-400/60" />
            <div
              className="ml-3 flex-1 rounded px-3 py-1 text-center"
              style={{ backgroundColor: 'var(--bg-elevated)', fontSize: 'var(--type-caption-size)', color: 'var(--text-muted)' }}
            >
              alexjordan.cvtoweb.com
            </div>
          </div>

          {/* Mock portfolio content */}
          <div className="px-10 py-10 bg-black text-white">
            {/* Name + title */}
            <p className="text-5xl font-extralight tracking-tight mb-2">Alex Jordan</p>
            <p className="text-xl text-gray-400 font-light mb-8">Senior Product Designer</p>

            {/* Contact pills */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-10">
              {['alex@example.com', 'linkedin.com/in/alexjordan', 'London, UK'].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-gray-700" />
                  {item}
                </span>
              ))}
            </div>

            {/* Summary */}
            <p className="text-base text-gray-300 leading-relaxed mb-10 max-w-xl font-light">
              Product designer with 8 years crafting digital experiences for fintech and SaaS startups. Passionate about systems thinking and turning complexity into clarity.
            </p>

            {/* Section header */}
            <p className="text-xs font-bold uppercase tracking-widest text-gray-700 mb-6">Experience</p>

            {/* Experience entries */}
            <div className="space-y-8">
              {[
                { role: 'Lead Product Designer', company: 'Stripe · 2021 – Present', bullets: ['Redesigned checkout flow, increasing conversion by 18%', 'Built and maintained a cross-platform design system'] },
                { role: 'Senior Designer', company: 'Monzo · 2018 – 2021', bullets: ['Led end-to-end design for the Savings product', 'Ran 40+ user research sessions'] },
              ].map((exp) => (
                <div key={exp.role}>
                  <p className="text-base font-medium mb-0.5">{exp.role}</p>
                  <p className="text-sm text-gray-500 mb-3">{exp.company}</p>
                  <ul className="space-y-1.5">
                    {exp.bullets.map((b) => (
                      <li key={b} className="text-sm text-gray-400 flex gap-2">
                        <span className="text-gray-700 mt-1">•</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Skills */}
            <p className="text-xs font-bold uppercase tracking-widest text-gray-700 mt-10 mb-4">Skills</p>
            <div className="flex flex-wrap gap-2">
              {['Figma', 'Prototyping', 'User Research', 'Design Systems', 'Framer', 'A/B Testing'].map((s) => (
                <span key={s} className="px-3 py-1 rounded text-xs text-gray-400 bg-gray-900 border border-gray-800">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="relative z-10 border-t px-6 py-20" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-4xl mx-auto">
          <p
            className="text-center mb-14"
            style={{
              fontSize: 'var(--type-overline-size)',
              fontWeight: 'var(--type-overline-weight)',
              letterSpacing: 'var(--type-overline-ls)',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            How it works
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: '01',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                ),
                title: 'Upload your CV',
                body: 'Drop in your PDF or Word file. We accept any standard CV format.',
              },
              {
                step: '02',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                ),
                title: 'AI does the work',
                body: 'Claude AI reads and structures your experience into a polished portfolio.',
              },
              {
                step: '03',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                ),
                title: 'Share your link',
                body: 'Claim your free subdomain and share it with the world instantly.',
              },
            ].map(({ step, icon, title, body }) => (
              <div key={step} className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--bg-brand-subtle)' }}
                  >
                    <svg className="w-5 h-5" style={{ color: 'var(--text-brand)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {icon}
                    </svg>
                  </div>
                  <span
                    style={{
                      fontSize: 'var(--type-overline-size)',
                      fontWeight: 'var(--type-overline-weight)',
                      letterSpacing: 'var(--type-overline-ls)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {step}
                  </span>
                </div>
                <p style={{ fontSize: 'var(--type-subheading-lg-size)', fontWeight: 'var(--type-subheading-lg-weight)', color: 'var(--text-primary)' }}>
                  {title}
                </p>
                <p style={{ fontSize: 'var(--type-body-sm-size)', lineHeight: 'var(--type-body-sm-lh)', color: 'var(--text-muted)' }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature pills ── */}
      <section className="relative z-10 border-t px-6 py-14" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-3">
          {[
            'No account required',
            'Free subdomain',
            'AI-powered parsing',
            'Instant preview',
            'PDF & Word support',
            'Shareable link',
          ].map((label) => (
            <span
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full border"
              style={{
                fontSize: 'var(--type-body-sm-size)',
                color: 'var(--text-secondary)',
                borderColor: 'var(--border-default)',
                backgroundColor: 'var(--bg-subtle)',
              }}
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-brand)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="relative z-10 px-6 py-16">
        <div
          className="max-w-3xl mx-auto rounded-2xl px-10 py-14 text-center overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, var(--brand-800) 0%, var(--brand-900) 60%, var(--brand-950) 100%)',
            border: '1px solid var(--border-brand)',
          }}
        >
          <div
            className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-30 blur-3xl"
            style={{ background: 'var(--brand-200)' }}
          />
          <p
            className="mb-4"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 300,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            Ready to stand out?
          </p>
          <p className="mb-8 max-w-md mx-auto" style={{ fontSize: 'var(--type-body-md-size)', color: 'var(--text-secondary)' }}>
            Your next job starts with a first impression. Let AI make yours unforgettable.
          </p>
          <a
            href="#upload"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{
              fontSize: 'var(--type-btn-lg-size)',
              backgroundColor: 'var(--bg-brand)',
              color: 'var(--text-inverse)',
            }}
          >
            Upload your CV
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative z-10 border-t px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <span style={{ fontSize: 'var(--type-body-sm-size)', fontWeight: 600, color: 'var(--text-muted)' }}>
          CV<span style={{ color: 'var(--text-brand)' }}>to</span>Web
        </span>
        <p style={{ fontSize: 'var(--type-caption-size)', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} CVtoWeb · Built with AI
        </p>
      </footer>
    </main>
  );
}

function AvatarStack() {
  const avatars = [
    { initials: 'AJ', bg: '#4f46e5' },
    { initials: 'SM', bg: '#0891b2' },
    { initials: 'RK', bg: '#059669' },
    { initials: 'LT', bg: '#d97706' },
  ];

  return (
    <div className="flex items-center">
      {avatars.map((a, i) => (
        <div
          key={a.initials}
          className="w-7 h-7 rounded-full flex items-center justify-center text-white border-2 -ml-2 first:ml-0 flex-shrink-0"
          style={{
            backgroundColor: a.bg,
            borderColor: 'var(--bg-base)',
            fontSize: '10px',
            fontWeight: 700,
            zIndex: avatars.length - i,
          }}
        >
          {a.initials}
        </div>
      ))}
    </div>
  );
}
