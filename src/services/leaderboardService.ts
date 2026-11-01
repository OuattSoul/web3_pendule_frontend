import type { Player } from '../types';
import { api } from './api';

export const leaderboardService = {
  list: async () => (await api<{ players: Player[] }>('leaderboard/')).players,
  findBot: async (excludeId?: string) =>
    (await api<{ player: Player }>(`opponents/random/${excludeId ? `?exclude=${excludeId}` : ''}`)).player,
};
