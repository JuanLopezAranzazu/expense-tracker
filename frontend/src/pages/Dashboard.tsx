import { BarChart, DonutChart } from '@mantine/charts';
import { Card, Divider, Grid, Group, Loader, SegmentedControl, Stack, Table, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Amount from '@/components/Amount';
import EmptyState from '@/components/EmptyState';
import PageHeader from '@/components/PageHeader';
import { useAuth } from '@/auth/AuthContext';
import { useAccounts, useCategories, useTransactions } from '@/hooks/queries';
import { formatDate, formatMoney, monthKey } from '@/lib/format';

const DONUT_COLORS = ['ink.6', 'teal.6', 'orange.6', 'grape.6', 'cyan.6', 'pink.6', 'lime.7', 'yellow.6'];

export default function Dashboard() {
  const { user } = useAuth();
  const { data: accounts = [], isLoading: loadingAcc } = useAccounts();
  const { data: transactions = [], isLoading: loadingTx } = useTransactions();
  const { data: categories = [] } = useCategories();

  // Las cuentas pueden tener monedas distintas: no se suman entre sí.
  const currencies = useMemo(() => Array.from(new Set(accounts.map((a) => a.currency))), [accounts]);
  const [selected, setSelected] = useState<string | null>(null);
  const currency = selected && currencies.includes(selected) ? selected : (currencies[0] ?? 'COP');

  const stats = useMemo(() => {
    const accs = accounts.filter((a) => a.currency === currency);
    const ids = new Set(accs.map((a) => a.id));
    const txs = transactions.filter((t) => ids.has(t.accountId));

    const now = dayjs();
    const thisMonth = now.format('YYYY-MM');

    const sum = (list: typeof txs, type: 'income' | 'expense') =>
      list.filter((t) => t.type === type).reduce((acc, t) => acc + t.amount, 0);

    const monthTxs = txs.filter((t) => monthKey(t.date) === thisMonth);

    // Últimos 6 meses
    const months = Array.from({ length: 6 }, (_, i) => now.subtract(5 - i, 'month'));
    const history = months.map((m) => {
      const key = m.format('YYYY-MM');
      const list = txs.filter((t) => monthKey(t.date) === key);
      return { month: m.format('MMM'), Ingresos: sum(list, 'income'), Gastos: sum(list, 'expense') };
    });

    // Gastos del mes por categoría
    const byCategory = new Map<string, number>();
    monthTxs
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const name = (t.categoryId && categories.find((c) => c.id === t.categoryId)?.name) || 'Sin categoría';
        byCategory.set(name, (byCategory.get(name) ?? 0) + t.amount);
      });
    const donut = Array.from(byCategory.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], i) => ({ name, value, color: DONUT_COLORS[i % DONUT_COLORS.length] }));

    const recent = [...txs]
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
      .slice(0, 6);

    return {
      accs,
      balance: accs.reduce((acc, a) => acc + a.balance, 0),
      income: sum(monthTxs, 'income'),
      expense: sum(monthTxs, 'expense'),
      history,
      donut,
      recent,
    };
  }, [accounts, transactions, categories, currency]);

  if (loadingAcc || loadingTx) {
    return (
      <Group justify="center" py={80}>
        <Loader />
      </Group>
    );
  }

  if (accounts.length === 0) {
    return (
      <>
        <PageHeader title={`Hola, ${user?.name.split(' ')[0]}`} description="Empecemos por lo básico." />
        <Card>
          <EmptyState
            title="Crea tu primera cuenta"
            description="Agrega el efectivo, la cuenta de ahorros o la tarjeta que uses. Con eso ya puedes registrar ingresos y gastos."
          />
          <Group justify="center" pb="md">
            <Text component={Link} to="/cuentas" c="ink" fw={500} size="sm">
              Ir a Cuentas
            </Text>
          </Group>
        </Card>
      </>
    );
  }

  const net = stats.income - stats.expense;
  const monthLabel = dayjs().format('MMMM [de] YYYY');

  return (
    <>
      <PageHeader
        title={`Hola, ${user?.name.split(' ')[0]}`}
        description={`Así va ${monthLabel}.`}
        actions={
          currencies.length > 1 ? (
            <SegmentedControl value={currency} onChange={setSelected} data={currencies} />
          ) : undefined
        }
      />

      {/* Saldo total: la cifra principal de la pantalla */}
      <Card mb="lg" padding="xl">
        <Group justify="space-between" align="center" gap="xl" wrap="wrap">
          <Stack gap={4} justify="center">
            <Text c="dimmed" size="sm">
              Saldo total en {stats.accs.length} {stats.accs.length === 1 ? 'cuenta' : 'cuentas'}
            </Text>
            <Amount
              amount={stats.balance}
              currency={currency}
              fz={{ base: 34, sm: 44 }}
              fw={600}
              c={stats.balance < 0 ? 'red.7' : undefined}
              style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}
            />
          </Stack>

          <Group gap="xl" wrap="wrap" align="stretch">
            <Stack gap={2}>
              <Text c="dimmed" size="sm" className="whitespace-nowrap">
                Ingresos del mes
              </Text>
              <Amount amount={stats.income} currency={currency} size="lg" c="teal.7" />
            </Stack>
            <Divider orientation="vertical" />
            <Stack gap={2}>
              <Text c="dimmed" size="sm" className="whitespace-nowrap">
                Gastos del mes
              </Text>
              <Amount amount={stats.expense} currency={currency} size="lg" c="red.7" />
            </Stack>
            <Divider orientation="vertical" />
            <Stack gap={2}>
              <Text c="dimmed" size="sm" className="whitespace-nowrap">
                Diferencia
              </Text>
              <Amount amount={net} currency={currency} size="lg" c={net < 0 ? 'red.7' : undefined} />
            </Stack>
          </Group>
        </Group>
      </Card>

      <Grid mb="lg">
        <Grid.Col span={{ base: 12, md: 7 }}>
        <Card h="100%">
          <Title order={4} mb="md">
            Ingresos y gastos, últimos 6 meses
          </Title>
          <BarChart
            h={260}
            data={stats.history}
            dataKey="month"
            withLegend
            legendProps={{ verticalAlign: 'bottom' }}
            series={[
              { name: 'Ingresos', color: 'teal.6' },
              { name: 'Gastos', color: 'red.6' },
            ]}
            valueFormatter={(v) => formatMoney(v, currency)}
            yAxisProps={{ width: 0, tick: false }}
            gridAxis="none"
            withYAxis={false}
          />
        </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 5 }}>
        <Card h="100%">
          <Title order={4} mb="md">
            Gastos por categoría
          </Title>
          {stats.donut.length === 0 ? (
            <Text c="dimmed" size="sm" py="xl" ta="center">
              Este mes no has registrado gastos.
            </Text>
          ) : (
            <Stack gap="md">
              <Group justify="center">
                <DonutChart
                  size={170}
                  thickness={26}
                  data={stats.donut}
                  withTooltip
                  tooltipDataSource="segment"
                  valueFormatter={(v) => formatMoney(v, currency)}
                />
              </Group>
              <Stack gap={6}>
                {stats.donut.slice(0, 5).map((d) => (
                  <Group key={d.name} justify="space-between" wrap="nowrap">
                    <Group gap={8} wrap="nowrap">
                      <span
                        aria-hidden
                        style={{ width: 10, height: 10, borderRadius: 3, background: `var(--mantine-color-${d.color.replace('.', '-')})` }}
                      />
                      <Text size="sm" lineClamp={1}>
                        {d.name}
                      </Text>
                    </Group>
                    <Text size="sm" className="tabular-nums" c="dimmed">
                      {formatMoney(d.value, currency)}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Stack>
          )}
        </Card>
        </Grid.Col>
      </Grid>

      <Card p={0}>
        <Group justify="space-between" p="lg" pb="sm">
          <Title order={4}>Últimos movimientos</Title>
          <Text component={Link} to="/transacciones" size="sm" c="ink" fw={500}>
            Ver todos
          </Text>
        </Group>
        {stats.recent.length === 0 ? (
          <Text c="dimmed" size="sm" px="lg" pb="lg">
            Aún no hay movimientos en {currency}.
          </Text>
        ) : (
          <Table.ScrollContainer minWidth={480}>
            <Table verticalSpacing="sm" horizontalSpacing="lg">
              <Table.Tbody>
                {stats.recent.map((t) => {
                  const category = categories.find((c) => c.id === t.categoryId);
                  return (
                    <Table.Tr key={t.id}>
                      <Table.Td className="whitespace-nowrap" c="dimmed">
                        {formatDate(t.date)}
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" lineClamp={1}>
                          {t.description || category?.name || 'Sin descripción'}
                        </Text>
                        {t.description && category && (
                          <Text size="xs" c="dimmed">
                            {category.name}
                          </Text>
                        )}
                      </Table.Td>
                      <Table.Td ta="right" className="whitespace-nowrap">
                        <Amount amount={t.amount} currency={currency} type={t.type} />
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </Card>
    </>
  );
}
