import type { Duel, GameResult } from '../types';
import type { ClientMessage, LobbyState, ServerMessage } from '../types/online';
import { BACKEND_URL, getToken } from './api';

const RECONNECT_MS = 2000;
const CLOSE_REPLACED = 4002;

export interface OnlineState extends LobbyState {
  connected: boolean;
  replaced: boolean;
}

export const INITIAL_ONLINE: OnlineState = {
  connected: false,
  replaced: false,
  phase: 'idle',
  online: 0,
  stake: null,
  opponent: null,
  youAccepted: false,
  opponentAccepted: false,
  youLocked: false,
  opponentLocked: false,
  notice: null,
};

/** `duel` is undefined when it did not change. */
type Listener = (online: OnlineState, duel: Duel | null | undefined, result?: GameResult) => void;

let socket: WebSocket | null = null;
let lobby = INITIAL_ONLINE;
let duel: Duel | null = null;
let emitted: Duel | null = null;
let waiter: { resolve: () => void; reject: (e: Error) => void } | null = null;
const listeners = new Set<Listener>();

function emit(result?: GameResult): void {
  const changed = duel !== emitted ? duel : undefined;
  emitted = duel;
  for (const listener of listeners) listener(lobby, changed, result);
}

function send(message: ClientMessage): void {
  if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
}

/** Sends and waits for the server's next answer, so a refusal can be shown where the player acted. */
function request(message: ClientMessage): Promise<void> {
  return new Promise((resolve, reject) => {
    if (socket?.readyState !== WebSocket.OPEN) {
      reject(new Error('Connexion au serveur perdue, nouvel essai en cours'));
      return;
    }
    waiter?.resolve();
    waiter = { resolve, reject };
    send(message);
  });
}

function onMessage(message: ServerMessage): void {
  if (message.type === 'replaced') {
    lobby = { ...INITIAL_ONLINE, replaced: true };
    emit();
  } else if (message.type === 'error') {
    if (waiter) waiter.reject(new Error(message.message));
    else lobby = { ...lobby, notice: message.message };
    waiter = null;
    emit();
  } else if (message.type === 'result') {
    if (duel?.id === message.duelId) duel = { ...duel, status: 'finished', resultId: message.result.id };
    emit(message.result);
  } else {
    lobby = { ...message.lobby, connected: true, replaced: false };
    if (message.duel) {
      // Server and browser clocks can differ: deadlines are rebased on arrival.
      const offset = Date.now() - message.serverNow;
      const d = message.duel;
      duel = {
        ...d,
        startsAt: d.startsAt + offset,
        you: { ...d.you, deadline: d.you.deadline + offset },
        them: { ...d.them, deadline: d.them.deadline + offset },
      };
    } else if (duel?.status === 'active') {
      duel = null; // finished while this browser was away: the result is in the history
    }
    waiter?.resolve();
    waiter = null;
    emit();
  }
}

function open(): void {
  const ws = new WebSocket(`${(BACKEND_URL || location.origin).replace(/^http/, 'ws')}/ws/game/`);
  socket = ws;
  ws.onopen = () => send({ type: 'hello', token: getToken() ?? '' });
  ws.onmessage = (event) => onMessage(JSON.parse(String(event.data)) as ServerMessage);
  ws.onclose = (event) => {
    if (event.code === CLOSE_REPLACED || lobby.replaced) return; // reconnecting would kick the other window back
    lobby = { ...INITIAL_ONLINE, notice: lobby.notice };
    waiter?.reject(new Error('Connexion au serveur perdue, nouvel essai en cours'));
    waiter = null;
    emit();
    setTimeout(open, RECONNECT_MS);
  };
}

export const duelService = {
  connect: open,
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  search: (stake: number) => send({ type: 'search', stake }),
  cancel: () => send({ type: 'cancel' }),
  accept: () => send({ type: 'accept' }),
  decline: () => send({ type: 'decline' }),
  lock: (position: number) => request({ type: 'lock', position }),
  startAgainstBot: (opponentId: string, position: number, stake: number) =>
    request({ type: 'start_ai', opponentId, position, stake }),
  guess: (letter: string) => send({ type: 'guess', letter }),
};

// Test tools, reachable only from the dev-only debug page. The server refuses them in production.
export const duelDebug = {
  forceOutcome: (outcome: string) => request({ type: 'debug', action: 'force', outcome }),
  setMisses: (side: 'you' | 'them', misses: number) => request({ type: 'debug', action: 'misses', side, misses }),
  expireSoon: (ms: number) => request({ type: 'debug', action: 'expire', ms }),
  startAutoplay: () => request({ type: 'debug', action: 'autoplay' }),
};
