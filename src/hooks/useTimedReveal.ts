import { useEffect, useState } from 'react';

const REVEAL_SECONDS = 15;

/** Two-step reveal that hides itself again: asks for confirmation, then counts down. */
export function useTimedReveal() {
  const [confirming, setConfirming] = useState(false);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    if (left <= 0) return;
    const id = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);

  return {
    confirming,
    secondsLeft: left,
    revealed: left > 0,
    ask: () => setConfirming(true),
    cancel: () => setConfirming(false),
    confirm: () => {
      setConfirming(false);
      setLeft(REVEAL_SECONDS);
    },
    hide: () => setLeft(0),
  };
}
