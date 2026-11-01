import { PageShell } from '../components/common/PageShell';
import { Coins } from '../components/common/Coins';
import { Stat } from '../components/common/Stat';
import { RevealControl } from '../components/wallet/RevealControl';
import { WordSlot } from '../components/wallet/WordSlot';
import { protectionPercent } from '../engine/rules';
import { useTimedReveal } from '../hooks/useTimedReveal';
import { useGame } from '../store/gameStore';
import { formatDate, formatSigned } from '../utils/format';

export function WalletPage() {
  const player = useGame((s) => s.player)!;
  const wallet = useGame((s) => s.wallet)!;
  const transactions = useGame((s) => s.transactions);
  const reveal = useTimedReveal();
  const percent = protectionPercent(player.wallet);

  return (
    <PageShell title="Mon portefeuille">
      <section aria-label="Bilan" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Protégés" value={player.wallet.protected} tone="text-win" />
        <Stat label="Compromis" value={player.wallet.compromised} tone="text-orange" />
        <Stat label="Protection" value={`${percent} %`} tone={percent <= 25 ? 'text-orange' : 'text-cyan'} />
        <Stat label="Solde" value={<Coins value={player.balance} />} />
      </section>

      <section aria-label="Seed Phrase" className="mt-6 flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-lg uppercase">Seed Phrase</h2>
          <p className="label">Portefeuille n°{wallet.generation}</p>
        </div>
        <RevealControl reveal={reveal} />
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {wallet.words.map((word) => (
            <WordSlot key={word.position} word={word} revealed={reveal.revealed} />
          ))}
        </div>
      </section>

      <section aria-label="Historique des gains et pertes" className="mt-8">
        <h2 className="mb-3 font-display text-lg uppercase">Gains et pertes</h2>
        <ul className="flex flex-col gap-1">
          {transactions.map((tx) => (
            <li key={tx.id} className="flex items-center justify-between gap-3 border-b border-steel py-2.5">
              <span className="min-w-0">
                <span className="block truncate font-medium">{tx.label}</span>
                <span className="text-xs text-mute">{formatDate(tx.at)}</span>
              </span>
              <span className={`shrink-0 font-display tabular-nums ${tx.amount >= 0 ? 'text-win' : 'text-lose'}`}>
                {formatSigned(tx.amount)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
