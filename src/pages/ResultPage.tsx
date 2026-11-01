import { RotateCcw, ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Coins } from '../components/common/Coins';
import { useGame } from '../store/gameStore';
import type { GameResult, Outcome } from '../types';
import { formatCoins, formatPosition, formatSigned } from '../utils/format';

const COPY: Record<Outcome, { title: string; line: string; tone: string; glow: string }> = {
  win: { title: 'Victoire', line: 'Tu as percé son mot et protégé le tien.', tone: 'text-win', glow: 'rgb(52 224 138 / 0.35)' },
  tie: { title: 'Égalité', line: 'Les deux mots tombent. Les mises sont restituées, sans gain.', tone: 'text-cyan', glow: 'rgb(25 216 255 / 0.3)' },
  loss: { title: 'Défaite', line: 'Ton mot est tombé et le pot t\'échappe.', tone: 'text-lose', glow: 'rgb(255 77 94 / 0.3)' },
  double_fail: { title: 'Double échec', line: 'Personne n\'a trouvé : les deux mises sont perdues, mais aucun mot n\'est compromis.', tone: 'text-orange', glow: 'rgb(255 139 56 / 0.3)' },
};

const BURST = Array.from({ length: 20 }, (_, i) => {
  const angle = (i / 20) * Math.PI * 2;
  const reach = 110 + (i % 4) * 45;
  return { x: Math.cos(angle) * reach, y: Math.sin(angle) * reach, rotate: i * 37 };
});

function WinBurst() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-16 z-0" aria-hidden="true">
      {BURST.map((p, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
          animate={{ x: p.x, y: p.y, rotate: p.rotate, opacity: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.15 }}
          className={`absolute block size-3 rotate-45 ${i % 3 ? 'bg-orange' : 'bg-win'}`}
        />
      ))}
    </div>
  );
}

function CrackLines() {
  return (
    <motion.svg
      viewBox="0 0 400 200"
      className="pointer-events-none absolute inset-x-0 top-6 z-0 mx-auto w-full max-w-lg"
      fill="none"
      stroke="#FF4D5E"
      strokeWidth="2"
      aria-hidden="true"
    >
      {['M200 0 180 50 215 90 190 200', 'M180 50 90 40 30 90', 'M215 90 300 70 390 120', 'M190 130 110 160'].map((d) => (
        <motion.path key={d} d={d} initial={{ pathLength: 0, opacity: 0.9 }} animate={{ pathLength: 1, opacity: 0.35 }} transition={{ duration: 0.45 }} />
      ))}
    </motion.svg>
  );
}

function WordFate({ title, position, word, compromised }: { title: string; position: number | null; word: string | null; compromised: boolean }) {
  return (
    <div className={`hud relative overflow-hidden p-4 ${compromised ? 'hud-danger' : 'hud-win'}`}>
      <p className="label">{title}</p>
      <p className="mt-1 font-display text-xl">{word ?? 'Mot toujours secret'}</p>
      <p className="mt-1 text-sm text-snow/85">
        {position === null ? 'Position non révélée' : `Position ${formatPosition(position)} dans le portefeuille`}
      </p>
      <p className={`mt-2 flex items-center gap-1.5 text-sm font-bold ${compromised ? 'text-orange' : 'text-win'}`}>
        {compromised ? <ShieldAlert size={16} aria-hidden="true" /> : <ShieldCheck size={16} aria-hidden="true" />}
        {compromised ? 'COMPROMIS' : 'PROTÉGÉ'}
      </p>
      {compromised && (
        <motion.span
          initial={{ scale: 2.6, opacity: 0, rotate: -24 }}
          animate={{ scale: 1, opacity: 0.28, rotate: -14 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 400, damping: 18 }}
          aria-hidden="true"
          className="absolute -right-2 top-5 border-2 border-lose px-2 py-0.5 font-display text-xl text-lose"
        >
          COMPROMIS
        </motion.span>
      )}
    </div>
  );
}

function Ledger({ result }: { result: GameResult }) {
  const rows: [string, React.ReactNode, string][] = [
    ['Mise engagée', formatCoins(result.stake), 'text-snow'],
    ['Pot total', formatCoins(result.pot), 'text-snow'],
    ['Redistribué vers toi', formatCoins(result.payout), result.payout > 0 ? 'text-win' : 'text-snow'],
    ['Bilan du duel', result.net === 0 ? '0' : formatSigned(result.net), result.net > 0 ? 'text-win' : result.net < 0 ? 'text-lose' : 'text-snow'],
  ];
  return (
    <dl className="hud flex flex-col gap-1.5 p-4">
      {rows.map(([label, value, tone]) => (
        <div key={label} className="flex items-center justify-between">
          <dt className="text-sm text-snow/85">{label}</dt>
          <dd className={`font-display tabular-nums ${tone}`}>{value}</dd>
        </div>
      ))}
      <div className="mt-1 flex items-center justify-between border-t border-steel pt-2">
        <dt className="text-sm font-semibold">Nouveau solde</dt>
        <dd className="font-display">
          <Coins value={result.balanceAfter} />
        </dd>
      </div>
    </dl>
  );
}

export function ResultPage({ resultId }: { resultId?: string }) {
  const result = useGame((s) => s.results.find((r) => r.id === resultId));
  if (!result) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4 text-center">
        <p className="text-lg text-mute">Ce résultat n'existe pas.</p>
        <Button to="/">Retour à l'accueil</Button>
      </div>
    );
  }
  const copy = COPY[result.outcome];
  const hardFall = result.outcome === 'loss' || result.outcome === 'double_fail';

  return (
    <motion.main
      animate={hardFall ? { x: [0, -10, 10, -6, 6, 0] } : undefined}
      transition={{ duration: 0.4 }}
      className="relative mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center gap-4 overflow-hidden px-4 py-6"
      style={{ background: `radial-gradient(70% 35% at 50% 8%, ${copy.glow}, transparent 75%)` }}
    >
      {result.outcome === 'win' && <WinBurst />}
      {hardFall && <CrackLines />}

      <header className="relative z-10 text-center">
        <motion.h1
          initial={{ scale: 2.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 20 }}
          className={`font-display text-5xl uppercase sm:text-7xl ${copy.tone}`}
        >
          {copy.title}
        </motion.h1>
        <p className="mt-2 text-lg font-medium">{copy.line}</p>
        <p className="mt-2 flex items-center justify-center gap-2 text-sm text-snow/85">
          contre <Avatar id={result.opponentAvatarId} size={24} /> <strong>{result.opponentPseudo}</strong> · +{result.xpGained} XP
        </p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 grid gap-3 sm:grid-cols-2"
      >
        <WordFate
          title={`Mot de ${result.opponentPseudo}`}
          position={result.opponentPosition}
          word={result.opponentWord}
          compromised={result.opponentPosition !== null}
        />
        <WordFate
          title="Ton mot"
          position={result.yourPosition}
          word={result.yourWordCompromised ? result.yourWord : 'Mot toujours secret'}
          compromised={result.yourWordCompromised}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="relative z-10">
        <Ledger result={result} />
      </motion.div>

      <div className="relative z-10 flex flex-col gap-2 sm:flex-row">
        <Button to="/match" className="flex-1">
          <RotateCcw size={18} aria-hidden="true" /> Rejouer
        </Button>
        <Button variant="ghost" to="/" className="flex-1">
          Retour à l'accueil
        </Button>
      </div>
    </motion.main>
  );
}
