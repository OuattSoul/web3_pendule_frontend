import { useEffect, useState } from 'react';
import { Button } from '../components/common/Button';
import { navigate } from '../hooks/useRoute';
import { api, clearToken } from '../services/api';
import { duelDebug } from '../services/duelService';
import { useGame } from '../store/gameStore';

/** Dev server only: App.tsx does not load this page in production, and the server refuses these actions there. */
export default function DebugPage() {
  const refresh = useGame((s) => s.refresh);
  const duel = useGame((s) => s.duel);
  const [note, setNote] = useState('');
  const resultId = duel?.resultId ?? null;
  // The store keeps the last finished duel: only a result newer than the click may navigate.
  const [forcedAfter, setForcedAfter] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    if (forcedAfter !== undefined && resultId && resultId !== forcedAfter) navigate(`/result/${resultId}`);
  }, [forcedAfter, resultId]);

  const run = async (label: string, action: () => Promise<unknown>, to?: string) => {
    try {
      await action();
      await refresh();
      setNote(`OK : ${label}`);
      if (to) navigate(to);
    } catch (e) {
      setNote(e instanceof Error ? e.message : String(e));
    }
  };

  const force = (label: string, outcome: string) => ({
    label,
    run: () => {
      setForcedAfter(resultId);
      run(label, () => duelDebug.forceOutcome(outcome));
    },
  });

  const groups: { title: string; actions: { label: string; run: () => void; idleOnly?: boolean }[] }[] = [
    {
      title: 'Partie',
      actions: [
        {
          label: 'Tout réinitialiser',
          run: async () => {
            await api('debug/reset/', {});
            clearToken();
            window.location.hash = '/';
            window.location.reload();
          },
          idleOnly: true,
        },
        { label: 'Nouveau portefeuille', run: () => run('nouveau portefeuille', () => api('debug/new-wallet/', {})), idleOnly: true },
        { label: 'Solde à 5 000', run: () => run('solde remis à 5 000', () => api('debug/coins/', {})), idleOnly: true },
        { label: 'Compromettre les 12 mots', run: () => run('12 mots compromis', () => api('debug/compromise-all/', {})), idleOnly: true },
      ],
    },
    {
      title: 'Résultats (passent par le vrai règlement)',
      actions: [
        force('Simuler une victoire', 'win'),
        force('Simuler une égalité', 'tie'),
        force('Simuler une défaite', 'loss'),
        force('Simuler un double échec', 'double_fail'),
      ],
    },
    {
      title: 'Arène (démarre un duel à la mise minimale si besoin)',
      actions: [
        { label: '8/9 pour moi : encore une erreur', run: () => run('8 tentatives perdues', () => duelDebug.setMisses('you', 8), '/duel') },
        { label: '7/9 pour moi : tension', run: () => run('7 tentatives perdues', () => duelDebug.setMisses('you', 7), '/duel') },
        { label: "8/9 pour l'adversaire", run: () => run('adversaire à 8', () => duelDebug.setMisses('them', 8), '/duel') },
        { label: 'Chrono à 4 s', run: () => run('dépassement dans 4 s', () => duelDebug.expireSoon(4000), '/duel') },
        { label: 'Les deux joueurs automatiques', run: () => run('autoplay', () => duelDebug.startAutoplay(), '/duel') },
      ],
    },
  ];

  const inDuel = duel?.status === 'active';
  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-5 p-4">
      <h1 className="font-display text-2xl text-orange">MODE DEBUG</h1>
      <p className="text-sm text-snow/85">
        {inDuel ? 'Un duel est en cours.' : 'Aucun duel en cours.'} {note}
      </p>
      {groups.map((group) => (
        <section key={group.title} className="flex flex-col gap-2">
          <h2 className="label">{group.title}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {group.actions.map((action) => (
              <Button key={action.label} variant="ghost" onClick={action.run} disabled={action.idleOnly && inDuel}>
                {action.label}
              </Button>
            ))}
          </div>
        </section>
      ))}
      <Button variant="ghost" to={inDuel ? '/duel' : '/'}>
        Quitter le debug
      </Button>
    </div>
  );
}
