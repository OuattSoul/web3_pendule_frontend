import { Check, Lock, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import type { SecretWord } from '../../types';
import { formatPosition } from '../../utils/format';

interface Props {
  word: SecretWord;
  revealed: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

export function WordSlot({ word, revealed, selected, onSelect }: Props) {
  const compromised = word.status === 'compromised';
  const stateClass = compromised ? 'hud-danger' : selected ? 'hud-selected' : '';
  const content = (
    <>
      <span className="flex items-center justify-between">
        <span className="font-display text-sm text-mute">{formatPosition(word.position)}</span>
        {compromised ? (
          <ShieldAlert size={16} className="text-orange" aria-hidden="true" />
        ) : selected ? (
          <Check size={16} className="text-cyan" aria-hidden="true" />
        ) : (
          <Lock size={16} className="text-cyan" aria-hidden="true" />
        )}
      </span>
      <span className="flex min-h-10 items-center justify-center text-center font-semibold leading-tight [overflow-wrap:anywhere]">
        {revealed ? (
          <span className={compromised ? 'text-mute line-through' : 'text-snow'}>{word.word}</span>
        ) : (
          <span className="tracking-[0.25em] text-mute" aria-hidden="true">
            ••••
          </span>
        )}
      </span>
      <span className="flex items-center justify-between gap-1">
        <span className={`text-xs font-bold tracking-wide ${compromised ? 'text-orange' : 'text-win'}`}>
          {compromised ? 'COMPROMIS' : 'PROTÉGÉ'}
        </span>
        <span className="flex gap-0.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`h-2.5 w-1 ${compromised ? 'bg-lose/40' : 'bg-win'}`} />
          ))}
        </span>
      </span>
    </>
  );

  const shared = `hud flex min-h-28 flex-col justify-between gap-1 p-2.5 text-left ${stateClass}`;
  if (onSelect && !compromised) {
    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        aria-pressed={!!selected}
        aria-label={`Emplacement ${word.position}${revealed ? `, ${word.word}` : ''}${selected ? ', sélectionné' : ''}`}
        onClick={onSelect}
        className={shared}
      >
        {content}
      </motion.button>
    );
  }
  return (
    <motion.div layout={false} className={`${shared} ${onSelect ? 'opacity-55' : ''}`}>
      {content}
    </motion.div>
  );
}
