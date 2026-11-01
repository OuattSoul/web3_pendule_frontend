/** Lit duel ring seen in perspective: sits under the pendulum on the home and search screens. */
export function ArenaFloor({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 120" className={className} aria-hidden="true" fill="none">
      <defs>
        <radialGradient id="floor-light">
          <stop offset="0" stopColor="#7949FF" stopOpacity="0.45" />
          <stop offset="1" stopColor="#7949FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="200" cy="60" rx="198" ry="58" fill="url(#floor-light)" />
      <ellipse cx="200" cy="60" rx="185" ry="50" stroke="#19D8FF" strokeOpacity="0.45" />
      <ellipse cx="200" cy="60" rx="130" ry="34" stroke="#7949FF" strokeOpacity="0.7" strokeWidth="2" />
      <ellipse cx="200" cy="60" rx="62" ry="15" stroke="#FF8B38" strokeOpacity="0.7" />
      <path d="M15 60h370M200 10v100" stroke="#9299AD" strokeOpacity="0.2" />
    </svg>
  );
}
