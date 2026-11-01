import { motion } from 'motion/react';
import type { Duel, Player } from '../../types';
import { formatCoins } from '../../utils/format';
import { Avatar } from '../common/Avatar';

const spring = { type: 'spring', stiffness: 300, damping: 22 } as const;

/** Stakes are locked and the clock has not started: this bridges the menus and the arena. */
export function DuelIntro({ duel, player }: { duel: Duel; player: Player }) {
  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.08 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-6 overflow-hidden bg-ink/95 px-4"
      aria-live="polite"
    >
      <div className="flex w-full max-w-2xl items-center justify-between gap-2">
        <motion.div initial={{ x: -200, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={spring} className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <Avatar id={player.avatarId} className="size-20 sm:size-32" />
          <p className="w-full truncate text-center font-display text-sm sm:text-lg">{player.pseudo}</p>
        </motion.div>
        <motion.p
          initial={{ scale: 3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...spring, delay: 0.35 }}
          className="font-display text-5xl text-orange sm:text-7xl"
        >
          VS
        </motion.p>
        <motion.div initial={{ x: 200, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={spring} className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <Avatar id={duel.opponent.avatarId} className="size-20 sm:size-32" />
          <p className="w-full truncate text-center font-display text-sm sm:text-lg">{duel.opponent.pseudo}</p>
        </motion.div>
      </div>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="text-center">
        <p className="label">Mots verrouillés · mises bloquées</p>
        <p className="mt-1 font-display text-2xl text-cyan sm:text-3xl">POT {formatCoins(duel.pot)}</p>
      </motion.div>
    </motion.div>
  );
}
