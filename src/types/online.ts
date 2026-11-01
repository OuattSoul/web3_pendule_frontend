import type { Duel, GameResult, Player } from './index';

export type LobbyPhase = 'idle' | 'searching' | 'matched' | 'setup';

export interface LobbyState {
  phase: LobbyPhase;
  online: number;
  stake: number | null;
  opponent: Player | null;
  youAccepted: boolean;
  opponentAccepted: boolean;
  youLocked: boolean;
  opponentLocked: boolean;
  notice: string | null;
}

export type ClientMessage =
  | { type: 'hello'; token: string }
  | { type: 'search'; stake: number }
  | { type: 'cancel' }
  | { type: 'accept' }
  | { type: 'decline' }
  | { type: 'lock'; position: number }
  | { type: 'guess'; letter: string }
  | { type: 'start_ai'; opponentId: string; position: number; stake: number }
  | { type: 'debug'; action: string; outcome?: string; side?: string; misses?: number; ms?: number };

export type ServerMessage =
  | { type: 'state'; lobby: LobbyState; duel: Duel | null; serverNow: number }
  | { type: 'result'; duelId: string; result: GameResult }
  | { type: 'error'; message: string }
  | { type: 'replaced' };
