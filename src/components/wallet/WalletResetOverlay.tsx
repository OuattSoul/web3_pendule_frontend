import { Lock, ShieldX } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { WALLET_SIZE } from '../../engine/rules';
import { useGame } from '../../store/gameStore';
import { formatCoins, formatPosition } from '../../utils/format';
import { Button } from '../common/Button';

const SHATTER_MS = 1700;

/** Two beats: the invalidated wallet shatters, then the new one assembles. */
export function WalletResetOverlay({ delayMs }: { delayMs: number }) {
  const reset = useGame((s) => s.walletReset);
  const acknowledge = useGame((s) => s.acknowledgeReset);
  const [visible, setVisible] = useState(false);
  const [rebuilt, setRebuilt] = useState(false);

  useEffect(() => {
    if (!reset) {
      setVisible(false);
      setRebuilt(false);
      return;
    }
    const show = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(show);
  }, [reset, delayMs]);

  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(() => setRebuilt(true), SHATTER_MS);
    return () => clearTimeout(id);
  }, [visible]);

  if (!reset || !visible) return null;

  const slots = Array.from({ length: WALLET_SIZE }, (_, i) => i);
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Portefeuille invalidé"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-5 overflow-hidden bg-ink/95 p-5 text-center"
    >
      <AnimatePresence mode="wait">
        {!rebuilt ? (
          <motion.div key="shatter" exit={{ opacity: 0 }} className="flex flex-col items-center gap-5">
            <ShieldX size={44} className="text-lose" aria-hidden="true" />
            <h2 className="font-display text-2xl text-lose sm:text-4xl">PORTEFEUILLE INVALIDÉ</h2>
            <div className="grid w-full max-w-sm grid-cols-4 gap-2">
              {slots.map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    x: [0, (i % 4 - 1.5) * 90],
                    y: [0, (i % 3 - 1) * 140 + 60],
                    rotate: [0, (i % 2 ? 1 : -1) * (40 + i * 11)],
                    opacity: [1, 1, 0],
                  }}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.03, ease: 'easeIn' }}
                  className="hud hud-danger flex h-12 items-center justify-center font-display text-sm text-orange"
                >
                  {formatPosition(i + 1)}
                </motion.div>
              ))}
            </div>
            <p className="text-lg font-semibold">
              Solde perdu : <span className="text-lose">{formatCoins(reset.lostBalance)} pièces</span>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="rebuild"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex w-full max-w-sm flex-col items-center gap-5"
          >
            <h2 className="font-display text-2xl text-cyan sm:text-3xl">NOUVEAU PORTEFEUILLE</h2>
            <div className="grid w-full grid-cols-4 gap-2">
              {slots.map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 22, delay: i * 0.05 }}
                  className="hud flex h-12 items-center justify-center text-cyan"
                >
                  <Lock size={16} aria-hidden="true" />
                </motion.div>
              ))}
            </div>
            <p className="text-lg font-semibold">
              Génération n°{reset.generation} · 12 mots protégés · <span className="text-win">+{formatCoins(reset.grant)} pièces</span>
            </p>
            <Button autoFocus onClick={acknowledge}>
              Continuer
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
