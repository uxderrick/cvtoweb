'use client';

import { useEffect, useRef, useState } from 'react';

type ThemeValue = 'midnight' | 'snow' | 'cobalt';

interface ThemeSelectorProps {
  value: ThemeValue;
  onChange: (value: ThemeValue) => void;
}

const themeOptions: Array<{
  value: ThemeValue;
  label: string;
  swatch: string;
}> = [
  { value: 'midnight', label: 'Midnight', swatch: 'linear-gradient(135deg, var(--brand-200), var(--brand-700))' },
  { value: 'snow', label: 'Snow', swatch: 'linear-gradient(135deg, var(--neutral-0), var(--neutral-300))' },
  { value: 'cobalt', label: 'Cobalt', swatch: 'linear-gradient(135deg, var(--info-400), var(--brand-200))' },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 160ms ease' }}
    >
      <path d="M6 9l6 6 6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const activeOption = themeOptions.find((option) => option.value === value) ?? themeOptions[0];

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div
      ref={rootRef}
      className="relative mr-1"
      style={{
        backgroundColor: 'oklch(1 0 0 / 0.05)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '0.625rem',
        padding: '0 0.625rem',
        height: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      <span
        style={{
          fontSize: '0.6rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 700,
          color: 'var(--text-muted)',
        }}
      >
        Theme
      </span>

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        style={{
          minWidth: '7.25rem',
          height: '100%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          backgroundColor: 'transparent',
          border: 'none',
          color: 'var(--text-primary)',
          fontSize: 'var(--type-body-sm-size)',
          fontWeight: 600,
          cursor: 'pointer',
          outline: 'none',
          padding: 0,
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            aria-hidden="true"
            style={{
              width: '0.625rem',
              height: '0.625rem',
              borderRadius: '999px',
              background: activeOption.swatch,
              boxShadow: '0 0 0 1px oklch(1 0 0 / 0.08)',
              flexShrink: 0,
            }}
          />
          <span>{activeOption.label}</span>
        </span>
        <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center' }}>
          <ChevronIcon open={isOpen} />
        </span>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Theme options"
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.5rem)',
            right: 0,
            minWidth: '11rem',
            padding: '0.375rem',
            borderRadius: '0.875rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            boxShadow: '0 18px 42px oklch(0.050 0.018 278.887 / 0.42)',
            zIndex: 60,
          }}
        >
          {themeOptions.map((option) => {
            const selected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '0.625rem',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: selected ? 'oklch(1 0 0 / 0.06)' : 'transparent',
                  color: selected ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: 'var(--type-body-sm-size)',
                  fontWeight: selected ? 600 : 500,
                  textAlign: 'left',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem' }}>
                  <span
                    aria-hidden="true"
                    style={{
                      width: '0.75rem',
                      height: '0.75rem',
                      borderRadius: '999px',
                      background: option.swatch,
                      boxShadow: '0 0 0 1px oklch(1 0 0 / 0.08)',
                      flexShrink: 0,
                    }}
                  />
                  <span>{option.label}</span>
                </span>
                {selected && (
                  <span style={{ color: 'var(--text-brand)', fontSize: '0.75rem', fontWeight: 700 }}>
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
