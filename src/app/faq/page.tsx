'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

const CONTACT_EMAIL = 'carlyneket@gmail.com';

/* ── Scroll-reveal wrapper ───────────────────────────────── */
function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: 'opacity 0.45s ease, transform 0.45s ease',
      }}
    >
      {children}
    </div>
  );
}

/* ── FAQ data ────────────────────────────────────────────── */
const FAQS: { question: string; answer: React.ReactNode }[] = [
  {
    question: 'What is CVtoWeb?',
    answer: (
      <>
        CVtoWeb is a free tool that converts your CV or resume into a hosted portfolio website in seconds.
        Upload your PDF, our AI reads it, and you get a shareable portfolio at{' '}
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>yourname.cvtoweb.com</span>.
        No account, no setup, no code required.
      </>
    ),
  },
  {
    question: 'Is CVtoWeb free?',
    answer: (
      <>
        Yes — CVtoWeb is completely free to use right now. You can upload your CV, generate a portfolio,
        and publish it at no cost. We may introduce optional paid features in the future, but we will
        always give advance notice before any pricing changes.
      </>
    ),
  },
  {
    question: 'What file formats do you accept?',
    answer: (
      <>
        CVtoWeb currently accepts <strong style={{ color: 'var(--text-primary)' }}>PDF files only</strong>.
        Make sure your CV is saved as a PDF before uploading. Most word processors (Word, Google Docs,
        Pages) can export to PDF directly.
      </>
    ),
  },
  {
    question: 'How long does it take to generate my portfolio?',
    answer: (
      <>
        Usually under 30 seconds. The process involves extracting text from your PDF and sending it to
        our AI to structure your portfolio. On slower connections or during high demand it may take a
        little longer — just leave the page open and it will complete.
      </>
    ),
  },
  {
    question: 'Do I need to create an account?',
    answer: (
      <>
        No. CVtoWeb requires no account or sign-up. Just upload your CV and publish. When you publish,
        we ask for an email address so we can send you a link back to your portfolio — that is the only
        personal information we collect.
      </>
    ),
  },
  {
    question: 'What if the AI gets something wrong?',
    answer: (
      <>
        AI-generated content can sometimes contain errors, reorder information, or miss details —
        especially if your CV has complex formatting or unusual layouts. You can review your portfolio
        in the preview step before publishing, and make corrections if needed. We recommend reading
        through your generated portfolio carefully before making it public.
      </>
    ),
  },
  {
    question: 'Can I edit my portfolio after publishing?',
    answer: (
      <>
        Yes. When you publish, we send you a confirmation email that includes a link to edit your
        portfolio. You can use that link any time to update your portfolio content. Keep the email
        safe — it is the only way to access your edit page without an account.
      </>
    ),
  },
  {
    question: 'Can I change my portfolio username?',
    answer: (
      <>
        Not currently — your username and subdomain are set when you first publish and cannot be
        changed afterward. If you need a different username, you would need to delete your current
        portfolio and publish a new one. Choose your username carefully before publishing.
      </>
    ),
  },
  {
    question: 'Is my portfolio public?',
    answer: (
      <>
        Yes. Once published, your portfolio is publicly accessible at{' '}
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>yourname.cvtoweb.com</span> and
        may be indexed by search engines. Do not include information in your CV that you are not
        comfortable making public. You can delete your portfolio at any time if you no longer want it
        accessible.
      </>
    ),
  },
  {
    question: 'Is my CV data stored or used to train AI?',
    answer: (
      <>
        Your CV is processed to generate your portfolio and then discarded — we do not permanently store
        your raw CV file. The extracted text is sent to Anthropic's Claude API to generate your
        portfolio. We do not use your CV or portfolio content to train any AI models, and we do not
        sell or share your data with third parties beyond what is necessary to deliver the service.
        See our{' '}
        <Link href="/privacy" style={{ color: 'var(--text-brand)', textDecoration: 'underline' }}>
          Privacy Policy
        </Link>{' '}
        for full details.
      </>
    ),
  },
  {
    question: 'How do I delete my portfolio?',
    answer: (
      <>
        Email us at{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--text-brand)', textDecoration: 'underline' }}>
          {CONTACT_EMAIL}
        </a>{' '}
        with your portfolio username and we will permanently delete your portfolio and all associated
        data within a reasonable timeframe.
      </>
    ),
  },
  {
    question: 'Can I use a custom domain?',
    answer: (
      <>
        Not yet. All portfolios are currently hosted on{' '}
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>yourname.cvtoweb.com</span>.
        Custom domain support is something we are considering for the future.
      </>
    ),
  },
  {
    question: 'Something went wrong. How do I get help?',
    answer: (
      <>
        Email us at{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--text-brand)', textDecoration: 'underline' }}>
          {CONTACT_EMAIL}
        </a>{' '}
        and we will do our best to help. Include your portfolio username and a description of the issue.
      </>
    ),
  },
];

/* ── Accordion item ──────────────────────────────────────── */
function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <Reveal>
      <div style={{ borderBottom: '1px solid oklch(1 0 0 / 0.08)' }}>
        <button
          onClick={onToggle}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '1.25rem 0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <span style={{
            fontSize: 'var(--type-body-md-size)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.5,
          }}>
            {question}
          </span>
          <svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              flexShrink: 0,
              color: 'var(--text-muted)',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.25s ease',
            }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        <div
          style={{
            display: 'grid',
            gridTemplateRows: open ? '1fr' : '0fr',
            transition: 'grid-template-rows 0.28s ease',
          }}
        >
          <div style={{ overflow: 'hidden' }}>
            <div
              style={{
                paddingBottom: '1.25rem',
                fontSize: 'var(--type-body-md-size)',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
              }}
            >
              {answer}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (i: number) => {
    setOpenIndex(prev => (prev === i ? null : i));
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

      {/* Radial gradients — fixed so they don't block scroll detection */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: 0,
          right: 0,
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, oklch(0.60 0.18 280 / 0.15) 0%, oklch(0.60 0.18 280 / 0.06) 45%, transparent 70%)',
          zIndex: 0,
          transform: 'translate(20%, -20%)',
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: 0,
          left: 0,
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, oklch(0.68 0.18 220 / 0.09) 0%, transparent 65%)',
          zIndex: 0,
          transform: 'translate(-20%, 20%)',
        }}
      />

      <div className="flex-1 relative" style={{ zIndex: 1 }}>
        <div
          className="w-full px-4 sm:px-8 py-12 sm:py-16"
          style={{ maxWidth: '780px', margin: '0 auto' }}
        >

          {/* Page header */}
          <Reveal>
            <div style={{ marginBottom: '3rem' }}>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                marginBottom: '0.5rem',
              }}>
                Frequently Asked Questions
              </h1>
              <p style={{ fontSize: 'var(--type-body-md-size)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Everything you need to know about CVtoWeb.
              </p>
            </div>
          </Reveal>

          {/* FAQ list */}
          <div style={{ borderTop: '1px solid oklch(1 0 0 / 0.08)' }}>
            {FAQS.map((faq, i) => (
              <FaqItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                open={openIndex === i}
                onToggle={() => handleToggle(i)}
              />
            ))}
          </div>

          {/* Still have questions */}
          <Reveal>
            <div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 rounded-2xl mt-12"
              style={{
                backgroundColor: 'oklch(1 0 0 / 0.04)',
                border: '1px solid oklch(1 0 0 / 0.08)',
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Still have questions?
                </p>
                <p style={{ fontSize: 'var(--type-body-sm-size)', color: 'var(--text-secondary)' }}>
                  We're happy to help. Send us a message and we'll get back to you.
                </p>
              </div>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                style={{
                  display: 'inline-block',
                  padding: '0.625rem 1.25rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'oklch(1 0 0 / 0.08)',
                  border: '1px solid oklch(1 0 0 / 0.12)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--type-body-sm-size)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Contact us
              </a>
            </div>
          </Reveal>

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
          <Link href="/privacy"  style={{ color: 'white', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/terms"    style={{ color: 'white', textDecoration: 'none' }}>Terms</Link>
          <Link href="/faq"      style={{ color: 'var(--text-brand)', textDecoration: 'none' }}>FAQ</Link>
          <Link href="/feedback" style={{ color: 'white', textDecoration: 'none' }}>Feedback</Link>
        </div>
        <span style={{ color: 'var(--text-muted)' }}>© 2026 CVtoWeb</span>
      </footer>
    </main>
  );
}
