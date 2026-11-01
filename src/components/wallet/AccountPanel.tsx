import { authService } from '../../services/authService';
import { useGame } from '../../store/gameStore';
import { Button } from '../common/Button';

export function AccountPanel() {
  const email = useGame((s) => s.email);
  return (
    <section className="hud flex flex-wrap items-center justify-between gap-3 p-4" aria-label="Compte">
      <p className="min-w-0 text-sm text-snow/85 [overflow-wrap:anywhere]">
        {email ? (
          <>
            Connecté avec <strong className="text-snow">{email}</strong>. Cette adresse n'est visible que par toi.
          </>
        ) : (
          // Accounts from before mandatory sign-up: logging out of one cannot be undone.
          'Ancien compte invité, sans email : une déconnexion le rendrait inaccessible.'
        )}
      </p>
      <Button variant="ghost" onClick={() => authService.logout()}>
        Déconnexion
      </Button>
    </section>
  );
}
