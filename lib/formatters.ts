export function formatCurrency(amount: number, currencyCode: string): string {
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedAmount = formatter.format(Math.abs(amount));
  return `${formattedAmount} ${currencyCode}`.trim();
}
