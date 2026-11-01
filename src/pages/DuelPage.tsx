import { AnimatePresence } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { DuelIntro } from '../components/duel/DuelIntro';
import { Keyboard } from '../components/duel/Keyboard';
import { PlayerHead } from '../components/duel/PlayerHead';
import { TimerRing } from '../components/duel/TimerRing';
import { WordPanel } from '../components/duel/WordPanel';
import { CoinIcon } from '../components/common/Coins';
import { ArenaFloor } from '../components/gaming/ArenaFloor';
import { Pendulum } from '../components/gaming/Pendulum';
import { MAX_MISSES, TENSION_MISSES } from '../engine/rules';
import { navigate } from '../hooks/useRoute';
import { duelService } from '../services/duelService';
import { useGame } from '../store/gameStore';
import type { Duel } from '../types';
import { formatCoins } from '../utils/format';

const END_PAUSE_MS = 1300;

function statusLine(duel: Duel): string {
  const { you, them, opponent } = duel;
  if (duel.status === 'finished') return 'Duel terminé';
  if (you.state === 'found') return `Mot trouvé ! ${opponent.pseudo} cherche encore le tien.`;
  if (you.state === 'failed') return `Tentatives épuisées. ${opponent.pseudo} joue encore.`;
  if (them.state === 'found') return `${opponent.pseudo} a trouvé ton mot : trouve le sien pour sauver ta mise !`;
  if (them.state === 'failed') return `${opponent.pseudo} a échoué : trouve son mot et rafle le pot !`;
  if (you.misses >= TENSION_MISSES) return `Danger : plus que ${MAX_MISSES - you.misses} tentatives !`;
  return 'Duel en cours : propose une lettre';
}

export function DuelPage() {
  const duel = useGame((s) => s.duel);
  const player = useGame((s) => s.player);
  const online = useGame((s) => s.online);
  const [introDone, setIntroDone] = useState(() => !duel || Date.now() >= duel.startsAt);

  const startsAt = duel?.startsAt;
  useEffect(() => {
    if (!startsAt) return;
    const id = setTimeout(() => setIntroDone(true), Math.max(0, startsAt - Date.now()));
    return () => clearTimeout(id);
  }, [startsAt]);

  const onGuess = useCallback((letter: string) => {
    duelService.guess(letter);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat || e.key.length !== 1) return;
      onGuess(e.key);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onGuess]);

  const resultId = duel?.resultId;
  useEffect(() => {
    if (!resultId) return;
    const id = setTimeout(() => navigate(`/result/${resultId}`, true), END_PAUSE_MS);
    return () => clearTimeout(id);
  }, [resultId]);

  useEffect(() => {
    if (!duel) navigate('/', true);
  }, [duel]);

  if (!duel || !player) return null;
  const { you, them, opponent } = duel;
  const tension = you.state === 'guessing' && you.misses >= TENSION_MISSES;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col gap-2 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] lg:gap-5 lg:px-6 lg:py-6">
      {tension && <div className="tension-vignette" />}
      {!online.connected && (
        <p role="alert" className="bg-orange px-3 py-1.5 text-center text-sm font-bold text-ink">
          Connexion perdue : reconnexion en cours, le chrono continue sur le serveur.
        </p>
      )}

      <main className="grid flex-1 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] content-start items-center gap-x-2 gap-y-2 lg:grid-cols-[minmax(0,1fr)_15rem_minmax(0,1fr)] lg:content-center lg:items-start lg:gap-x-5 lg:gap-y-4">
        <div className="col-start-1 row-start-1 lg:self-center">
          <PlayerHead player={player} />
        </div>

        <div className="col-start-2 row-start-1 flex flex-col items-center lg:row-span-2">
          <TimerRing deadline={you.deadline} state={you.state} />
          <p className="mt-1 flex items-center gap-1 font-display text-sm text-cyan lg:mt-3 lg:text-lg">
            <CoinIcon size={14} /> POT {formatCoins(duel.pot)}
          </p>
          <p className="label hidden lg:block">Mise {formatCoins(duel.bet.amount)} chacun</p>
          <div className="mt-3 hidden w-full flex-col items-center lg:flex">
            <Pendulum misses={you.misses} className="relative z-10 h-52" />
            <ArenaFloor className="-mt-8 w-full" />
          </div>
        </div>

        <div className="col-start-3 row-start-1 lg:self-center">
          <PlayerHead player={opponent} mirrored />
        </div>

        <p
          aria-live="polite"
          className={`col-span-3 row-start-2 text-center text-sm font-semibold lg:hidden ${tension ? 'text-orange' : 'text-snow/85'}`}
        >
          {statusLine(duel)}
        </p>

        <div className="col-span-3 row-start-3 min-w-0 lg:col-span-1 lg:col-start-1 lg:row-start-2 lg:self-stretch">
          <WordPanel title="Mot adverse à découvrir" side={you} primary />
        </div>

        <div className="col-span-3 row-start-4 min-w-0 lg:col-span-1 lg:col-start-3 lg:row-start-2 lg:self-stretch">
          <WordPanel title="L'adversaire cherche ton mot" side={them} thinking={them.state === 'guessing'} />
        </div>
      </main>

      <p className={`hidden text-center font-semibold lg:block ${tension ? 'text-orange' : 'text-snow/85'}`}>
        {statusLine(duel)}
      </p>

      {/* Sticky: long expressions wrap on small phones, the keyboard must stay reachable. */}
      <div className="sticky bottom-0 z-10 mx-auto w-full max-w-4xl bg-ink/90 pb-[env(safe-area-inset-bottom)] pt-1 lg:static lg:bg-transparent">

        <Keyboard
          correct={you.correct}
          wrong={you.wrong}
          disabled={!introDone || !online.connected || you.state !== 'guessing' || duel.status === 'finished'}
          onGuess={onGuess}
        />
      </div>

      <AnimatePresence>{!introDone && <DuelIntro duel={duel} player={player} />}</AnimatePresence>
    </div>
  );
}
