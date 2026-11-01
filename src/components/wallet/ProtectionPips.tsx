import type { WalletSummary } from '../../types';

/** Counts only, so it is safe on public profiles. */
export function ProtectionPips({ summary }: { summary: WalletSummary }) {
  return (
    <div
      className="flex gap-1"
      role="img"
      aria-label={`${summary.protected} mots protégés, ${summary.compromised} compromis`}
    >
      {Array.from({ length: summary.protected + summary.compromised }, (_, i) => (
        <span key={i} className={`h-3 w-1.5 -skew-x-12 ${i < summary.protected ? 'bg-cyan' : 'bg-orange/70'}`} />
      ))}
    </div>
  );
}
