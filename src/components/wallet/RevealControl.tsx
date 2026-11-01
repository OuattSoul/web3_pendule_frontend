import { Eye, EyeOff, TriangleAlert } from 'lucide-react';
import type { useTimedReveal } from '../../hooks/useTimedReveal';
import { Button } from '../common/Button';

export function RevealControl({ reveal }: { reveal: ReturnType<typeof useTimedReveal> }) {
  if (reveal.revealed) {
    return (
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-orange" role="status">
          Mots visibles encore {reveal.secondsLeft} s
        </p>
        <Button variant="ghost" onClick={reveal.hide}>
          <EyeOff size={18} aria-hidden="true" /> Masquer
        </Button>
      </div>
    );
  }
  if (reveal.confirming) {
    return (
      <div className="hud hud-orange flex flex-col gap-3 p-4" role="alertdialog" aria-label="Avertissement de confidentialité">
        <p className="flex gap-2 text-sm">
          <TriangleAlert size={18} className="mt-0.5 shrink-0 text-orange" aria-hidden="true" />
          <span>
            Vérifie que personne ne regarde ton écran. Tes mots resteront visibles 15 secondes. Ce sont des mots de jeu
            fictifs : n'y saisis jamais une vraie phrase de récupération.
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="danger" onClick={reveal.confirm}>
            Je confirme
          </Button>
          <Button variant="ghost" onClick={reveal.cancel}>
            Annuler
          </Button>
        </div>
      </div>
    );
  }
  return (
    <Button variant="ghost" onClick={reveal.ask} className="self-start">
      <Eye size={18} aria-hidden="true" /> Révéler mes mots
    </Button>
  );
}
