export function formatCurrency(
  amount: number,
  currencyCode: string,
  withCurrency: boolean = true
): string {
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedAmount = formatter.format(Math.abs(amount));
  if (withCurrency) {
    return `${formattedAmount} ${currencyCode}`.trim();
  }
  return formattedAmount;
}
