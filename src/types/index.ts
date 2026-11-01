export type WordStatus = 'protected' | 'compromised';

export interface SecretWord {
  position: number; // 1..12
  word: string;
  status: WordStatus;
}

export interface Wallet {
  id: string;
  ownerId: string;
  generation: number;
  words: SecretWord[];
}

export interface WalletSummary {
  protected: number;
  compromised: number;
}

export interface PlayerStats {
  duels: number;
  wins: number;
  losses: number;
  ties: number;
}

/** Public profile: carries only counts, never words. */
export interface Player {
  id: string;
  pseudo: string;
  avatarId: number;
  xp: number;
  level: number;
  levelProgress: number;
  balance: number;
  isBot: boolean;
  stats: PlayerStats;
  wallet: WalletSummary;
}

export interface Bet {
  amount: number;
  lockedAt: number;
}

export type SideState = 'guessing' | 'found' | 'failed';

/** What the UI may know about one side of a duel. Hidden letters are null, spaces are ' '. */
export interface DuelPlayer {
  playerId: string;
  cells: (string | null)[];
  correct: string[];
  wrong: string[];
  timeouts: number;
  misses: number;
  deadline: number;
  state: SideState;
}

export type DuelStatus = 'active' | 'finished';

export interface Duel {
  id: string;
  status: DuelStatus;
  bet: Bet;
  pot: number;
  startsAt: number;
  opponent: Player;
  you: DuelPlayer;
  them: DuelPlayer;
  resultId: string | null;
}

export type Outcome = 'win' | 'tie' | 'loss' | 'double_fail';

export interface WalletReset {
  lostBalance: number;
  grant: number;
  generation: number;
}

export interface GameResult {
  id: string;
  at: number;
  outcome: Outcome;
  stake: number;
  pot: number;
  payout: number;
  net: number;
  balanceAfter: number;
  opponentId: string;
  opponentPseudo: string;
  opponentAvatarId: number;
  yourPosition: number;
  yourWord: string;
  yourWordCompromised: boolean;
  opponentPosition: number | null; // null while the opponent's word stays protected
  opponentWord: string | null;
  xpGained: number;
  walletWiped: boolean;
}

export type TransactionKind = 'stake' | 'win' | 'refund' | 'wipe' | 'grant';

export interface Transaction {
  id: string;
  at: number;
  kind: TransactionKind;
  amount: number; // signed
  label: string;
}

export interface GameConfig {
  bets: number[];
  startingBalance: number;
}
