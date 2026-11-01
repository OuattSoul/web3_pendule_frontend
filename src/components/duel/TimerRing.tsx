import { Check, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useCountdown } from '../../hooks/useCountdown';
import { TURN_MS, timerLevel } from '../../engine/rules';
import type { SideState } from '../../types';

const LEVEL_COLOR = { normal: '#19D8FF', alert: '#FF8B38', critical: '#FF4D5E' };
const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function TimerRing({ deadline, state }: { deadline: number; state: SideState }) {
  const seconds = useCountdown(deadline);
  const level = timerLevel(seconds);
  const color = LEVEL_COLOR[level];
  const done = state !== 'guessing';

  return (
    <div className="relative size-22 lg:size-36" role="timer" aria-label={done ? 'Tour terminé' : `${seconds} secondes restantes`}>
      <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={RADIUS} fill="#11182A" stroke="#1B2438" strokeWidth="7" />
        {!done && (
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - seconds / (TURN_MS / 1000))}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 200ms' }}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {done ? (
          state === 'found' ? (
            <Check className="size-9 text-win lg:size-14" aria-hidden="true" />
          ) : (
            <X className="size-9 text-lose lg:size-14" aria-hidden="true" />
          )
        ) : (
          <motion.span
            key={seconds}
            initial={level === 'critical' ? { scale: 1.35 } : false}
            animate={{ scale: 1 }}
            transition={{ duration: 0.25 }}
            className="font-display text-3xl tabular-nums lg:text-5xl"
            style={{ color: level === 'normal' ? '#F5F7FF' : color }}
          >
            {seconds}
          </motion.span>
        )}
      </div>
      <span className="sr-only" aria-live="polite">
        {!done && (seconds === 10 || seconds === 5) ? `Plus que ${seconds} secondes` : ''}
      </span>
    </div>
  );
}
