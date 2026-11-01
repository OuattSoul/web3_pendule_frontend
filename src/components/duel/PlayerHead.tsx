import { Avatar } from '../common/Avatar';
import { Coins } from '../common/Coins';
import type { Player } from '../../types';

export function PlayerHead({ player, mirrored }: { player: Player; mirrored?: boolean }) {
  return (
    <div className={`flex min-w-0 items-center gap-2 lg:gap-3 ${mirrored ? 'flex-row-reverse text-right' : ''}`}>
      <Avatar id={player.avatarId} className="size-9 lg:size-14" />
      <div className="min-w-0">
        <p className="truncate font-display text-xs lg:text-lg">{player.pseudo}</p>
        <p className={`flex items-center gap-1.5 text-xs font-semibold lg:text-sm ${mirrored ? 'justify-end' : ''}`}>
          <span className="hidden text-cyan lg:inline">Niv. {player.level}</span>
          <Coins value={player.balance} size={13} />
        </p>
      </div>
    </div>
  );
}
