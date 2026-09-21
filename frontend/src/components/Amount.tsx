import { Text, type TextProps } from '@mantine/core';
import type { TransactionKind } from '@/api/types';
import { formatMoney } from '@/lib/format';

interface Props extends TextProps {
  amount: number;
  currency: string;
  /** Si se indica, se colorea y se antepone el signo (+/−) */
  type?: TransactionKind;
}

export default function Amount({ amount, currency, type, ...rest }: Props) {
  const sign = type === 'income' ? '+' : type === 'expense' ? '−' : '';
  const color = type === 'income' ? 'teal.7' : type === 'expense' ? 'red.7' : undefined;
  return (
    <Text component="span" c={color} fw={600} className="tabular-nums" {...rest}>
      {sign}
      {formatMoney(Math.abs(amount), currency)}
    </Text>
  );
}
