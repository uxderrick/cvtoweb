'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Portfolio, PortfolioData } from '@/types/portfolio';
import PortfolioTemplate from '@/components/PortfolioTemplate';
import PublishModal from '@/components/PublishModal';
import { getPortfolioUrl } from '@/lib/urls';
import { Button } from '@/components/ui/Button';
import { ThemeSelector } from '@/components/ui/ThemeSelector';

/* ── Mobile overflow menu ───────────────────────────────────── */
function MoreMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative sm:hidden">
      <button
        aria-label="More actions"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '44px', height: '44px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '0.5rem', border: '1px solid var(--border-subtle)',
          backgroundColor: open ? 'oklch(1 0 0 / 0.08)' : 'transparent',
          color: 'var(--text-secondary)', cursor: 'pointer',
        }}
      >
        <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 100,
            minWidth: '200px', padding: '0.5rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: '0.875rem',
            boxShadow: '0 16px 40px oklch(0.050 0.018 278.887 / 0.45)',
          }}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface Props {
  portfolio: Portfolio;
  editToken: string;
}

/* ── Icons ───────────────────────────────────────────────── */
function ChevronLeft() {
  return (
    <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width={15} height={15} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width={12} height={12} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width={12} height={12} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function PreviewClient({ portfolio, editToken }: Props) {
  const router = useRouter();
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [localData, setLocalData] = useState<PortfolioData>(portfolio.portfolio_data);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const isFirstRender = useRef(true);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePublishSuccess = (username: string) => {
    router.push(
      `/published?username=${username}&id=${portfolio.id}&token=${encodeURIComponent(editToken)}`
    );
  };

  const performSave = async (data: PortfolioData, silent = false) => {
    if (!silent) {
      setIsSaving(true);
      setSaveStatus('saving');
    } else {
      setSaveStatus('saving');
    }

    try {
      const response = await fetch('/api/update-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolioId: portfolio.id,
          editToken,
          portfolioData: data,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || 'Failed to save');
      }

      setSaveStatus('success');

      if (!silent) router.refresh();

      setTimeout(() => setSaveStatus('idle'), 3000);
      return true;
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
      return false;
    } finally {
      if (!silent) setIsSaving(false);
    }
  };

  const handleManualSave = async () => {
    const success = await performSave(localData);
    if (success) {
      setIsEditing(false);
      if (isPublished && publicUrl) {
        window.open(publicUrl, '_blank');
      }
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!isEditing) return;

    if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);

    autoSaveTimeoutRef.current = setTimeout(() => {
      performSave(localData, true);
    }, 1500);

    return () => {
      if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localData, isEditing]);

  const publicUrl = portfolio.username ? getPortfolioUrl(portfolio.username) : null;
  const isPublished = !!portfolio.is_published || !!portfolio.username;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--neutral-950, #0a0a0f)' }}
    >
      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-3 sm:px-4 py-2.5"
        style={{
          backgroundColor: 'var(--brand-800)',
          borderBottom: '1px solid var(--border-subtle)',
          minHeight: '52px',
        }}
      >
        {/* Left: home + status */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Back home — icon on mobile, icon+label on desktop */}
          <button
            onClick={() => router.push('/')}
            aria-label="Back to home"
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              height: '44px', padding: '0 8px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', borderRadius: '0.5rem',
              flexShrink: 0,
            }}
          >
            <ChevronLeft />
            <span className="hidden sm:inline" style={{ fontSize: 'var(--type-body-sm-size)', fontWeight: 500 }}>Home</span>
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)', flexShrink: 0 }} />

          {/* Status pill */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                backgroundColor: isEditing
                  ? 'var(--warning-400, oklch(0.78 0.17 75))'
                  : 'var(--success-400)',
                animation: isEditing ? 'pulse 1.5s ease-in-out infinite' : undefined,
              }}
            />
            <span
              className="truncate"
              style={{ fontSize: 'var(--type-body-sm-size)', fontWeight: 600, color: 'var(--text-secondary)' }}
            >
              {isPublished
                ? (isEditing ? 'Editing Live Site' : 'Live Preview')
                : (isEditing ? 'Editing Draft' : 'Draft Preview')}
            </span>
          </div>

          {/* Auto-save — desktop only */}
          <div className="hidden sm:flex items-center gap-1.5 ml-1">
            {saveStatus === 'saving' && (
              <span style={{ fontSize: 'var(--type-caption-size)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width={12} height={12} viewBox="0 0 16 16" fill="none" style={{ animation: 'btn-spin 0.7s linear infinite' }}>
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
                  <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                Saving…
              </span>
            )}
            {saveStatus === 'success' && (
              <span style={{ fontSize: 'var(--type-caption-size)', color: 'var(--success-400)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckIcon /> Saved
              </span>
            )}
            {saveStatus === 'error' && (
              <span style={{ fontSize: 'var(--type-caption-size)', color: 'var(--text-error)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertIcon /> Save failed
              </span>
            )}
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isEditing ? (
            <>
              {/* Desktop secondary controls */}
              <div className="hidden sm:flex items-center gap-2">
                <ThemeSelector
                  value={localData.theme || 'midnight'}
                  onChange={(theme) => setLocalData({ ...localData, theme })}
                />
                <Button variant="ghost" size="md" disabled={isSaving}
                  onClick={() => { setLocalData(portfolio.portfolio_data); setIsEditing(false); }}>
                  Cancel
                </Button>
                {isPublished && (
                  <Button variant="secondary" size="md" iconRight={<ExternalLinkIcon />}
                    onClick={() => window.open(publicUrl || '#', '_blank')}>
                    Visit Live Site
                  </Button>
                )}
              </div>

              {/* Always: primary save */}
              <Button variant="primary" size="md" loading={isSaving} onClick={handleManualSave}>
                <span className="sm:hidden">Save</span>
                <span className="hidden sm:inline">{isPublished ? 'Save Updates' : 'Save Changes'}</span>
              </Button>

              {/* Mobile overflow */}
              <MoreMenu>
                <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.25rem' }}>
                  <ThemeSelector
                    value={localData.theme || 'midnight'}
                    onChange={(theme) => setLocalData({ ...localData, theme })}
                  />
                </div>
                <button
                  style={{ width: '100%', padding: '0.65rem 0.75rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--type-body-sm-size)', color: 'var(--text-secondary)', borderRadius: '0.5rem' }}
                  onClick={() => { setLocalData(portfolio.portfolio_data); setIsEditing(false); }}
                >
                  Cancel
                </button>
                {isPublished && (
                  <button
                    style={{ width: '100%', padding: '0.65rem 0.75rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--type-body-sm-size)', color: 'var(--text-secondary)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => window.open(publicUrl || '#', '_blank')}
                  >
                    <ExternalLinkIcon /> Visit Live Site
                  </button>
                )}
              </MoreMenu>
            </>
          ) : (
            <>
              <Button variant="secondary" size="md" iconLeft={<EditIcon />} onClick={() => setIsEditing(true)}>
                <span className="sm:hidden">Edit</span>
                <span className="hidden sm:inline">Edit Content</span>
              </Button>

              {!isPublished && (
                <Button variant="primary" size="md" onClick={() => setShowPublishModal(true)}>
                  <span className="sm:hidden">Publish</span>
                  <span className="hidden sm:inline">Publish Site</span>
                </Button>
              )}

              {isPublished && (
                <Button variant="secondary" size="md" iconRight={<ExternalLinkIcon />}
                  onClick={() => window.open(publicUrl || '#', '_blank')}>
                  <span className="sm:hidden">Visit</span>
                  <span className="hidden sm:inline">Visit Live Site</span>
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Working Area ────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        <PortfolioTemplate
          data={localData}
          isEditing={isEditing}
          onUpdate={setLocalData}
        />
      </div>

      {/* ── Publish Modal ────────────────────────────────────── */}
      {showPublishModal && (
        <PublishModal
          portfolioId={portfolio.id}
          editToken={editToken}
          suggestedUsername={localData.name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .slice(0, 20)}
          onClose={() => setShowPublishModal(false)}
          onSuccess={handlePublishSuccess}
        />
      )}
    </div>
  );
}
