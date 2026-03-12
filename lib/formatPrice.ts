/**
 * Format microcredits for display.
 * 1 credit = 1,000,000 microcredits on Aleo.
 */
export function formatPrice(microcredits: string): string {
  const n = parseInt(microcredits, 10);
  if (isNaN(n) || n < 0) return "0 credits";
  if (n >= 1_000_000) {
    const credits = n / 1_000_000;
    return credits % 1 === 0 ? `${credits} credits` : `${credits.toFixed(2)} credits`;
  }
  return `${n.toLocaleString()} microcredits`;
}
