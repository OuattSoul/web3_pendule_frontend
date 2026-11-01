import { motion } from 'motion/react';
import { MAX_MISSES, TENSION_MISSES } from '../../engine/rules';

export function AttemptPips({ misses }: { misses: number }) {
  const tense = misses >= TENSION_MISSES;
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex gap-1" aria-hidden="true">
        {Array.from({ length: MAX_MISSES }, (_, i) => {
          const burnt = i < misses;
          return (
            <motion.span
              key={i}
              animate={burnt ? { scale: [1, 1.6, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`block size-2.5 rotate-45 sm:size-3 ${burnt ? 'bg-lose/30 outline outline-1 outline-lose' : tense ? 'bg-orange' : 'bg-cyan'}`}
            />
          );
        })}
      </div>
      <span className={`font-display text-sm tabular-nums ${tense ? 'text-orange' : 'text-snow'}`}>
        {misses}/{MAX_MISSES}
        <span className="sr-only"> mauvaises tentatives</span>
      </span>
    </div>
  );
}
