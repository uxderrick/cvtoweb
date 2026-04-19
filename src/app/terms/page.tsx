'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

const CONTACT_EMAIL = 'carlyneket@gmail.com';

/* ── Scroll-reveal wrapper ───────────────────────────────── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
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
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
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

function EmailLink() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--text-brand)', textDecoration: 'underline' }}>
      {CONTACT_EMAIL}
    </a>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function TermsPage() {
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

      {/* Radial gradients — fixed to viewport so they don't interfere with scroll */}
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

          {/* Page header — immediate reveal on mount */}
          <Reveal>
            <div style={{ marginBottom: '3rem' }}>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                marginBottom: '0.5rem',
              }}>
                Terms of Service
              </h1>
              <p style={{ fontSize: 'var(--type-body-sm-size)', color: 'var(--text-muted)' }}>
                Last updated: April 2026
              </p>
            </div>
          </Reveal>

          {/* 1. Acceptance */}
          <Section title="1. Acceptance of Terms">
            <P>
              By uploading a CV or resume to CVtoWeb, or by publishing a portfolio through the service,
              you agree to these Terms of Service ("Terms"). If you do not agree, do not use CVtoWeb.
            </P>
          </Section>

          {/* 2. What CVtoWeb Is */}
          <Section title="2. What CVtoWeb Is">
            <P>
              CVtoWeb is a web-based tool that converts your CV or resume into a hosted portfolio website.
              The service is currently free to use and requires no account registration.
            </P>
          </Section>

          {/* 3. IP */}
          <Section title="3. Your Content & Intellectual Property">
            <H3>You own your content.</H3>
            <P>
              You retain full ownership of your CV, resume, and any other content you upload to CVtoWeb.
            </P>

            <H3>Licence you grant us.</H3>
            <P>By uploading your CV, you grant CVtoWeb a limited, non-exclusive licence to:</P>
            <List items={[
              'Process your CV to extract text',
              'Send that text to our AI provider to generate your portfolio',
              'Store and publicly host the resulting portfolio on your chosen subdomain',
            ]} />
            <P>
              This licence exists solely to provide the service and ends when your portfolio is deleted.
            </P>

            <H3>We will not:</H3>
            <List items={[
              'Use your CV or its contents to train AI models',
              'Share your content with third parties beyond what is necessary to deliver the service',
              'Use your content for any purpose other than generating and hosting your portfolio',
            ]} />

            <H3>AI-generated output.</H3>
            <P>
              The portfolio generated from your CV is a derivative work. You are free to use, share,
              and republish it. You are responsible for reviewing it for accuracy before making it public.
            </P>
          </Section>

          {/* 4. Acceptable Use */}
          <Section title="4. Acceptable Use">
            <P>You agree not to use CVtoWeb to:</P>
            <List items={[
              'Upload content that is illegal, defamatory, or infringes the rights of others',
              'Upload CVs or content that does not belong to you',
              'Attempt to reverse-engineer, scrape, or abuse the service',
              'Upload malware, harmful code, or content designed to disrupt the service',
              'Use CVtoWeb for spam, fraud, or impersonation',
            ]} />
            <P>
              We reserve the right to remove any portfolio that violates these terms without notice.
            </P>
          </Section>

          {/* 5. AI Disclaimer */}
          <Section title="5. AI Output Disclaimer">
            <P>CVtoWeb uses AI to generate your portfolio from your CV. You should be aware that:</P>
            <List items={[
              'AI-generated content may contain errors, inaccuracies, or omissions',
              'We do not guarantee the accuracy, completeness, or fitness of generated content',
              'You are solely responsible for reviewing your portfolio before publishing it',
              'You should not rely on AI-generated content as a substitute for professional advice',
            ]} />
            <P>
              Before your CV is processed, its extracted text is sent to Anthropic's Claude API. By
              using CVtoWeb, you acknowledge and consent to this processing.
            </P>
          </Section>

          {/* 6. Public Portfolios */}
          <Section title="6. Public Portfolios & Subdomains">
            <P>
              When you publish a portfolio, it becomes publicly accessible at{' '}
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>yourname.cvtoweb.com</span>.
              You understand that:
            </P>
            <List items={[
              'Your portfolio may be indexed by search engines',
              'Anyone with the link can view it',
              'You are responsible for the content you choose to make public',
              'CVtoWeb is not responsible for how third parties access or use your publicly available portfolio',
            ]} />
          </Section>

          {/* 7. Availability */}
          <Section title="7. Availability & Uptime">
            <P>CVtoWeb is provided free of charge on a best-effort basis. We do not guarantee:</P>
            <List items={[
              'Uninterrupted availability of the service',
              'Permanent hosting of your portfolio',
              'That the service will remain free in the future',
            ]} />
            <P>
              We will endeavour to provide reasonable notice of any significant changes to
              availability or pricing.
            </P>
          </Section>

          {/* 8. Limitation of Liability */}
          <Section title="8. Limitation of Liability">
            <P>
              To the maximum extent permitted by law, CVtoWeb and its operators are not liable for:
            </P>
            <List items={[
              'Errors or inaccuracies in AI-generated portfolio content',
              'Loss of data or portfolio content',
              'Any damages arising from the public availability of your portfolio',
              'Third-party claims resulting from content you uploaded or published',
              'Downtime, service interruptions, or discontinuation of the service',
            ]} />
            <P>
              The service is provided <strong style={{ color: 'var(--text-primary)' }}>"as is"</strong> without
              warranty of any kind, express or implied.
            </P>
          </Section>

          {/* 9. Indemnification */}
          <Section title="9. Indemnification">
            <P>
              You agree to indemnify and hold CVtoWeb harmless from any claims, damages, or costs
              (including legal fees) arising from:
            </P>
            <List items={[
              'Content you uploaded or published',
              'Your violation of these Terms',
              'Any third-party claim related to your portfolio',
            ]} />
          </Section>

          {/* 10. Termination */}
          <Section title="10. Termination & Content Removal">
            <P>
              To delete your portfolio, email <EmailLink /> with your portfolio username. We will
              permanently remove your portfolio and all associated data within a reasonable timeframe.
            </P>
            <P>
              We may also remove your portfolio without notice if it violates these Terms, applicable
              law, or poses a risk to the service or its users.
            </P>
          </Section>

          {/* 11. Changes */}
          <Section title="11. Changes to the Service or Terms">
            <P>
              We may update these Terms from time to time. Changes will be posted here with an updated
              date. Continued use of CVtoWeb after changes are posted constitutes acceptance of the
              updated Terms.
            </P>
          </Section>

          {/* 12. Governing Law */}
          <Section title="12. Governing Law">
            <P>
              These Terms are governed by the laws of Ghana. While CVtoWeb is available globally, any
              disputes arising from your use of the service will be subject to the jurisdiction of the
              courts of Ghana, unless local mandatory laws in your country provide otherwise.
            </P>
          </Section>

          {/* 13. Contact */}
          <Section title="13. Contact">
            <P>For questions about these Terms: <EmailLink /></P>
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
          <Link href="/privacy"  style={{ color: 'white', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/terms"    style={{ color: 'var(--text-brand)', textDecoration: 'none' }}>Terms</Link>
          <Link href="/faq"      style={{ color: 'white', textDecoration: 'none' }}>FAQ</Link>
          <Link href="/feedback" style={{ color: 'white', textDecoration: 'none' }}>Feedback</Link>
        </div>
        <span style={{ color: 'var(--text-muted)' }}>© 2026 CVtoWeb</span>
      </footer>
    </main>
  );
}
