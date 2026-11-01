import { Swords } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useTimedReveal } from '../../hooks/useTimedReveal';
import { useGame } from '../../store/gameStore';
import type { Player } from '../../types';
import { formatCoins, formatPosition } from '../../utils/format';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { RevealControl } from '../wallet/RevealControl';
import { WordSlot } from '../wallet/WordSlot';
import { BetPicker } from './BetPicker';

interface Props {
  opponent: Player;
  intro: ReactNode;
  /** Online duels: the stake was chosen before the search, so only the word is left to pick. */
  fixedStake?: number;
  stakeNote?: string;
  locked?: boolean;
  lockedNote?: string;
  onLock: (position: number, stake: number) => Promise<void> | void;
}

export function SetupForm({ opponent, intro, fixedStake, stakeNote, locked, lockedNote, onLock }: Props) {
  const player = useGame((s) => s.player)!;
  const wallet = useGame((s) => s.wallet)!;
  const [position, setPosition] = useState<number | null>(null);
  const [chosenStake, setChosenStake] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reveal = useTimedReveal();
  const stake = fixedStake ?? chosenStake;

  const submit = async () => {
    if (position === null || stake === null) return;
    try {
      await onLock(position, stake);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible de lancer le duel');
    }
  };

  const hint = position === null ? 'Choisis le mot que tu exposes.' : stake === null ? 'Choisis ta mise.' : null;

  return (
    <>
      <div className="mb-5 flex items-center gap-3">
        <Avatar id={opponent.avatarId} size={40} />
        <p className="min-w-0 text-sm text-snow/85">{intro}</p>
      </div>

      <section aria-label="Choix du mot" className="flex flex-col gap-3">
        <h2 className="font-display uppercase">{fixedStake ? 'Mot à exposer' : '1. Mot à exposer'}</h2>
        <RevealControl reveal={reveal} />
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {wallet.words.map((word) => (
            <WordSlot
              key={word.position}
              word={word}
              revealed={reveal.revealed}
              selected={position === word.position}
              onSelect={locked ? undefined : () => setPosition(word.position)}
            />
          ))}
        </div>
      </section>

      {!fixedStake && (
        <section aria-label="Choix de la mise" className="mt-6 flex flex-col gap-3">
          <h2 className="font-display uppercase">2. Mise commune</h2>
          <BetPicker balances={[player.balance, opponent.balance]} value={chosenStake} onChange={setChosenStake} />
          <p className="text-sm text-mute">{stakeNote}</p>
        </section>
      )}

      {/* Sticky so the action stays reachable while scrolling the grid on phones. */}
      <div className="sticky bottom-0 mt-6 flex flex-col gap-2 bg-gradient-to-t from-ink via-ink to-transparent pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-5">
        {error && (
          <p role="alert" className="font-semibold text-lose">
            {error}
          </p>
        )}
        <p className="text-center text-sm font-medium text-snow/85" aria-live="polite">
          {locked
            ? lockedNote
            : (hint ?? `Emplacement ${formatPosition(position!)} · Mise ${formatCoins(stake!)} · Pot ${formatCoins(stake! * 2)}`)}
        </p>
        <Button hero disabled={locked || position === null || stake === null} onClick={submit} className="w-full">
          <Swords size={22} aria-hidden="true" /> {locked ? 'Verrouillé' : 'Bloquer et combattre'}
        </Button>
      </div>
    </>
  );
}
