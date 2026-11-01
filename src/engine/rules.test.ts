import { describe, expect, it } from 'vitest';
import { TURN_MS, protectionPercent, secondsLeft, timerLevel } from './rules';

describe('display rules', () => {
  it('maps seconds to the three timer states', () => {
    expect([30, 11, 10, 6, 5, 0].map(timerLevel)).toEqual(['normal', 'normal', 'alert', 'alert', 'critical', 'critical']);
  });

  it('clamps the countdown', () => {
    expect(secondsLeft(1000 + TURN_MS, 1000)).toBe(30);
    expect(secondsLeft(1000 + TURN_MS * 2, 1000)).toBe(30); // intro still running
    expect(secondsLeft(1000, 5000)).toBe(0);
  });

  it('computes wallet protection', () => {
    expect(protectionPercent({ protected: 11, compromised: 1 })).toBe(92);
  });
});
