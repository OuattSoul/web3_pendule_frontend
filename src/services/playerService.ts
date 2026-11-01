import type { GameConfig, GameResult, Player, Transaction, Wallet, WalletReset } from '../types';
import { api } from './api';

export interface PlayerBundle {
  player: Player;
  email: string | null;
  wallet: Wallet;
  transactions: Transaction[];
  results: GameResult[];
  walletReset: WalletReset | null;
  config: GameConfig;
}

export const playerService = {
  getBundle: () => api<PlayerBundle>('me/'),
};
