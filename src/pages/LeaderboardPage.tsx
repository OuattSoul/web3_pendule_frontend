import { useEffect } from 'react';
import { PageShell } from '../components/common/PageShell';
import { RankRow } from '../components/leaderboard/RankRow';
import { useGame } from '../store/gameStore';

export function LeaderboardPage() {
  const player = useGame((s) => s.player)!;
  const opponents = useGame((s) => s.opponents);
  const refresh = useGame((s) => s.refresh);
  const ranked = opponents.map((p) => (p.id === player.id ? player : p)).sort((a, b) => b.balance - a.balance);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <PageShell title="Classement">
      <ol className="flex flex-col gap-2">
        {ranked.map((p, i) => (
          <RankRow key={p.id} player={p} rank={i + 1} />
        ))}
      </ol>
    </PageShell>
  );
}
