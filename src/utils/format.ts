const coins = new Intl.NumberFormat('fr-FR');

export const formatCoins = (n: number) => coins.format(n);
export const formatSigned = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${coins.format(Math.abs(n))}`;
export const formatPosition = (p: number) => String(p).padStart(2, '0');
export const formatDate = (t: number) =>
  new Date(t).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
