import { useAnimate } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { TENSION_MISSES } from '../../engine/rules';
import type { DuelPlayer } from '../../types';
import { AttemptPips } from './AttemptPips';
import { WordCells } from './WordCells';

interface Props {
  title: string;
  side: DuelPlayer;
  primary?: boolean;
  thinking?: boolean;
}

export function WordPanel({ title, side, primary, thinking }: Props) {
  const [scope, animate] = useAnimate<HTMLElement>();
  const [timedOut, setTimedOut] = useState(false);
  const previous = useRef(side);

  useEffect(() => {
    const before = previous.current;
    previous.current = side;
    if (side.misses > before.misses) animate(scope.current, { x: [0, -8, 8, -5, 5, 0] }, { duration: 0.32 });
    if (side.timeouts > before.timeouts) {
      setTimedOut(true);
      const id = setTimeout(() => setTimedOut(false), 1600);
      return () => clearTimeout(id);
    }
  }, [side, animate, scope]);

  const edge =
    side.state === 'found' ? 'hud-win' : side.state === 'failed' ? 'hud-danger' : side.misses >= TENSION_MISSES ? 'hud-orange' : '';

  return (
    <section ref={scope} aria-label={title} className={`hud flex flex-col gap-2 p-3 lg:h-full lg:gap-6 lg:p-5 ${edge}`}>
      <div className="flex min-h-5 items-center justify-between gap-2 lg:mb-auto">
        <h2 className="label truncate">{title}</h2>
        {timedOut ? (
          <span className="shrink-0 text-xs font-bold text-orange">TEMPS ÉCOULÉ</span>
        ) : side.state === 'found' ? (
          <span className="shrink-0 text-xs font-bold text-win">TROUVÉ</span>
        ) : side.state === 'failed' ? (
          <span className="shrink-0 text-xs font-bold text-lose">ÉCHEC</span>
        ) : thinking ? (
          <span className="flex shrink-0 gap-1" aria-label="réfléchit">
            <span className="think-dot size-1.5 bg-cyan" />
            <span className="think-dot size-1.5 bg-cyan" />
            <span className="think-dot size-1.5 bg-cyan" />
          </span>
        ) : null}
      </div>
      <WordCells cells={side.cells} large={primary} />
      <div className="lg:mb-auto">
        <AttemptPips misses={side.misses} />
      </div>
    </section>
  );
}
