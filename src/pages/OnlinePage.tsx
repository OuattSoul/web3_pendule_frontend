import { Swords } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { Button } from '../components/common/Button';
import { PageShell } from '../components/common/PageShell';
import { SetupForm } from '../components/duel/SetupForm';
import { FighterCard } from '../components/gaming/FighterCard';
import { navigate } from '../hooks/useRoute';
import { duelService } from '../services/duelService';
import { useGame } from '../store/gameStore';
import { formatCoins } from '../utils/format';

/** Duel card and preparation against a real player. The duel itself runs on the shared arena page. */
export function OnlinePage() {
  const player = useGame((s) => s.player)!;
  const online = useGame((s) => s.online);
  const duelActive = useGame((s) => s.duel?.status === 'active');
  const opponent = online.opponent;

  useEffect(() => {
    if (!opponent && !duelActive) navigate('/match', true);
  }, [opponent, duelActive]);
  if (!opponent) return null;

  if (online.phase === 'matched') {
    return (
      <PageShell title="Joueur trouvé" back="/match">
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
            <FighterCard player={opponent} from="right" tag="Joueur réel" />
          </div>
          <p className="text-center font-display text-lg text-cyan">
            Mise {formatCoins(online.stake!)} · Pot {formatCoins(online.stake! * 2)}
          </p>
          <p className="text-center text-sm font-medium text-snow/85" aria-live="polite">
            {online.opponentAccepted ? `${opponent.pseudo} a accepté.` : `${opponent.pseudo} n'a pas encore répondu.`}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <div className="glow-wrap sm:order-2">
              <Button hero disabled={online.youAccepted} onClick={duelService.accept} className="w-full">
                <Swords size={22} aria-hidden="true" /> {online.youAccepted ? 'En attente…' : 'Accepter le duel'}
              </Button>
            </div>
            <Button variant="ghost" onClick={duelService.decline} className="sm:order-1 sm:self-center">
              Refuser
            </Button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Préparation" back="/match">
      <SetupForm
        opponent={opponent}
        intro={
          <>
            Duel contre <strong className="font-display font-normal text-snow">{opponent.pseudo}</strong>.{' '}
            {online.opponentLocked ? 'Son mot est verrouillé.' : 'Choix en cours de son côté.'}
          </>
        }
        fixedStake={online.stake!}
        locked={online.youLocked}
        lockedNote={`En attente de ${opponent.pseudo}…`}
        onLock={(position) => duelService.lock(position)}
      />
    </PageShell>
  );
}
