import type { ReactNode } from 'react';

export function Stat({ label, value, tone = 'text-snow' }: { label: string; value: ReactNode; tone?: string }) {
  return (
    <div className="hud hud-sm min-w-0 px-3 py-2.5">
      <p className="label truncate">{label}</p>
      <p className={`mt-0.5 truncate font-display text-lg tabular-nums sm:text-xl ${tone}`}>{value}</p>
    </div>
  );
}
