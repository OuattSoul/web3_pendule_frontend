import { useEffect } from 'react';
import { PageShell } from '../components/common/PageShell';
import { SetupForm } from '../components/duel/SetupForm';
import { navigate } from '../hooks/useRoute';
import { duelService } from '../services/duelService';
import { useGame } from '../store/gameStore';
import { formatCoins } from '../utils/format';

export function SetupPage({ opponentId }: { opponentId?: string }) {
  const balance = useGame((s) => s.player!.balance);
  const opponent = useGame((s) => s.opponents.find((o) => o.id === opponentId && o.isBot));

  useEffect(() => {
    if (!opponent) navigate('/match', true);
  }, [opponent]);
  if (!opponent) return null;

  return (
    <PageShell title="Préparation" back={`/match/${opponent.id}`}>
      <SetupForm
        opponent={opponent}
        intro={
          <>
            <strong className="font-display font-normal text-snow">{opponent.pseudo}</strong> verrouillera
            automatiquement l'un de ses mots protégés au lancement.
          </>
        }
        stakeNote={`Mises désactivées : non finançables par toi (${formatCoins(balance)}) ou par ${opponent.pseudo} (${formatCoins(opponent.balance)}).`}
        onLock={(position, stake) => duelService.startAgainstBot(opponent.id, position, stake)}
      />
    </PageShell>
  );
}
