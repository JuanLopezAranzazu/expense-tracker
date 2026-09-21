import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Pagination,
  SegmentedControl,
  Select,
  SimpleGrid,
  Table,
  Text,
} from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconArrowsExchange, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import type { Transaction } from '@/api/types';
import Amount from '@/components/Amount';
import EmptyState from '@/components/EmptyState';
import PageHeader from '@/components/PageHeader';
import TransactionFormModal from '@/components/TransactionFormModal';
import { useAccounts, useCategories, useDeleteTransaction, useTransactions } from '@/hooks/queries';
import { formatDate, monthKey } from '@/lib/format';
import dayjs from 'dayjs';

const PAGE_SIZE = 10;

export default function Transactions() {
  const { data: transactions = [], isLoading } = useTransactions();
  const { data: accounts = [] } = useAccounts();
  const { data: categories = [] } = useCategories();
  const remove = useDeleteTransaction();

  const [opened, { open, close }] = useDisclosure(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  // Filtros
  const [type, setType] = useState<string>('all');
  const [accountId, setAccountId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const accountMap = useMemo(() => new Map(accounts.map((a) => [a.id, a])), [accounts]);
  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const filtered = useMemo(() => {
    const selectedMonth = month ? dayjs(month).format('YYYY-MM') : null;
    return transactions
      .filter((t) => (type === 'all' ? true : t.type === type))
      .filter((t) => (accountId ? t.accountId === accountId : true))
      .filter((t) => (categoryId ? t.categoryId === categoryId : true))
      .filter((t) => (selectedMonth ? monthKey(t.date) === selectedMonth : true))
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  }, [transactions, type, accountId, categoryId, month]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const hasFilters = type !== 'all' || !!accountId || !!categoryId || !!month;
  const clearFilters = () => {
    setType('all');
    setAccountId(null);
    setCategoryId(null);
    setMonth(null);
    setPage(1);
  };

  const openCreate = () => {
    setEditing(null);
    open();
  };
  const openEdit = (t: Transaction) => {
    setEditing(t);
    open();
  };
  const confirmDelete = (t: Transaction) =>
    modals.openConfirmModal({
      title: 'Eliminar transacción',
      centered: true,
      children: (
        <Text size="sm">
          Se eliminará el movimiento y el saldo de la cuenta se ajustará automáticamente. ¿Continuar?
        </Text>
      ),
      labels: { confirm: 'Eliminar', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: () => remove.mutate(t.id),
    });

  const setFilter = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(1);
  };

  return (
    <>
      <PageHeader
        title="Transacciones"
        description="Todos tus ingresos y gastos."
        actions={
          <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
            Nueva transacción
          </Button>
        }
      />

      <Card mb="md" padding="md">
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} verticalSpacing="sm">
          <div>
            <Text size="sm" fw={500} mb={4}>
              Tipo
            </Text>
            <SegmentedControl
              fullWidth
              value={type}
              onChange={setFilter(setType)}
              data={[
                { value: 'all', label: 'Todas' },
                { value: 'income', label: 'Ingresos' },
                { value: 'expense', label: 'Gastos' },
              ]}
            />
          </div>
          <Select
            label="Cuenta"
            placeholder="Todas"
            clearable
            data={accounts.map((a) => ({ value: a.id, label: a.name }))}
            value={accountId}
            onChange={setFilter(setAccountId)}
          />
          <Select
            label="Categoría"
            placeholder="Todas"
            clearable
            searchable
            data={categories.map((c) => ({ value: c.id, label: c.name }))}
            value={categoryId}
            onChange={setFilter(setCategoryId)}
          />
          <MonthPickerInput
            label="Mes"
            placeholder="Todos"
            clearable
            valueFormat="MMMM YYYY"
            value={month}
            onChange={setFilter(setMonth)}
          />
        </SimpleGrid>
      </Card>

      <Card p={0}>
        {isLoading ? (
          <Group justify="center" py="xl">
            <Loader />
          </Group>
        ) : filtered.length === 0 ? (
          transactions.length === 0 ? (
            <EmptyState
              icon={<IconArrowsExchange size={32} stroke={1.5} />}
              title="Todavía no hay movimientos"
              description={
                accounts.length === 0
                  ? 'Primero crea una cuenta en la sección Cuentas y luego registra tu primer movimiento.'
                  : 'Registra tu primer ingreso o gasto para empezar.'
              }
              actionLabel={accounts.length ? 'Registrar transacción' : undefined}
              onAction={openCreate}
            />
          ) : (
            <EmptyState
              title="Ningún movimiento coincide con los filtros"
              description="Prueba con otro mes, cuenta o categoría."
              actionLabel="Quitar filtros"
              onAction={clearFilters}
            />
          )
        ) : (
          <>
            <Table.ScrollContainer minWidth={720}>
              <Table verticalSpacing="sm" horizontalSpacing="lg" highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Fecha</Table.Th>
                    <Table.Th>Descripción</Table.Th>
                    <Table.Th>Categoría</Table.Th>
                    <Table.Th>Cuenta</Table.Th>
                    <Table.Th ta="right">Monto</Table.Th>
                    <Table.Th w={90} />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rows.map((t) => {
                    const account = accountMap.get(t.accountId);
                    const category = t.categoryId ? categoryMap.get(t.categoryId) : undefined;
                    return (
                      <Table.Tr key={t.id}>
                        <Table.Td className="whitespace-nowrap">{formatDate(t.date)}</Table.Td>
                        <Table.Td>
                          <Text size="sm" lineClamp={1} maw={260}>
                            {t.description || <Text span c="dimmed">—</Text>}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          {category ? (
                            <Badge variant="light" color="gray" radius="sm" size="sm" tt="none" fw={500}>
                              {category.name}
                            </Badge>
                          ) : (
                            <Text size="sm" c="dimmed">
                              Sin categoría
                            </Text>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{account?.name ?? '—'}</Text>
                        </Table.Td>
                        <Table.Td ta="right" className="whitespace-nowrap">
                          <Amount amount={t.amount} currency={account?.currency ?? 'COP'} type={t.type} />
                          {t.type === 'transfer' && (
                            <Text size="xs" c="dimmed">
                              Transferencia
                            </Text>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <Group gap={2} justify="flex-end" wrap="nowrap">
                            <ActionIcon
                              variant="subtle"
                              color="gray"
                              aria-label="Editar"
                              disabled={t.type === 'transfer'}
                              onClick={() => openEdit(t)}
                            >
                              <IconPencil size={16} />
                            </ActionIcon>
                            <ActionIcon variant="subtle" color="red" aria-label="Eliminar" onClick={() => confirmDelete(t)}>
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>

            <Group justify="space-between" p="md" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
              <Text size="sm" c="dimmed">
                {filtered.length} {filtered.length === 1 ? 'movimiento' : 'movimientos'}
                {hasFilters && (
                  <>
                    {' · '}
                    <Text span c="ink" style={{ cursor: 'pointer' }} onClick={clearFilters}>
                      quitar filtros
                    </Text>
                  </>
                )}
              </Text>
              {pages > 1 && <Pagination total={pages} value={current} onChange={setPage} size="sm" />}
            </Group>
          </>
        )}
      </Card>

      <TransactionFormModal opened={opened} onClose={close} transaction={editing} />
    </>
  );
}
