import type { CSSProperties } from 'react';
import { MAX_MISSES, TENSION_MISSES } from '../../engine/rules';

/** The game's emblem: 9 notches on the arc are the 9 attempts, and it swings harder as they burn. */
export function Pendulum({ misses = 0, className = '' }: { misses?: number; className?: string }) {
  const tense = misses >= TENSION_MISSES;
  const rodColor = tense ? '#FF8B38' : '#19D8FF';
  const style = {
    '--swing': `${14 + misses * 2.6}deg`,
    '--period': `${2.4 - misses * 0.17}s`,
  } as CSSProperties;

  const notches = Array.from({ length: MAX_MISSES }, (_, i) => {
    const angle = ((i - (MAX_MISSES - 1) / 2) * 9 * Math.PI) / 180;
    return { x: 100 + Math.sin(angle) * 172, y: 18 + Math.cos(angle) * 172, burnt: i < misses };
  });

  return (
    <svg viewBox="-8 0 216 215" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="bob-glow">
          <stop offset="0" stopColor={tense ? '#FF8B38' : '#7949FF'} stopOpacity="0.6" />
          <stop offset="1" stopColor={tense ? '#FF8B38' : '#7949FF'} stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M58 18h84" stroke="#F5F7FF" strokeWidth="3" />
      <path d="M92 18l8-9 8 9z" fill="#F5F7FF" />
      {notches.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r="3" fill={n.burnt ? '#FF4D5E' : '#19D8FF'} opacity={n.burnt ? 1 : 0.65} />
      ))}
      <g className="swing" style={style}>
        <path d="M100 18v125" stroke={rodColor} strokeWidth="2" />
        <circle cx="100" cy="160" r="38" fill="url(#bob-glow)" />
        <path d="M100 136l22 24-22 24-22-24z" fill="#11182A" stroke={rodColor} strokeWidth="2.5" strokeLinejoin="round" />
        <text x="100" y="169" textAnchor="middle" fontFamily="Russo One, sans-serif" fontSize="24" fill="#F5F7FF">
          ?
        </text>
      </g>
    </svg>
  );
}
