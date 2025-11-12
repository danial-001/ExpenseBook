const DEFAULT_CURRENCY_FORMAT = {
  style: 'currency',
  currency: 'PKR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

export function formatCurrency(value, options = {}) {
  const amount = typeof value === 'number' ? value : Number(value) || 0;
  const formatter = new Intl.NumberFormat('en-PK', {
    ...DEFAULT_CURRENCY_FORMAT,
    ...options,
  });

  return formatter.format(amount);
}

export function formatNumber(value, options = {}) {
  const number = typeof value === 'number' ? value : Number(value) || 0;
  const formatter = new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options,
  });

  return formatter.format(number);
}
