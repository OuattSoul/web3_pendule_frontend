import { lazy, Suspense, useEffect } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { WalletResetOverlay } from './components/wallet/WalletResetOverlay';
import { navigate, useRoute } from './hooks/useRoute';
import { AuthPage } from './pages/AuthPage';
import { DuelPage } from './pages/DuelPage';
import { HistoryPage } from './pages/HistoryPage';
import { HomePage } from './pages/HomePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { MatchmakingPage } from './pages/MatchmakingPage';
import { OnlinePage } from './pages/OnlinePage';
import { ProfilePage } from './pages/ProfilePage';
import { ResultPage } from './pages/ResultPage';
import { SetupPage } from './pages/SetupPage';
import { WalletPage } from './pages/WalletPage';
import { useGame } from './store/gameStore';

// The debug page and its helpers are left out of production builds.
const DebugPage = import.meta.env.DEV ? lazy(() => import('./pages/DebugPage')) : null;

let started = false;

// Route comes as a prop so a page fading out keeps showing itself, not the next page.
function Screen({ segments }: { segments: string[] }) {
  const [root, param] = segments;
  switch (root) {
    case 'wallet':
      return <WalletPage />;
    case 'history':
      return <HistoryPage />;
    case 'match':
      return <MatchmakingPage key={param ?? 'search'} opponentId={param} />;
    case 'setup':
      return <SetupPage opponentId={param} />;
    case 'online':
      return <OnlinePage />;
    case 'duel':
      return <DuelPage />;
    case 'result':
      return <ResultPage key={param} resultId={param} />;
    case 'leaderboard':
      return <LeaderboardPage />;
    case 'profile':
      return <ProfilePage key={param} playerId={param} />;
    case 'debug':
      if (DebugPage) {
        return (
          <Suspense fallback={null}>
            <DebugPage />
          </Suspense>
        );
      }
      return <HomePage />;
    default:
      return <HomePage />;
  }
}

export function App() {
  const ready = useGame((s) => s.ready);
  const bootFailed = useGame((s) => s.bootFailed);
  const needsAuth = useGame((s) => s.needsAuth);
  const duelActive = useGame((s) => s.duel?.status === 'active');
  const matched = useGame((s) => s.online.phase === 'matched' || s.online.phase === 'setup');
  const { path, segments } = useRoute();

  useEffect(() => {
    if (started) return; // StrictMode runs effects twice; the game must boot once
    started = true;
    useGame.getState().init();
  }, []);

  // No escaping a duel: stakes are locked, it runs until both sides are done.
  useEffect(() => {
    if (ready && duelActive && segments[0] !== 'duel' && segments[0] !== 'debug') navigate('/duel', true);
  }, [ready, duelActive, segments]);

  // A real opponent was found: bring the player to the duel card from wherever the search left them.
  useEffect(() => {
    if (matched && segments[0] !== 'online' && segments[0] !== 'debug') navigate('/online', true);
  }, [matched, segments]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  if (needsAuth) {
    return (
      <MotionConfig reducedMotion="user">
        <AuthPage />
      </MotionConfig>
    );
  }

  if (!ready) {
    return bootFailed ? (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="font-display text-2xl uppercase text-orange">Serveur injoignable</h1>
        <p role="status" className="text-snow/85">
          Le serveur démarre peut-être : nouvel essai automatique dans quelques secondes.
        </p>
      </main>
    ) : null;
  }

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={segments[0] ?? 'home'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          transition={{ duration: 0.2 }}
        >
          <Screen segments={segments} />
        </motion.div>
      </AnimatePresence>
      <WalletResetOverlay delayMs={path.startsWith('/result') ? 3500 : 0} />
      {import.meta.env.DEV && segments[0] !== 'debug' && segments[0] !== 'duel' && (
        <a
          href="#/debug"
          aria-label="Mode debug"
          className="fixed left-0 top-1/2 z-50 -translate-y-1/2 bg-steel/90 px-1 py-3 text-xs font-bold text-orange [writing-mode:vertical-rl]"
        >
          DEBUG
        </a>
      )}
    </MotionConfig>
  );
}
