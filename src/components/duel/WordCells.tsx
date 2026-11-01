import { AnimatePresence, motion } from 'motion/react';

const GAP = 4;

/** One box per letter. Cell size is derived from the longest word, so nothing overflows on any screen. */
export function WordCells({ cells, large = false }: { cells: (string | null)[]; large?: boolean }) {
  const words: { char: string | null; index: number }[][] = [[]];
  cells.forEach((char, index) => {
    if (char === ' ') words.push([]);
    else words[words.length - 1].push({ char, index });
  });
  const longest = Math.max(...words.map((w) => w.length));
  const width = `min(var(--max-cell), calc((100cqw - ${(longest - 1) * GAP}px) / ${longest}))`;
  const spoken = cells.map((c) => (c === ' ' ? 'espace' : (c ?? 'vide'))).join(', ');

  return (
    <div
      className={`@container w-full ${large ? '[--max-cell:2.75rem]' : '[--max-cell:2rem]'} lg:[--max-cell:4rem]`}
      role="img"
      aria-label={`Mot : ${spoken}`}
    >
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {words.map((word, w) => (
          <div key={w} className="flex" style={{ gap: GAP }}>
            {word.map(({ char, index }) => (
              <div
                key={index}
                style={{ width, aspectRatio: '4 / 5', perspective: 300, containerType: 'inline-size' }}
                className={`relative flex items-center justify-center border-b-2 ${
                  char ? 'border-win bg-win/15' : 'border-mute/60 bg-steel/80'
                }`}
              >
                <AnimatePresence initial={false}>
                  {char && (
                    <motion.span
                      initial={{ rotateX: -90, opacity: 0 }}
                      animate={{ rotateX: 0, opacity: 1 }}
                      transition={{ duration: 0.28, ease: 'easeOut', delay: (index % 8) * 0.03 }}
                      className="font-display leading-none text-win"
                      style={{ fontSize: '62cqw' }}
                    >
                      {char}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
