import { motion } from 'motion/react';
import { memo } from 'react';
import { ALPHABET } from '../../engine/rules';

interface Props {
  correct: string[];
  wrong: string[];
  disabled: boolean;
  onGuess: (letter: string) => void;
}

// 7 columns on a phone keeps every key at 44px or more.
export const Keyboard = memo(function Keyboard({ correct, wrong, disabled, onGuess }: Props) {
  return (
    <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-9 lg:grid-cols-13" role="group" aria-label="Clavier de lettres">
      {ALPHABET.map((letter) => {
        const isCorrect = correct.includes(letter);
        const isWrong = wrong.includes(letter);
        const used = isCorrect || isWrong;
        const look = isCorrect
          ? 'bg-win text-ink'
          : isWrong
            ? 'bg-lose/25 text-lose line-through'
            : 'bg-steel text-snow hover:bg-violet active:bg-violet';
        return (
          <motion.button
            key={letter}
            type="button"
            disabled={disabled || used}
            onClick={() => onGuess(letter)}
            whileTap={{ scale: 0.9 }}
            animate={isWrong ? { x: [0, -3, 3, 0] } : isCorrect ? { scale: [1, 1.15, 1] } : undefined}
            transition={{ duration: 0.22 }}
            aria-label={`${letter}${isCorrect ? ', correcte' : isWrong ? ', incorrecte' : ''}`}
            className={`h-11 font-display text-lg transition-colors disabled:cursor-not-allowed sm:h-12 ${look} ${disabled && !used ? 'opacity-50' : ''}`}
          >
            {letter}
          </motion.button>
        );
      })}
    </div>
  );
});
