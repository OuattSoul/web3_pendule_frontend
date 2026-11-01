import { motion } from 'motion/react';
import type { Player } from '../../types';
import { Avatar } from '../common/Avatar';
import { Coins } from '../common/Coins';
import { ProtectionPips } from '../wallet/ProtectionPips';

export function FighterCard({ player, from, tag }: { player: Player; from: 'left' | 'right'; tag: string }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: from === 'left' ? -40 : 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="hud flex min-w-0 flex-1 flex-col items-center gap-2 p-4 text-center"
    >
      <p className="label">{tag}</p>
      <Avatar id={player.avatarId} size={72} />
      <h2 className="w-full truncate font-display text-base sm:text-lg">{player.pseudo}</h2>
      <p className="text-sm font-semibold text-cyan">Niveau {player.level}</p>
      <Coins value={player.balance} className="font-semibold" />
      <ProtectionPips summary={player.wallet} />
      <p className="text-xs text-mute sm:text-sm">
        <span className="text-win">{player.wallet.protected} protégés</span> ·{' '}
        <span className="text-orange">{player.wallet.compromised} compromis</span>
      </p>
    </motion.article>
  );
}
