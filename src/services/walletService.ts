import { api } from './api';

export const walletService = {
  acknowledgeReset: () => api('wallet/ack-reset/', {}),
  /** Way out for a player below the lowest stake who still has protected words. */
  abandonWallet: () => api('wallet/abandon/', {}),
};
