import { create } from 'zustand';
import { ApiError, clearToken, getToken } from '../services/api';
import { authService } from '../services/authService';
import { INITIAL_ONLINE, duelService, type OnlineState } from '../services/duelService';
import { leaderboardService } from '../services/leaderboardService';
import { playerService } from '../services/playerService';
import { walletService } from '../services/walletService';
import type { Duel, GameConfig, GameResult, Player, Transaction, Wallet, WalletReset } from '../types';

const BOOT_RETRY_MS = 5000;
const LOGIN_LINK = /^#\/login\/([^/]+)\/([^/]+)$/;

interface GameState {
  ready: boolean;
  bootFailed: boolean;
  needsAuth: boolean;
  authNotice: string | null;
  player: Player | null;
  email: string | null;
  wallet: Wallet | null;
  config: GameConfig;
  opponents: Player[];
  transactions: Transaction[];
  results: GameResult[];
  duel: Duel | null;
  walletReset: WalletReset | null;
  online: OnlineState;
  init(): Promise<void>;
  refresh(): Promise<void>;
  acknowledgeReset(): Promise<void>;
}

export const useGame = create<GameState>((set, get) => {
  const load = async () => {
    const [bundle, opponents] = await Promise.all([playerService.getBundle(), leaderboardService.list()]);
    set({ ...bundle, opponents });
  };

  /** Opened from the email: spends the link, then cleans it from the address bar and the history. */
  const consumeLoginLink = async () => {
    const link = window.location.hash.match(LOGIN_LINK);
    if (!link) return;
    try {
      await authService.consumeLink(link[1], link[2]);
    } catch (error) {
      if (!(error instanceof ApiError) || error.status >= 500) throw error; // server asleep: keep the link and retry
      set({ authNotice: error.message });
    }
    window.history.replaceState(null, '', '#/');
  };

  const boot = async (): Promise<void> => {
    try {
      await consumeLoginLink();
      if (!getToken()) {
        set({ needsAuth: true, bootFailed: false });
        return;
      }
      await load();
      set({ ready: true, bootFailed: false });
      duelService.connect();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearToken(); // session ended elsewhere: back to the login screen
        set({ needsAuth: true, bootFailed: false });
        return;
      }
      set({ bootFailed: true });
      setTimeout(boot, BOOT_RETRY_MS);
    }
  };

  return {
    ready: false,
    bootFailed: false,
    needsAuth: false,
    authNotice: null,
    player: null,
    email: null,
    wallet: null,
    config: { bets: [], startingBalance: 0 },
    opponents: [],
    transactions: [],
    results: [],
    duel: null,
    walletReset: null,
    online: INITIAL_ONLINE,

    async init() {
      // A link pasted into an open tab changes only the hash: reload so it is handled like a fresh visit.
      window.addEventListener('hashchange', () => {
        if (LOGIN_LINK.test(window.location.hash)) window.location.reload();
      });
      duelService.subscribe((online, duel, result) => {
        const previous = get().duel;
        set(duel === undefined ? { online } : { online, duel });
        if (result) set({ results: [result, ...get().results] });
        // Coins and words only move when a duel starts or ends, not on every letter.
        if (result || (duel !== undefined && duel?.id !== previous?.id)) get().refresh();
      });
      await boot();
    },

    async refresh() {
      try {
        await load();
      } catch {
        // Temporary loss of the server: the screens keep their last known data.
      }
    },

    async acknowledgeReset() {
      set({ walletReset: null });
      await walletService.acknowledgeReset();
    },
  };
});
