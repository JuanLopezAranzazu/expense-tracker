import { Button, Group, Modal, NumberInput, SegmentedControl, Select, Stack, Text, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import type { Transaction, TransactionType } from '@/api/types';
import { useAccounts, useCategories, useCreateTransaction, useUpdateTransaction } from '@/hooks/queries';

interface Props {
  opened: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
}

interface FormValues {
  type: TransactionType;
  accountId: string | null;
  categoryId: string | null;
  amount: number | string;
  date: string | null;
  description: string;
}

const today = () => dayjs().format('YYYY-MM-DD');

export default function TransactionFormModal({ opened, onClose, transaction }: Props) {
  const isEdit = !!transaction;
  const { data: accounts = [] } = useAccounts();
  const { data: categories = [] } = useCategories();
  const create = useCreateTransaction();
  const update = useUpdateTransaction();

  const form = useForm<FormValues>({
    initialValues: { type: 'expense', accountId: null, categoryId: null, amount: '', date: today(), description: '' },
    validate: {
      accountId: (v) => (v ? null : 'Elige una cuenta'),
      amount: (v) => (Number(v) > 0 ? null : 'El monto debe ser mayor que 0'),
      date: (v) => (v ? null : 'Elige una fecha'),
    },
  });

  useEffect(() => {
    if (!opened) return;
    const next: FormValues = transaction
      ? {
          type: transaction.type === 'income' ? 'income' : 'expense',
          accountId: transaction.accountId,
          categoryId: transaction.categoryId,
          amount: transaction.amount,
          date: transaction.date.slice(0, 10),
          description: transaction.description ?? '',
        }
      : {
          type: 'expense',
          accountId: accounts[0]?.id ?? null,
          categoryId: null,
          amount: '',
          date: today(),
          description: '',
        };
    form.setValues(next);
    form.clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, transaction]);

  const categoryOptions = useMemo(
    () => categories.filter((c) => c.type === form.values.type).map((c) => ({ value: c.id, label: c.name })),
    [categories, form.values.type],
  );

  const currency = accounts.find((a) => a.id === form.values.accountId)?.currency;

  const handleTypeChange = (type: string) => {
    form.setFieldValue('type', type as TransactionType);
    // La categoría debe corresponder al tipo elegido
    const current = categories.find((c) => c.id === form.values.categoryId);
    if (current && current.type !== type) form.setFieldValue('categoryId', null);
  };

  const handleSubmit = form.onSubmit((values) => {
    const payload = {
      accountId: values.accountId!,
      categoryId: values.categoryId,
      type: values.type,
      amount: Number(values.amount),
      date: values.date!,
    };
    const description = values.description.trim();
    if (isEdit && transaction) update.mutate({ id: transaction.id, data: { ...payload, description } }, { onSuccess: onClose });
    else create.mutate({ ...payload, description: description || undefined }, { onSuccess: onClose });
  });

  return (
    <Modal opened={opened} onClose={onClose} title={isEdit ? 'Editar transacción' : 'Nueva transacción'}>
      <form onSubmit={handleSubmit}>
        <Stack>
          <div>
            <Text size="sm" fw={500} mb={4}>
              Tipo
            </Text>
            <SegmentedControl
              fullWidth
              color={form.values.type === 'income' ? 'teal' : 'red'}
              value={form.values.type}
              onChange={handleTypeChange}
              data={[
                { value: 'expense', label: 'Gasto' },
                { value: 'income', label: 'Ingreso' },
              ]}
            />
          </div>

          <NumberInput
            label="Monto"
            placeholder="0"
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={2}
            min={0}
            hideControls
            leftSection={currency ? <Text size="xs" c="dimmed">{currency}</Text> : undefined}
            leftSectionWidth={48}
            data-autofocus
            {...form.getInputProps('amount')}
          />

          <Select
            label="Cuenta"
            placeholder={accounts.length ? 'Elige una cuenta' : 'Primero crea una cuenta'}
            data={accounts.map((a) => ({ value: a.id, label: a.name }))}
            disabled={accounts.length === 0}
            allowDeselect={false}
            {...form.getInputProps('accountId')}
          />

          <Group grow align="flex-start">
            <Select
              label="Categoría"
              placeholder="Sin categoría"
              data={categoryOptions}
              clearable={!isEdit}
              searchable
              nothingFoundMessage="No hay categorías de este tipo"
              {...form.getInputProps('categoryId')}
            />
            <DateInput
              label="Fecha"
              valueFormat="DD/MM/YYYY"
              maxDate={dayjs().add(1, 'year').format('YYYY-MM-DD')}
              {...form.getInputProps('date')}
            />
          </Group>

          <Textarea
            label="Descripción (opcional)"
            placeholder="Ej: Almuerzo con el equipo"
            autosize
            minRows={2}
            maxRows={4}
            {...form.getInputProps('description')}
          />

          <Group justify="flex-end" mt="xs">
            <Button variant="default" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={create.isPending || update.isPending} disabled={accounts.length === 0}>
              {isEdit ? 'Guardar cambios' : 'Registrar'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
