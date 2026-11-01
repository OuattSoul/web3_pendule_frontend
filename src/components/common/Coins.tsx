import { formatCoins } from '../../utils/format';

export function CoinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className="shrink-0" aria-hidden="true">
      <path d="M12 1.5 21 6.7v10.6L12 22.5 3 17.3V6.7Z" fill="#FF8B38" />
      <path d="M12 6 16.8 8.8v6.4L12 18l-4.8-2.8V8.800Z" fill="#090B12" />
      <path d="M12 9 14.200 12 12 15 9.800 12Z" fill="#FF8B38" />
    </svg>
  );
}

export function Coins({ value, size, className = '' }: { value: number; size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 tabular-nums ${className}`}>
      <CoinIcon size={size} />
      <span>{formatCoins(value)}</span>
      <span className="sr-only">pièces</span>
    </span>
  );
}
