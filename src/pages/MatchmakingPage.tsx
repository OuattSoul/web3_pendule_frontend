import { Bot, Search, Swords, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { PageShell } from '../components/common/PageShell';
import { BetPicker } from '../components/duel/BetPicker';
import { FighterCard } from '../components/gaming/FighterCard';
import { navigate } from '../hooks/useRoute';
import { leaderboardService } from '../services/leaderboardService';
import { duelService } from '../services/duelService';
import { walletService } from '../services/walletService';
import { useGame } from '../store/gameStore';
import { formatCoins } from '../utils/format';

const AI_SEARCH_MS = 2800;

function Radar({ avatarId }: { avatarId: number }) {
  return (
    <div className="relative mx-auto size-64 sm:size-80" role="status" aria-label="Recherche d'un adversaire en cours">
      <svg viewBox="0 0 200 200" className="absolute inset-0" aria-hidden="true" fill="none">
        <circle cx="100" cy="100" r="96" stroke="#19D8FF" strokeOpacity="0.4" />
        <circle cx="100" cy="100" r="66" stroke="#19D8FF" strokeOpacity="0.3" />
        <circle cx="100" cy="100" r="36" stroke="#7949FF" strokeOpacity="0.7" />
        <path d="M100 4v192M4 100h192" stroke="#9299AD" strokeOpacity="0.2" />
        <g className="radar-sweep" style={{ transformBox: 'view-box' }}>
          <path d="M100 100 100 4A96 96 0 0 1 183 52Z" fill="#19D8FF" fillOpacity="0.25" />
          <path d="M100 100V4" stroke="#19D8FF" strokeWidth="2" />
        </g>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Avatar id={avatarId} size={56} />
      </div>
    </div>
  );
}

function OnlineCount({ count }: { count: number }) {
  return (
    <p className="flex items-center justify-center gap-2 text-sm font-semibold text-snow/85">
      <Users size={16} className="text-cyan" aria-hidden="true" />
      {count} {count > 1 ? 'joueurs en ligne' : 'joueur en ligne'}
    </p>
  );
}

export function MatchmakingPage({ opponentId }: { opponentId?: string }) {
  const player = useGame((s) => s.player)!;
  const opponents = useGame((s) => s.opponents);
  const online = useGame((s) => s.online);
  const refresh = useGame((s) => s.refresh);
  const [aiSearching, setAiSearching] = useState(false);
  const [stake, setStake] = useState<number | null>(null);
  const stakeReady = stake !== null && player.balance >= stake;
  const minBet = useGame((s) => s.config.bets[0]);
  const opponent = opponents.find((o) => o.id === opponentId && o.isBot);
  const searching = online.phase === 'searching';

  // Leaving this screen leaves the queue, so nobody gets matched with an absent player.
  useEffect(() => () => duelService.cancel(), []);

  useEffect(() => {
    if (!aiSearching) return;
    const id = setTimeout(async () => {
      const found = await leaderboardService.findBot(opponentId);
      await refresh();
      navigate(`/match/${found.id}`, true);
    }, AI_SEARCH_MS);
    return () => clearTimeout(id);
  }, [aiSearching, opponentId]);

  const playAi = () => {
    duelService.cancel();
    setAiSearching(true);
  };

  // Below the lowest stake with words left: no duel is possible, so the player needs a way out.
  if (player.balance < minBet) {
    return (
      <PageShell title="Solde insuffisant">
        <div className="hud hud-orange mx-auto flex max-w-md flex-col gap-4 p-6 text-center">
          <p>
            Ton solde ne couvre plus la mise minimale de {minBet} pièces. Abandonne ce portefeuille pour en recevoir un
            nouveau avec 5 000 pièces. Le solde restant sera perdu.
          </p>
          <Button
            variant="danger"
            onClick={async () => {
              await walletService.abandonWallet();
              await refresh();
            }}
          >
            Nouveau portefeuille
          </Button>
        </div>
      </PageShell>
    );
  }

  if (aiSearching) {
    return (
      <PageShell title="Recherche">
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <Radar avatarId={player.avatarId} />
          <p className="font-display text-lg uppercase tracking-wide text-cyan">Recherche d'une IA…</p>
        </div>
      </PageShell>
    );
  }

  if (searching) {
    return (
      <PageShell title="Recherche">
        <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
          <Radar avatarId={player.avatarId} />
          <p className="font-display text-lg uppercase tracking-wide text-cyan">Recherche d'un joueur…</p>
          <p className="font-semibold">Uniquement des joueurs misant {formatCoins(online.stake ?? 0)} pièces</p>
          <OnlineCount count={online.online} />
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="ghost" onClick={duelService.cancel}>
              Annuler
            </Button>
            <Button variant="ghost" onClick={playAi}>
              <Bot size={18} aria-hidden="true" /> Affronter l'IA
            </Button>
          </div>
        </div>
      </PageShell>
    );
  }

  if (opponent) {
    return (
      <PageShell title="Fiche de duel">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6">
          <div className="flex items-stretch gap-2 sm:gap-4">
            <FighterCard player={player} from="left" tag="Toi" />
            <motion.p
              initial={{ scale: 2.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
              className="self-center font-display text-2xl text-orange sm:text-5xl"
            >
              VS
            </motion.p>
            <FighterCard player={opponent} from="right" tag="IA" />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <div className="glow-wrap sm:order-2">
              <Button hero to={`/setup/${opponent.id}`} className="w-full">
                <Swords size={22} aria-hidden="true" /> Accepter le duel
              </Button>
            </div>
            <Button variant="ghost" onClick={() => setAiSearching(true)} className="sm:order-1 sm:self-center">
              Autre adversaire
            </Button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Matchmaking">
      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        {online.notice && (
          <p role="status" className="max-w-sm font-semibold text-orange">
            {online.notice}
          </p>
        )}
        {online.replaced ? (
          <p className="max-w-sm text-lg text-orange">
            Ce profil est ouvert dans une autre fenêtre. Pour jouer à deux, utilise un autre navigateur ou une fenêtre
            privée.
          </p>
        ) : online.connected ? (
          <>
            <p className="max-w-sm text-lg text-snow/85">
              Choisis ta mise : tu n'affronteras que des joueurs qui misent le même montant.
            </p>
            <OnlineCount count={online.online} />
            <div className="w-full max-w-lg">
              <BetPicker balances={[player.balance]} value={stake} onChange={setStake} />
            </div>
          </>
        ) : (
          <p className="max-w-sm text-lg text-orange">Serveur multijoueur injoignable. Tu peux affronter l'IA.</p>
        )}
        <div className="glow-wrap">
          <Button hero disabled={!online.connected || !stakeReady} onClick={() => duelService.search(stake!)}>
            <Search size={22} aria-hidden="true" /> Trouver un adversaire
          </Button>
        </div>
        <Button variant="ghost" onClick={playAi}>
          <Bot size={18} aria-hidden="true" /> Affronter l'IA
        </Button>
      </div>
    </PageShell>
  );
}
