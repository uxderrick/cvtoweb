'use client';

import { useRef, useEffect, useState } from 'react';
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
        transform: visible ? 'translateY(0)' : 'translateY(22px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      {children}
    </div>
  );
}

/* ── Shared components ───────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{
          fontSize: 'var(--type-h5-size)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '1rem',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid oklch(1 0 0 / 0.08)',
        }}>
          {title}
        </h2>
        {children}
      </section>
    </Reveal>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 'var(--type-body-md-size)',
      color: 'var(--text-secondary)',
      lineHeight: 1.7,
      marginBottom: '0.875rem',
    }}>
      {children}
    </p>
  );
}

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul style={{ paddingLeft: '1.25rem', marginBottom: '0.875rem' }}>
      {items.map((item, i) => (
        <li key={i} style={{
          fontSize: 'var(--type-body-md-size)',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          marginBottom: '0.375rem',
          listStyleType: 'disc',
        }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{
      fontSize: 'var(--type-body-md-size)',
      fontWeight: 700,
      color: 'var(--text-primary)',
      marginBottom: '0.5rem',
      marginTop: '1.25rem',
    }}>
      {children}
    </h3>
  );
}

function Table({ rows }: { rows: [string, string][] }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: '0.875rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--type-body-sm-size)' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid oklch(1 0 0 / 0.12)' }}>
            {(['Data', 'Purpose'] as const).map((h) => (
              <th key={h} style={{
                textAlign: 'left',
                padding: '0.5rem 1rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: 'var(--type-caption-size)',
                letterSpacing: '0.06em',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([col1, col2], i) => (
            <tr key={i} style={{ borderBottom: '1px solid oklch(1 0 0 / 0.06)' }}>
              <td style={{ padding: '0.625rem 1rem', color: 'var(--text-primary)', fontWeight: 500, whiteSpace: 'nowrap' }}>{col1}</td>
              <td style={{ padding: '0.625rem 1rem', color: 'var(--text-secondary)' }}>{col2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmailLink() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--text-brand)', textDecoration: 'underline' }}>
      {CONTACT_EMAIL}
    </a>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function PrivacyPage() {
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
                Privacy Policy
              </h1>
              <p style={{ fontSize: 'var(--type-body-sm-size)', color: 'var(--text-muted)' }}>
                Last updated: April 2026
              </p>
            </div>
          </Reveal>

          {/* 1. Introduction */}
          <Section title="1. Introduction">
            <P>
              CVtoWeb ("we", "us", or "our") is a tool that converts your CV or resume into a hosted
              portfolio website. This policy explains what data we collect, how we use it, who we share
              it with, and your rights. We've written it to be plain and readable — not buried in legal jargon.
            </P>
          </Section>

          {/* 2. What Data We Collect */}
          <Section title="2. What Data We Collect">
            <P>We collect and process only the data necessary to provide CVtoWeb.</P>

            <H3>Data you provide directly</H3>
            <List items={[
              'Your CV or resume file (PDF or Word document), which is processed to extract text',
              'Your name, email address, and chosen username when you publish a portfolio',
              'Any edits or content you add to your generated portfolio',
            ]} />

            <H3>Data generated during processing</H3>
            <List items={[
              'Text extracted from your CV or resume',
              'Structured portfolio data (such as work experience, education, and skills) created from that text',
            ]} />

            <H3>Data we collect automatically</H3>
            <P>
              Basic server logs, including IP address, timestamp, and browser type, when you use the service.
              This data is used strictly for security, debugging, and abuse prevention.
            </P>
            <P>We do not use tracking cookies, behavioral analytics, or fingerprinting technologies.</P>

            <H3>Important note on CV processing</H3>
            <P>
              Your CV or resume file is processed in memory to extract text and is not stored after
              processing. However, the extracted text and resulting structured data may be temporarily
              or permanently processed as described in this policy.
            </P>
          </Section>

          {/* 3. How We Use It */}
          <Section title="3. How We Use It">
            <P>We process your data to provide and operate CVtoWeb.</P>
            <Table rows={[
              ['CV / resume file', 'Extracted as text and used to generate your portfolio'],
              ['Extracted text', 'Converted into structured portfolio content'],
              ['Email address', 'Used to send your edit link and essential service communication'],
              ['Username', 'Used to create your public portfolio URL'],
              ['IP / logs', 'Security, abuse prevention, and debugging'],
            ]} />

            <H3>Legal basis for processing</H3>
            <P>We process your data:</P>
            <List items={[
              'To provide the service you request (generating and hosting your portfolio)',
              'Based on your consent when you upload your CV and publish a portfolio',
            ]} />
          </Section>

          {/* 4. AI Processing */}
          <Section title="4. AI Processing — Third-Party Disclosure">
            <P>
              To generate your portfolio, the text extracted from your CV is sent to Anthropic's Claude API
              for processing. This is the core of how the service works.
            </P>
            <List items={[
              'Data is transmitted securely over HTTPS/TLS',
              'We do not send your original file — only extracted text',
              'Anthropic does not use your data to train its models (per their API terms)',
              'Anthropic may retain data temporarily for safety and monitoring',
            ]} />
            <P>We do not control the retention policies of third-party AI providers.</P>
          </Section>

          {/* 5. Third-Party Services */}
          <Section title="5. Third-Party Services We Use">
            <P>These providers may process data on our behalf to deliver the service.</P>
            <Table rows={[
              ['Anthropic (Claude API)', 'AI-powered CV parsing'],
              ['Supabase', 'Database hosting (portfolio data)'],
              ['Vercel', 'Web hosting and infrastructure'],
              ['Resend', 'Transactional email delivery'],
            ]} />
          </Section>

          {/* 6. International Data Transfers */}
          <Section title="6. International Data Transfers">
            <P>
              Your data may be processed in countries outside your own, depending on the infrastructure
              providers we use. Where required, we rely on appropriate safeguards to protect your data.
            </P>
          </Section>

          {/* 7. Data Retention */}
          <Section title="7. Data Retention">
            <List items={[
              'CV / resume file — not stored; processed in memory and discarded',
              'Portfolio data — stored while your portfolio is active',
              'Email address — stored with your portfolio',
              'Server logs — deleted after 30 days',
              'Unpublished sessions — deleted after 7 days',
            ]} />
          </Section>

          {/* 8. Your Portfolio Is Public */}
          <Section title="8. Your Portfolio Is Public">
            <P>Once published, your portfolio is accessible via your public URL. This means:</P>
            <List items={[
              'Anyone with the link can view it',
              'It may be indexed by search engines',
              'It may be accessed globally',
            ]} />
            <P>
              You are responsible for the information you choose to include. We are not responsible for
              how third parties use publicly available data.
            </P>
          </Section>

          {/* 9. Your Rights */}
          <Section title="9. Your Rights">
            <P>Depending on your location, you may have rights including:</P>
            <List items={[
              <><strong style={{ color: 'var(--text-primary)' }}>Access</strong> — request a copy of your data</>,
              <><strong style={{ color: 'var(--text-primary)' }}>Deletion</strong> — request permanent removal of your portfolio and associated data</>,
              <><strong style={{ color: 'var(--text-primary)' }}>Correction</strong> — edit your portfolio at any time via your edit link</>,
            ]} />
            <P>To exercise your rights, contact: <EmailLink /></P>
          </Section>

          {/* 10. Deleting Your Portfolio */}
          <Section title="10. Deleting Your Portfolio">
            <P>
              You can request deletion by emailing <EmailLink /> with your portfolio username. We will:
            </P>
            <List items={[
              'Verify your request',
              'Delete your portfolio and associated data',
              'Complete the process within a reasonable timeframe',
            ]} />
            <P>We are working on a self-serve deletion feature.</P>
          </Section>

          {/* 11. Security */}
          <Section title="11. Security">
            <List items={[
              'All data is transmitted over HTTPS/TLS',
              'Portfolio data is stored securely using Supabase',
              'Edit links contain private access tokens — keep yours safe',
              'We do not store CV files, passwords, or payment data',
            ]} />
          </Section>

          {/* 12. Data Breach Notification */}
          <Section title="12. Data Breach Notification">
            <P>
              In the event of a data breach affecting your personal data, we will notify affected users
              in accordance with applicable laws.
            </P>
          </Section>

          {/* 13. User Responsibility */}
          <Section title="13. User Responsibility">
            <P>You are responsible for:</P>
            <List items={[
              'Ensuring you have the right to upload and publish your CV',
              'Reviewing your content before making it public',
            ]} />
          </Section>

          {/* 14. Limitation of Liability */}
          <Section title="14. Limitation of Liability">
            <P>CVtoWeb is provided "as is." We are not liable for:</P>
            <List items={[
              'Errors or inaccuracies in AI-generated content',
              'Loss of data',
              'Damages resulting from the public availability of your portfolio',
            ]} />
          </Section>

          {/* 15. Children */}
          <Section title="15. Children">
            <P>
              CVtoWeb is not intended for individuals under 16. We do not knowingly collect data from minors.
            </P>
          </Section>

          {/* 16. Changes */}
          <Section title="16. Changes to This Policy">
            <P>
              We may update this policy from time to time. Changes will be posted here with an updated
              "Last updated" date.
            </P>
          </Section>

          {/* 17. Contact */}
          <Section title="17. Contact">
            <P>Email: <EmailLink /></P>
          </Section>

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
          <Link href="/privacy"  style={{ color: 'var(--text-brand)', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/terms"    style={{ color: 'white', textDecoration: 'none' }}>Terms</Link>
          <Link href="/faq"      style={{ color: 'white', textDecoration: 'none' }}>FAQ</Link>
          <Link href="/feedback" style={{ color: 'white', textDecoration: 'none' }}>Feedback</Link>
        </div>
        <span style={{ color: 'var(--text-muted)' }}>© 2026 CVtoWeb</span>
      </footer>
    </main>
  );
}
