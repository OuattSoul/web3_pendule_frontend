import { AVATARS } from '../../data/avatars';

export function Avatar({ id, size = 48, className = '' }: { id: number; size?: number; className?: string }) {
  const def = AVATARS[id % AVATARS.length];
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={`shrink-0 ${className}`} aria-hidden="true">
      <path d={def.face} fill="#11182A" stroke={def.color} strokeWidth="2" strokeLinejoin="round" />
      <path d={def.eyes} fill={def.color} />
      <path d={def.mark} fill="none" stroke={def.color} strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />
    </svg>
  );
}
