import { useEffect, useState } from 'react';
import { secondsLeft } from '../engine/rules';

/** Seconds left on a real deadline. Re-renders only the caller, once per second. */
export function useCountdown(deadline: number): number {
  const [seconds, setSeconds] = useState(() => secondsLeft(deadline, Date.now()));
  useEffect(() => {
    const update = () => setSeconds(secondsLeft(deadline, Date.now()));
    update();
    const id = setInterval(update, 200);
    return () => clearInterval(id);
  }, [deadline]);
  return seconds;
}
