import { api, clearToken, setToken } from './api';

export const authService = {
  signup: (pseudo: string, email: string, password: string) => api('auth/signup/', { pseudo, email, password }),
  sendLink: (email: string) => api('auth/send-link/', { email }),
  /** Exchanges the link from the email for a session. */
  async consumeLink(uid: string, token: string): Promise<void> {
    const session = await api<{ token: string }>('auth/link/', { uid, token });
    setToken(session.token);
  },
  // Changing account reloads the page: socket, store and screens all restart on the new identity.
  async login(identifier: string, password: string): Promise<void> {
    const session = await api<{ token: string }>('auth/login/', { identifier, password });
    setToken(session.token);
    window.location.reload();
  },
  async logout(): Promise<void> {
    await api('auth/logout/', {});
    clearToken();
    window.location.reload();
  },
};
