'use client';

import { useId, type CSSProperties } from 'react';

export type MascotState =
  | 'idle'
  | 'thinking'
  | 'success'
  | 'alert'
  | 'routing'
  | 'celebrating'
  | 'speaking';

export type MascotSize = 'sm' | 'md' | 'lg' | 'xl';

interface MascotProps {
  state?: MascotState;
  size?: MascotSize;
  speechText?: string;
  className?: string;
  'aria-label'?: string;
}

const sizeMap: Record<
  MascotSize,
  {
    stage: number;
    orb: number;
    bubbleWidth: number;
    bubbleFont: number;
    confettiDrop: number;
  }
> = {
  sm: { stage: 92, orb: 44, bubbleWidth: 156, bubbleFont: 10, confettiDrop: 26 },
  md: { stage: 128, orb: 66, bubbleWidth: 206, bubbleFont: 12, confettiDrop: 34 },
  lg: { stage: 156, orb: 86, bubbleWidth: 228, bubbleFont: 13, confettiDrop: 40 },
  xl: { stage: 220, orb: 128, bubbleWidth: 280, bubbleFont: 15, confettiDrop: 52 },
};

const palettes: Record<
  MascotState,
  {
    start: string;
    end: string;
    face: string;
    blush: string;
    glow: string;
    badge?: string;
    ring?: string;
    accent?: string;
  }
> = {
  idle: {
    start: 'var(--info-100)',
    end: 'var(--brand-100)',
    face: 'var(--brand-800)',
    blush: 'var(--brand-50)',
    glow: 'oklch(0.58 0.20 220 / 0.14)',
    ring: 'oklch(0.68 0.18 220 / 0.16)',
    accent: 'var(--neutral-0)',
  },
  thinking: {
    start: 'var(--brand-50)',
    end: 'var(--brand-100)',
    face: 'var(--brand-800)',
    blush: 'var(--brand-50)',
    glow: 'oklch(0.532 0.157 278.887 / 0.15)',
    ring: 'oklch(0.58 0.20 220 / 0.14)',
    accent: 'var(--neutral-0)',
  },
  success: {
    start: 'var(--success-100)',
    end: 'var(--success-600)',
    face: 'var(--success-900)',
    blush: 'var(--success-100)',
    glow: 'oklch(0.62 0.20 145 / 0.18)',
    badge: 'var(--success-600)',
    accent: 'var(--neutral-0)',
  },
  alert: {
    start: 'var(--warning-100)',
    end: 'var(--warning-500)',
    face: 'var(--warning-900)',
    blush: 'var(--warning-100)',
    glow: 'oklch(0.72 0.19 75 / 0.16)',
    accent: 'var(--neutral-0)',
  },
  routing: {
    start: 'var(--info-100)',
    end: 'var(--brand-100)',
    face: 'var(--brand-800)',
    blush: 'var(--info-100)',
    glow: 'oklch(0.58 0.20 220 / 0.13)',
    ring: 'oklch(0.58 0.20 220 / 0.2)',
    accent: 'var(--neutral-0)',
  },
  celebrating: {
    start: 'var(--brand-50)',
    end: 'var(--brand-100)',
    face: 'var(--brand-700)',
    blush: 'var(--brand-50)',
    glow: 'oklch(0.532 0.157 278.887 / 0.18)',
    accent: 'var(--neutral-0)',
  },
  speaking: {
    start: 'var(--info-100)',
    end: 'var(--info-500)',
    face: 'var(--info-900)',
    blush: 'var(--info-100)',
    glow: 'oklch(0.58 0.20 220 / 0.18)',
    accent: 'var(--neutral-0)',
  },
};

const confettiParticles = [
  { left: '88%', top: '50%', size: 4, radius: '999px', color: 'var(--brand-50)', delay: '0s', dur: '1.2s', rotate: '180deg', drift: '8px' },
  { left: '89.8372%', top: '73%', size: 6, radius: '2px', color: 'var(--warning-400)', delay: '0.08s', dur: '1.5s', rotate: '-210deg', drift: '-10px' },
  { left: '77%', top: '96.7654%', size: 8, radius: '2px', color: 'var(--warning-500)', delay: '0.16s', dur: '1.8s', rotate: '240deg', drift: '12px' },
  { left: '50%', top: '88%', size: 4, radius: '999px', color: 'var(--brand-100)', delay: '0.24s', dur: '1.2s', rotate: '-270deg', drift: '-14px' },
  { left: '27%', top: '89.8372%', size: 6, radius: '2px', color: 'var(--info-400)', delay: '0.32s', dur: '1.5s', rotate: '300deg', drift: '16px' },
  { left: '3.23463%', top: '77%', size: 8, radius: '2px', color: 'var(--warning-400)', delay: '0.4s', dur: '1.8s', rotate: '-330deg', drift: '-18px' },
  { left: '12%', top: '50%', size: 4, radius: '999px', color: 'var(--brand-50)', delay: '0.48s', dur: '1.2s', rotate: '360deg', drift: '20px' },
  { left: '10.1628%', top: '27%', size: 6, radius: '2px', color: 'var(--warning-500)', delay: '0.56s', dur: '1.5s', rotate: '-390deg', drift: '-22px' },
  { left: '23%', top: '3.23463%', size: 8, radius: '2px', color: 'var(--brand-50)', delay: '0.64s', dur: '1.8s', rotate: '420deg', drift: '24px' },
  { left: '50%', top: '12%', size: 4, radius: '999px', color: 'var(--warning-400)', delay: '0.72s', dur: '1.2s', rotate: '-450deg', drift: '-26px' },
  { left: '73%', top: '10.1628%', size: 6, radius: '2px', color: 'var(--warning-500)', delay: '0.8s', dur: '1.5s', rotate: '480deg', drift: '28px' },
  { left: '96.7654%', top: '23%', size: 8, radius: '2px', color: 'var(--brand-100)', delay: '0.88s', dur: '1.8s', rotate: '-510deg', drift: '-30px' },
];

function Eye({
  cx,
  cy,
  pupilDx = 0,
  pupilDy = 0,
  sclera = 'var(--neutral-0)',
  iris = 'var(--brand-800)',
}: {
  cx: number;
  cy: number;
  pupilDx?: number;
  pupilDy?: number;
  sclera?: string;
  iris?: string;
}) {
  return (
    <>
      <circle cx={cx} cy={cy} r="4.8" fill={sclera} />
      <circle cx={cx + pupilDx} cy={cy + pupilDy} r="2.4" fill={iris} />
      <circle cx={cx + pupilDx + 0.8} cy={cy + pupilDy - 1.2} r="0.9" fill="#FFFFFF" />
    </>
  );
}

function SpeechBubble({
  text,
  width,
  fontSize,
  orb,
}: {
  text: string;
  width: number;
  fontSize: number;
  orb: number;
}) {
  return (
    <div
      className="absolute mascot-bubble"
      style={{
        left: `calc(50% + ${orb * 0.22}px)`,
        top: `${orb * 0.5}px`,
        width,
        backgroundColor: 'var(--bg-surface)',
        color: 'var(--text-primary)',
        borderRadius: '1.1rem',
        padding: `${Math.max(10, fontSize)}px ${Math.max(14, fontSize + 2)}px`,
        boxShadow: '0 18px 45px oklch(0.050 0.018 278.887 / 0.32)',
        border: '1px solid oklch(1 0 0 / 0.08)',
        lineHeight: 1.35,
        fontSize,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '-8px',
          top: '58%',
          width: '16px',
          height: '16px',
          backgroundColor: 'var(--bg-surface)',
          borderLeft: '1px solid oklch(1 0 0 / 0.08)',
          borderBottom: '1px solid oklch(1 0 0 / 0.08)',
          transform: 'translateY(-50%) rotate(45deg)',
          borderBottomLeftRadius: '4px',
        }}
      />
      {text}
    </div>
  );
}

function MascotFace({
  state,
  palette,
}: {
  state: MascotState;
  palette: (typeof palettes)[MascotState];
}) {
  if (state === 'thinking') {
    return (
      <>
        <Eye cx={42} cy={53} pupilDx={-1.1} pupilDy={-1.4} iris={palette.face} />
        <Eye cx={58} cy={53} pupilDx={-0.9} pupilDy={-1.1} iris={palette.face} />
        <path
          d="M44 63 Q50 62 56 63"
          stroke={palette.face}
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="62" cy="57" r="3.2" fill={palette.blush} opacity="0.75" />
      </>
    );
  }

  if (state === 'success' || state === 'celebrating') {
    return (
      <>
        <path d="M35 52 Q40 47 45 52" stroke={palette.face} strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <path d="M55 52 Q60 47 65 52" stroke={palette.face} strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <path d="M40 59 Q50 69 60 59" stroke={palette.face} strokeWidth="2.3" strokeLinecap="round" fill="none" />
        <ellipse cx="50" cy="63" rx="5.2" ry="2.6" fill="#F472B6" opacity="0.7" />
        <circle cx="33" cy="57" r="4.2" fill={palette.blush} opacity="0.45" />
        <circle cx="67" cy="57" r="4.2" fill={palette.blush} opacity="0.45" />
      </>
    );
  }

  if (state === 'alert') {
    return (
      <>
        <Eye cx={39} cy={54} pupilDx={-0.2} pupilDy={0.1} iris={palette.face} />
        <Eye cx={61} cy={54} pupilDx={0.2} pupilDy={0.1} iris={palette.face} />
        <circle cx="50" cy="66" r="3.6" fill={palette.face} opacity="0.85" />
      </>
    );
  }

  return (
    <>
      <Eye cx={39} cy={54} pupilDx={-0.1} pupilDy={0.2} iris={palette.face} />
      <Eye cx={61} cy={54} pupilDx={0.1} pupilDy={0.2} iris={palette.face} />
      <path
        d="M42 63 Q50 70 58 63"
        stroke={palette.face}
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      {(state === 'routing' || state === 'speaking') && (
        <>
          <circle cx="33" cy="58" r="3.3" fill={palette.blush} opacity="0.34" />
          <circle cx="67" cy="58" r="3.3" fill={palette.blush} opacity="0.34" />
        </>
      )}
    </>
  );
}

function liftAnimation(state: MascotState): string {
  switch (state) {
    case 'thinking':
      return 'mascot-think 2.8s ease-in-out infinite';
    case 'success':
      return 'mascot-success 1.8s ease-out infinite';
    case 'alert':
      return 'mascot-alert 1.4s ease-in-out infinite';
    case 'routing':
      return 'mascot-route 2.4s ease-in-out infinite';
    case 'celebrating':
      return 'mascot-celebrate 2.6s ease-in-out infinite';
    case 'speaking':
      return 'mascot-speak 3s ease-in-out infinite';
    default:
      return 'mascot-idle 3.2s ease-in-out infinite';
  }
}

export function Mascot({
  state = 'idle',
  size = 'md',
  speechText = 'Tip: MTN routes are fastest between 8am-6pm.',
  className,
  'aria-label': ariaLabel,
}: MascotProps) {
  const ids = useId().replace(/:/g, '');
  const gradientId = `mascot-grad-${state}-${ids}`;
  const config = sizeMap[size];
  const palette = palettes[state];

  const wrapperStyle: CSSProperties = {
    width: config.stage,
    height: config.stage,
    overflow: 'visible',
  };

  const bubble = state === 'speaking'
    ? (
      <SpeechBubble
        text={speechText}
        width={config.bubbleWidth}
        fontSize={config.bubbleFont}
        orb={config.orb}
      />
    )
    : null;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className || ''}`}
      style={wrapperStyle}
      role="img"
      aria-label={ariaLabel || `Pulse mascot - ${state}`}
      data-state={state}
    >
      {state === 'thinking' && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
          {[0, 1, 2].map((ringIndex) => {
            const sizePercent = 60 + ringIndex * 28;
            return (
              <div
                key={ringIndex}
                className="absolute rounded-full mascot-ring"
                style={{
                  width: `${sizePercent}%`,
                  height: `${sizePercent}%`,
                  border: `1.5px solid ${palette.ring}`,
                  animationDelay: `${ringIndex * 0.22}s`,
                }}
              />
            );
          })}
        </div>
      )}

      {state === 'routing' && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {(['left', 'right'] as const).map((side, idx) => (
            <svg
              key={side}
              viewBox="0 0 30 60"
              width={config.stage * 0.16}
              height={config.stage * 0.32}
              className="absolute top-1/2 -translate-y-1/2 mascot-wave"
              style={{
                [side]: `${config.stage * 0.06}px`,
                animationDelay: `${idx * 0.18}s`,
              }}
            >
              <path
                d={side === 'left' ? 'M22 10 Q10 30 22 50' : 'M8 10 Q20 30 8 50'}
                stroke={palette.ring}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          ))}
        </div>
      )}

      {state === 'celebrating' && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {confettiParticles.map((particle, index) => (
            <div
              key={`${particle.left}-${index}`}
              className="absolute mascot-confetti-particle"
              style={{
                left: particle.left,
                top: particle.top,
                width: particle.size,
                height: particle.size,
                borderRadius: particle.radius,
                backgroundColor: particle.color,
                animationDelay: particle.delay,
                animationDuration: particle.dur,
                ['--confetti-rotate' as string]: particle.rotate,
                ['--confetti-x' as string]: particle.drift,
                ['--confetti-drop' as string]: `${config.confettiDrop}px`,
              }}
            />
          ))}
        </div>
      )}

      {bubble}

      {state === 'success' && (
        <div
          className="absolute mascot-check"
          aria-hidden="true"
          style={{
            top: `${config.stage * 0.02}px`,
            right: `${config.stage * 0.1}px`,
            width: config.orb * 0.26,
            height: config.orb * 0.26,
            borderRadius: '999px',
            backgroundColor: 'transparent',
            border: `2px solid ${palette.badge}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: palette.badge,
            boxShadow: '0 10px 24px rgba(22, 155, 98, 0.2)',
          }}
        >
          <svg viewBox="0 0 16 16" width={config.orb * 0.14} height={config.orb * 0.14} fill="none">
            <path d="M3 8.5L6.3 11.8L13 4.8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      <div
        aria-hidden="true"
        className="absolute rounded-full"
        style={{
          width: config.orb * 0.82,
          height: config.orb * 0.82,
          backgroundColor: palette.glow,
          filter: `blur(${Math.max(14, config.orb * 0.14)}px)`,
          top: `${config.stage * 0.2}px`,
        }}
      />

      <div
        className="absolute mascot-shadow"
        aria-hidden="true"
        style={{
          bottom: `${config.stage * 0.12}px`,
          left: '50%',
          width: config.orb * 0.56,
          height: config.orb * 0.1,
          borderRadius: '999px',
          backgroundColor: 'oklch(1 0 0 / 0.08)',
        }}
      />

      <div
        className="relative z-10"
        style={{
          width: config.orb,
          height: config.orb,
          animation: liftAnimation(state),
          transformOrigin: '50% 70%',
        }}
      >
        <svg viewBox="0 0 100 100" width={config.orb} height={config.orb} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse
            cx="50"
            cy="54"
            rx="34"
            ry="32"
            fill={`url(#${gradientId})`}
          />
          <ellipse cx="40" cy="40" rx="14" ry="10" fill={palette.accent} opacity="0.18" transform="rotate(-15 40 40)" />
          <circle cx="50" cy="17" r="2.4" fill={palette.accent} opacity="0.75" className={state === 'alert' ? 'mascot-antenna-glow' : ''} />
          <path d="M50 22 Q50 18 52 14" stroke={palette.accent} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />

          {MascotFace({ state, palette })}

          {state === 'celebrating' && (
            <>
              {[0, 0.3, 0.6, 0.15].map((delay, index) => (
                <path
                  key={delay}
                  d={[
                    'M24 31.5 L24.75 33.25 L26.5 34 L24.75 34.75 L24 36.5 L23.25 34.75 L21.5 34 L23.25 33.25 Z',
                    'M76 28 L76.6 29.4 L78 30 L76.6 30.6 L76 32 L75.4 30.6 L74 30 L75.4 29.4 Z',
                    'M18 50.5 L18.45 51.55 L19.5 52 L18.45 52.45 L18 53.5 L17.55 52.45 L16.5 52 L17.55 51.55 Z',
                    'M82 50.25 L82.525 51.475 L83.75 52 L82.525 52.525 L82 53.75 L81.475 52.525 L80.25 52 L81.475 51.475 Z',
                  ][index]}
                  fill={palette.accent}
                  opacity="0.72"
                  className="mascot-sparkle"
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </>
          )}

          <defs>
            <radialGradient id={gradientId} cx="45%" cy="35%" r="65%">
              <stop offset="0%" stopColor={palette.start} />
              <stop offset="100%" stopColor={palette.end} />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
