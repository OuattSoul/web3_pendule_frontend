import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { useGame } from '../../store/gameStore';
import { Coins } from './Coins';

interface Props {
  title: string;
  back?: string;
  children: ReactNode;
}

export function PageShell({ title, back = '/', children }: Props) {
  const balance = useGame((s) => s.player?.balance ?? 0);
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 pb-8 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <header className="mb-5 flex items-center gap-3">
        <a
          href={`#${back}`}
          aria-label="Retour"
          className="hud hud-sm flex size-11 shrink-0 items-center justify-center text-snow"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </a>
        <h1 className="min-w-0 flex-1 truncate font-display text-xl uppercase tracking-wide sm:text-2xl">{title}</h1>
        <Coins value={balance} className="font-semibold" />
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
