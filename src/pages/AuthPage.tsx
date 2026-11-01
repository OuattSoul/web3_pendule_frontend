import { MailCheck } from 'lucide-react';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Button } from '../components/common/Button';
import { ArenaFloor } from '../components/gaming/ArenaFloor';
import { Pendulum } from '../components/gaming/Pendulum';
import { ApiError } from '../services/api';
import { authService } from '../services/authService';
import { useGame } from '../store/gameStore';

type Mode = 'signup' | 'login' | 'link' | 'sent';

const RESEND_COOLDOWN_MS = 60_000;
const fieldClass = 'mt-1 min-h-12 w-full border border-mute/40 bg-ink px-3 text-base font-normal text-snow';

function Field({ label, hint, ...input }: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input className={fieldClass} required {...input} />
      {hint && <span className="mt-1 block text-xs font-normal text-mute">{hint}</span>}
    </label>
  );
}

function SentScreen({ email, onBack }: { email: string | null; onBack: () => void }) {
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (!resent) return;
    const id = setTimeout(() => setResent(false), RESEND_COOLDOWN_MS);
    return () => clearTimeout(id);
  }, [resent]);

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <MailCheck size={40} className="text-cyan" aria-hidden="true" />
      <h2 className="font-display text-xl uppercase">Vérifie tes emails</h2>
      <p role="status" className="text-sm text-snow/85">
        {email ? (
          <>
            Si cette adresse peut recevoir un lien, il arrive à <strong className="text-snow [overflow-wrap:anywhere]">{email}</strong>.
          </>
        ) : (
          'Ton lien de connexion arrive sur ton adresse email.'
        )}{' '}
        Il est valable 1 heure et ne sert qu'une fois. Pense à regarder dans les indésirables.
      </p>
      {email && (
        <Button
          variant="ghost"
          disabled={resent}
          onClick={() => {
            setResent(true);
            authService.sendLink(email).catch(() => setResent(false));
          }}
        >
          {resent ? 'Lien renvoyé' : 'Renvoyer le lien'}
        </Button>
      )}
      <button type="button" onClick={onBack} className="min-h-11 text-sm font-semibold text-cyan underline">
        Retour à la connexion
      </button>
    </div>
  );
}

function ModeTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-12 flex-1 border-b-2 font-display text-sm uppercase ${active ? 'border-cyan text-snow' : 'border-steel text-mute'}`}
    >
      {children}
    </button>
  );
}

/** Nothing in the game opens without an account. */
export function AuthPage() {
  const notice = useGame((s) => s.authNotice);
  const [mode, setMode] = useState<Mode>(notice ? 'link' : 'signup'); // a spent link: straight to asking for a new one
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(notice);
  const [busy, setBusy] = useState(false);

  const switchTo = (next: Mode) => {
    setMode(next);
    setError(null);
  };

  const showSent = (address: string | null) => {
    setSentTo(address);
    setPassword('');
    switchTo('sent');
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === 'signup') {
        await authService.signup(pseudo, email, password);
        showSent(email);
      } else if (mode === 'link') {
        await authService.sendLink(email);
        showSent(email);
      } else {
        await authService.login(identifier, password);
      }
    } catch (e) {
      if (e instanceof ApiError && e.code === 'unverified') showSent(null);
      else setError(e instanceof TypeError ? 'Serveur injoignable, réessaie dans un instant.' : (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]">
      <header className="flex flex-col items-center text-center">
        <Pendulum className="relative z-10 h-[16dvh] min-h-24" />
        <ArenaFloor className="-mt-[3dvh] w-48" />
        <h1 className="mt-1 font-display text-3xl uppercase leading-none">
          Le Pendule <span className="text-cyan">du Web3</span>
        </h1>
        <p className="mt-2 text-sm font-medium text-snow/85">Devine. Défie. Protège ton portefeuille.</p>
      </header>

      <main className="hud mt-4 flex flex-col gap-4 p-4">
        {mode === 'sent' ? (
          <SentScreen email={sentTo} onBack={() => switchTo('login')} />
        ) : (
          <>
            {mode === 'link' ? (
              <div>
                <h2 className="font-display uppercase">Recevoir un lien de connexion</h2>
                <p className="mt-1 text-sm text-snow/85">Mot de passe oublié ou compte à ouvrir : un lien suffit.</p>
              </div>
            ) : (
              <div className="flex">
                <ModeTab active={mode === 'signup'} onClick={() => switchTo('signup')}>
                  Créer un compte
                </ModeTab>
                <ModeTab active={mode === 'login'} onClick={() => switchTo('login')}>
                  Se connecter
                </ModeTab>
              </div>
            )}

            <form onSubmit={submit} className="flex flex-col gap-3">
              {mode === 'signup' && (
                <Field label="Pseudo" value={pseudo} onChange={(e) => setPseudo(e.target.value)} autoComplete="username" minLength={3} maxLength={24} hint="Visible par les autres joueurs." />
              )}
              {mode !== 'login' && (
                <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" hint={mode === 'signup' ? 'Pour recevoir ton lien de connexion. Jamais visible.' : undefined} />
              )}
              {mode === 'login' && (
                <Field label="Pseudo ou email" value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete="username" />
              )}
              {mode !== 'link' && (
                <Field
                  label="Mot de passe"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  hint={mode === 'signup' ? '8 caractères minimum, pas uniquement des chiffres.' : undefined}
                />
              )}
              {error && (
                <p role="alert" className="text-sm font-semibold text-lose">
                  {error}
                </p>
              )}
              <div className="glow-wrap">
                <button type="submit" disabled={busy} className="btn btn-primary w-full">
                  {mode === 'signup' ? 'Créer mon compte' : mode === 'login' ? 'Entrer dans l\'arène' : 'Envoyer le lien'}
                </button>
              </div>
            </form>

            {mode === 'login' && (
              <button type="button" onClick={() => switchTo('link')} className="min-h-11 text-sm font-semibold text-cyan underline">
                Mot de passe oublié ? Recevoir un lien
              </button>
            )}
            {mode === 'link' && (
              <button type="button" onClick={() => switchTo('login')} className="min-h-11 text-sm font-semibold text-cyan underline">
                Retour à la connexion
              </button>
            )}
          </>
        )}
      </main>
    </div>
  );
}
