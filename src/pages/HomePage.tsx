import { History, Swords, Trophy, UserRound, Wallet } from 'lucide-react';
import { motion } from 'motion/react';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Coins } from '../components/common/Coins';
import { ArenaFloor } from '../components/gaming/ArenaFloor';
import { Pendulum } from '../components/gaming/Pendulum';
import { WALLET_SIZE } from '../engine/rules';
import { useGame } from '../store/gameStore';

const LINKS = [
  { to: '/wallet', label: 'Portefeuille', Icon: Wallet },
  { to: '/history', label: 'Historique', Icon: History },
  { to: '/leaderboard', label: 'Classement', Icon: Trophy },
  { to: '/profile/me', label: 'Profil', Icon: UserRound },
];

export function HomePage() {
  const player = useGame((s) => s.player)!;
  const safe = player.wallet.protected;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]">
      <header className="flex items-center gap-3">
        <a href="#/profile/me" aria-label="Mon profil" className="flex min-w-0 flex-1 items-center gap-2">
          <Avatar id={player.avatarId} size={44} />
          <span className="min-w-0">
            <span className="block truncate font-display text-sm">{player.pseudo}</span>
            <span className="text-xs font-semibold text-cyan">Niveau {player.level}</span>
          </span>
        </a>
        <div className="text-right">
          <Coins value={player.balance} className="font-display" />
          <p className={`text-xs font-semibold ${safe <= 3 ? 'text-orange' : 'text-mute'}`}>
            Mots secrets {safe}/{WALLET_SIZE}
          </p>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-4 py-4 text-center lg:gap-6">
        <div className="relative flex w-full max-w-md flex-col items-center">
          <Pendulum className="relative z-10 h-[34dvh] max-h-96 min-h-44" />
          <ArenaFloor className="-mt-[5dvh] w-full" />
        </div>
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl uppercase leading-none tracking-wide sm:text-6xl"
          >
            Le Pendule
            <span className="mt-1 block text-2xl text-cyan sm:text-4xl">du Web3</span>
          </motion.h1>
          <p className="mt-3 text-lg font-medium text-snow/85">Devine. Défie. Protège ton portefeuille.</p>
        </div>
        <div className="glow-wrap">
          <Button hero to="/match">
            <Swords size={24} aria-hidden="true" /> Jouer
          </Button>
        </div>
      </main>

      <nav aria-label="Menu" className="grid grid-cols-4 gap-2 lg:mx-auto lg:w-full lg:max-w-2xl">
        {LINKS.map(({ to, label, Icon }) => (
          <a key={to} href={`#${to}`} className="hud hud-sm flex min-h-16 flex-col items-center justify-center gap-1 px-1 py-2 transition-[filter] hover:brightness-125">
            <Icon size={20} className="text-cyan" aria-hidden="true" />
            <span className="max-w-full truncate text-xs font-semibold">{label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
