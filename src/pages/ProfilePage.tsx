import { Swords, Wallet } from 'lucide-react';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Coins } from '../components/common/Coins';
import { PageShell } from '../components/common/PageShell';
import { Stat } from '../components/common/Stat';
import { AccountPanel } from '../components/wallet/AccountPanel';
import { ProtectionPips } from '../components/wallet/ProtectionPips';
import { useGame } from '../store/gameStore';

export function ProfilePage({ playerId }: { playerId?: string }) {
  const me = useGame((s) => s.player)!;
  const opponents = useGame((s) => s.opponents);
  const minBet = useGame((s) => s.config.bets[0]);
  const player = playerId === 'me' || playerId === me.id ? me : opponents.find((o) => o.id === playerId);

  if (!player) {
    return (
      <PageShell title="Profil" back="/leaderboard">
        <p className="text-mute">Ce joueur n'existe pas.</p>
      </PageShell>
    );
  }

  const isMe = player.id === me.id;
  const challengeable = player.isBot && player.balance >= minBet && player.wallet.protected > 0;

  return (
    <PageShell title={isMe ? 'Mon profil' : 'Profil public'} back={isMe ? '/' : '/leaderboard'}>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <section className="hud flex flex-col items-center gap-2 p-6 text-center">
          <Avatar id={player.avatarId} size={96} />
          <h2 className="font-display text-2xl">{player.pseudo}</h2>
          <p className="font-semibold text-cyan">Niveau {player.level}</p>
          <div
            className="h-1.5 w-40 bg-steel"
            role="progressbar"
            aria-label="Progression vers le niveau suivant"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(player.levelProgress * 100)}
          >
            <div className="h-full bg-cyan" style={{ width: `${player.levelProgress * 100}%` }} />
          </div>
          <Coins value={player.balance} className="mt-1 font-display text-xl" size={20} />
        </section>

        <section aria-label="Statistiques" className="grid grid-cols-3 gap-2">
          <Stat label="Duels" value={player.stats.duels} />
          <Stat label="Victoires" value={player.stats.wins} tone="text-win" />
          <Stat label="Défaites" value={player.stats.losses} tone="text-lose" />
          <Stat label="Égalités" value={player.stats.ties} tone="text-cyan" />
          <Stat label="Protégés" value={player.wallet.protected} tone="text-win" />
          <Stat label="Compromis" value={player.wallet.compromised} tone="text-orange" />
        </section>

        <section className="hud flex flex-col items-center gap-2 p-4">
          <p className="label">État du portefeuille</p>
          <ProtectionPips summary={player.wallet} />
          {!isMe && <p className="text-sm text-mute">Les mots d'un joueur ne sont jamais publics.</p>}
        </section>

        {challengeable && (
          <div className="glow-wrap">
            <Button hero to={`/match/${player.id}`} className="w-full">
              <Swords size={22} aria-hidden="true" /> Lancer un défi
            </Button>
          </div>
        )}
        {isMe && (
          <Button to="/wallet">
            <Wallet size={18} aria-hidden="true" /> Mon portefeuille
          </Button>
        )}
        {isMe && <AccountPanel />}
      </div>
    </PageShell>
  );
}
