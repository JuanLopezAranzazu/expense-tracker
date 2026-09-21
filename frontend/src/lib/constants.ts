import type { TransactionType } from '@/api/types';

export const ACCOUNT_TYPES = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'bank', label: 'Cuenta bancaria' },
  { value: 'savings', label: 'Ahorros' },
  { value: 'credit', label: 'Tarjeta de crédito' },
  { value: 'investment', label: 'Inversión' },
];

export const CURRENCIES = [
  { value: 'COP', label: 'COP · Peso colombiano' },
  { value: 'USD', label: 'USD · Dólar' },
  { value: 'EUR', label: 'EUR · Euro' },
  { value: 'MXN', label: 'MXN · Peso mexicano' },
];

export const accountTypeLabel = (value: string) => ACCOUNT_TYPES.find((t) => t.value === value)?.label ?? value;

export const TYPE_LABEL: Record<TransactionType, string> = {
  income: 'Ingreso',
  expense: 'Gasto',
};

export const TYPE_COLOR: Record<TransactionType, string> = {
  income: 'teal',
  expense: 'red',
};
