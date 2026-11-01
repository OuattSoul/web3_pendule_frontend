// Display constants only: the rules themselves run on the server (backend/game/engine).
export const MAX_MISSES = 9;
export const TENSION_MISSES = 7;
export const TURN_MS = 30_000;
export const WALLET_SIZE = 12;
export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export type TimerLevel = 'normal' | 'alert' | 'critical';

export function timerLevel(seconds: number): TimerLevel {
  if (seconds > 10) return 'normal';
  return seconds > 5 ? 'alert' : 'critical';
}

export const secondsLeft = (deadline: number, now: number) =>
  Math.max(0, Math.min(TURN_MS / 1000, Math.ceil((deadline - now) / 1000)));

export const protectionPercent = ({ protected: safe, compromised }: { protected: number; compromised: number }) =>
  Math.round((safe / (safe + compromised)) * 100);
