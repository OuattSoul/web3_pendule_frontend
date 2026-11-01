import { Swords } from 'lucide-react';
import { motion } from 'motion/react';
import { useGame } from '../../store/gameStore';
import type { Player } from '../../types';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { Coins } from '../common/Coins';

const PODIUM = ['text-orange', 'text-snow', 'text-violet-soft'];

export function RankRow({ player, rank }: { player: Player; rank: number }) {
  const isMe = useGame((s) => s.player?.id === player.id);
  const minBet = useGame((s) => s.config.bets[0]);
  const challengeable = player.isBot && player.balance >= minBet && player.wallet.protected > 0;
  const stats: [string, number, string][] = [
    ['Duels', player.stats.duels, 'text-snow'],
    ['Vict.', player.stats.wins, 'text-win'],
    ['Déf.', player.stats.losses, 'text-lose'],
    ['Protégés', player.wallet.protected, 'text-cyan'],
    ['Compromis', player.wallet.compromised, 'text-orange'],
  ];

  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(rank, 10) * 0.03 }}
      className={`hud flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 ${isMe ? 'hud-selected' : ''}`}
    >
      <a href={`#/profile/${player.id}`} className="flex min-w-0 flex-1 items-center gap-3">
        <span className={`w-8 shrink-0 text-center font-display text-2xl ${PODIUM[rank - 1] ?? 'text-mute'}`}>{rank}</span>
        <Avatar id={player.avatarId} size={44} />
        <span className="min-w-0">
          <span className="block truncate font-display">
            {player.pseudo} {isMe && <span className="text-cyan">(toi)</span>}
          </span>
          <span className="flex items-center gap-2 text-sm font-semibold">
            <span className="text-cyan">Niv. {player.level}</span>
            <Coins value={player.balance} size={14} />
          </span>
        </span>
      </a>
      <dl className="grid grid-cols-5 gap-1 text-center sm:w-80 sm:shrink-0">
        {stats.map(([label, value, tone]) => (
          <div key={label} className="min-w-0">
            <dd className={`font-display tabular-nums ${tone}`}>{value}</dd>
            <dt className="truncate text-xs text-mute">{label}</dt>
          </div>
        ))}
      </dl>
      {challengeable && (
        <Button variant="ghost" to={`/match/${player.id}`} className="sm:shrink-0">
          <Swords size={18} aria-hidden="true" /> Défier
        </Button>
      )}
    </motion.li>
  );
}
