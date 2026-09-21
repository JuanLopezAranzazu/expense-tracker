import dayjs from 'dayjs';

export function formatMoney(amount: number, currency = 'COP') {
  const zeroDecimals = currency === 'COP' || currency === 'CLP';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    minimumFractionDigits: zeroDecimals ? 0 : 2,
    maximumFractionDigits: zeroDecimals ? 0 : 2,
  }).format(amount);
}

/** El backend devuelve ISO con hora; usamos solo YYYY-MM-DD para evitar desfases de zona horaria. */
export const toDay = (iso: string) => dayjs(iso.slice(0, 10));
export const formatDate = (iso: string) => toDay(iso).format('D MMM YYYY');
export const monthKey = (iso: string) => iso.slice(0, 7);
