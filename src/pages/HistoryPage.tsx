import { ChevronRight } from 'lucide-react';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { PageShell } from '../components/common/PageShell';
import { useGame } from '../store/gameStore';
import { formatDate, formatSigned } from '../utils/format';
import type { Outcome } from '../types';

export const OUTCOME_LABEL: Record<Outcome, { text: string; tone: string }> = {
  win: { text: 'Victoire', tone: 'text-win' },
  tie: { text: 'Égalité', tone: 'text-cyan' },
  loss: { text: 'Défaite', tone: 'text-lose' },
  double_fail: { text: 'Double échec', tone: 'text-orange' },
};

export function HistoryPage() {
  const results = useGame((s) => s.results);
  return (
    <PageShell title="Historique">
      {results.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <p className="text-lg text-mute">Aucun duel joué pour l'instant.</p>
          <Button to="/match">Lancer un premier duel</Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {results.map((r) => {
            const label = OUTCOME_LABEL[r.outcome];
            return (
              <li key={r.id}>
                <a href={`#/result/${r.id}`} className="hud flex items-center gap-3 p-3 transition-[filter] hover:brightness-125">
                  <Avatar id={r.opponentAvatarId} size={40} />
                  <span className="min-w-0 flex-1">
                    <span className={`block font-display ${label.tone}`}>{label.text}</span>
                    <span className="block truncate text-sm text-mute">
                      {r.opponentPseudo} · {formatDate(r.at)}
                    </span>
                  </span>
                  <span className={`font-display tabular-nums ${r.net > 0 ? 'text-win' : r.net < 0 ? 'text-lose' : 'text-snow'}`}>
                    {r.net === 0 ? '0' : formatSigned(r.net)}
                  </span>
                  <ChevronRight size={18} className="text-mute" aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </PageShell>
  );
}
