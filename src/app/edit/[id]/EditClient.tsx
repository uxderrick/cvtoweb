'use client';

import { useState, useEffect, useRef } from 'react';
import { Portfolio, PortfolioData } from '@/types/portfolio';
import PortfolioTemplate from '@/components/PortfolioTemplate';
import { getPortfolioUrl } from '@/lib/urls';
import { Button } from '@/components/ui/Button';
import { ThemeSelector } from '@/components/ui/ThemeSelector';

interface Props {
  portfolio: Portfolio;
  editToken: string;
}

/* ── Icons ───────────────────────────────────────────────── */
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

/* ── Component ───────────────────────────────────────────── */
export default function EditClient({ portfolio, editToken }: Props) {
  const [isEditing,   setIsEditing]   = useState(true);
  const [localData,   setLocalData]   = useState<PortfolioData>(portfolio.portfolio_data);
  const [isSaving,    setIsSaving]    = useState(false);
  const [saveStatus,  setSaveStatus]  = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const isFirstRender     = useRef(true);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const publicUrl = getPortfolioUrl(portfolio.username!);

  /* ── Save ───────────────────────────────────────────────── */
  const performSave = async (data: PortfolioData, silent = false) => {
    if (!silent) setIsSaving(true);
    setSaveStatus('saving');

    try {
      const res = await fetch('/api/update-portfolio', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolioId: portfolio.id,
          editToken,
          portfolioData: data,
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error || 'Failed to save');
      }

      setSaveStatus('saved');
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

  const handleSaveUpdates = async () => {
    const success = await performSave(localData);
    if (success) {
      setIsEditing(false);
      window.open(publicUrl, '_blank');
    }
  };

  /* ── Auto-save ──────────────────────────────────────────── */
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

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--neutral-950, #0a0a0f)' }}
    >
      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-4 py-2.5"
        style={{
          backgroundColor: 'var(--brand-800)',
          borderBottom: '1px solid var(--border-subtle)',
          minHeight: '52px',
        }}
      >
        {/* Left: status + save indicator */}
        <div className="flex items-center gap-3">
          {/* Status pill */}
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: isEditing
                  ? 'var(--warning-400, oklch(0.78 0.17 75))'
                  : 'var(--success-400)',
                animation: isEditing ? 'pulse 1.5s ease-in-out infinite' : undefined,
              }}
            />
            <span
              style={{
                fontSize: 'var(--type-body-sm-size)',
                fontWeight: 600,
                color: 'var(--text-secondary)',
              }}
            >
              {isEditing ? 'Editing Live Site' : 'Live Site'}
            </span>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)' }} />

          {/* Auto-save status */}
          <div className="hidden md:flex items-center gap-1.5">
            {saveStatus === 'saving' && (
              <span style={{ fontSize: 'var(--type-caption-size)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width={12} height={12} viewBox="0 0 16 16" fill="none"
                  style={{ animation: 'btn-spin 0.7s linear infinite' }}>
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
                  <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                Saving…
              </span>
            )}
            {saveStatus === 'saved' && (
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

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              {/* Theme selector */}
              <ThemeSelector
                value={localData.theme || 'midnight'}
                onChange={(theme) => setLocalData({ ...localData, theme })}
              />

              <Button
                variant="ghost"
                size="md"
                disabled={isSaving}
                onClick={() => {
                  setLocalData(portfolio.portfolio_data);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>

              <Button
                variant="secondary"
                size="md"
                iconRight={<ExternalLinkIcon />}
                onClick={() => window.open(publicUrl, '_blank')}
              >
                Visit Live Site
              </Button>

              <Button
                variant="primary"
                size="md"
                loading={isSaving}
                onClick={handleSaveUpdates}
              >
                Save Updates
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                size="md"
                iconLeft={<EditIcon />}
                onClick={() => setIsEditing(true)}
              >
                Edit Content
              </Button>

              <Button
                variant="secondary"
                size="md"
                iconRight={<ExternalLinkIcon />}
                onClick={() => window.open(publicUrl, '_blank')}
              >
                Visit Live Site
              </Button>
            </>
          )}
        </div>
      </div>

      {/* ── Working Area ─────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        <PortfolioTemplate
          data={localData}
          isEditing={isEditing}
          onUpdate={setLocalData}
        />
      </div>
    </div>
  );
}
