import { useGame } from '../../store/gameStore';
import { formatCoins } from '../../utils/format';
import { CoinIcon } from '../common/Coins';

interface Props {
  balances: number[];
  value: number | null;
  onChange: (stake: number) => void;
}

export function BetPicker({ balances, value, onChange }: Props) {
  const bets = useGame((s) => s.config.bets);
  return (
    <div className="grid grid-cols-4 gap-2">
      {bets.map((amount) => {
        const affordable = balances.every((balance) => balance >= amount);
        return (
          <button
            key={amount}
            type="button"
            disabled={!affordable}
            aria-pressed={value === amount}
            onClick={() => onChange(amount)}
            className={`hud hud-sm flex min-h-16 flex-col items-center justify-center gap-1 font-display tabular-nums disabled:opacity-40 ${
              value === amount ? 'hud-selected' : ''
            }`}
          >
            <CoinIcon size={16} />
            {formatCoins(amount)}
            <span className="sr-only">pièces{affordable ? '' : ', solde insuffisant'}</span>
          </button>
        );
      })}
    </div>
  );
}
