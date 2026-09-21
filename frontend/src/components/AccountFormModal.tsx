import { Button, Group, Modal, NumberInput, Select, Stack, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import type { Account } from '@/api/types';
import { useCreateAccount, useUpdateAccount } from '@/hooks/queries';
import { ACCOUNT_TYPES, CURRENCIES } from '@/lib/constants';

interface Props {
  opened: boolean;
  onClose: () => void;
  /** Si viene una cuenta, el modal edita; si no, crea. */
  account?: Account | null;
}

interface FormValues {
  name: string;
  type: string;
  currency: string;
  balance: number | string;
  description: string;
}

const emptyValues: FormValues = { name: '', type: 'bank', currency: 'COP', balance: 0, description: '' };

export default function AccountFormModal({ opened, onClose, account }: Props) {
  const isEdit = !!account;
  const create = useCreateAccount();
  const update = useUpdateAccount();
  const pending = create.isPending || update.isPending;

  const form = useForm<FormValues>({
    initialValues: emptyValues,
    validate: {
      name: (v) => (v.trim().length < 2 ? 'Escribe un nombre de al menos 2 caracteres' : null),
      type: (v) => (v ? null : 'Elige un tipo de cuenta'),
      currency: (v) => (v ? null : 'Elige una moneda'),
    },
  });

  useEffect(() => {
    if (!opened) return;
    form.setValues(
      account
        ? {
            name: account.name,
            type: account.type,
            currency: account.currency,
            balance: account.balance,
            description: account.description ?? '',
          }
        : emptyValues,
    );
    form.resetDirty();
    form.clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, account]);

  const handleSubmit = form.onSubmit((values) => {
    if (isEdit && account) {
      update.mutate(
        {
          id: account.id,
          data: {
            name: values.name.trim(),
            type: values.type,
            currency: values.currency,
            description: values.description.trim(),
          },
        },
        { onSuccess: onClose },
      );
    } else {
      create.mutate(
        {
          name: values.name.trim(),
          type: values.type,
          currency: values.currency,
          balance: Number(values.balance) || 0,
          description: values.description.trim() || undefined,
        },
        { onSuccess: onClose },
      );
    }
  });

  return (
    <Modal opened={opened} onClose={onClose} title={isEdit ? 'Editar cuenta' : 'Nueva cuenta'}>
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput label="Nombre" placeholder="Ej: Bancolombia ahorros" data-autofocus {...form.getInputProps('name')} />
          <Group grow align="flex-start">
            <Select label="Tipo" data={ACCOUNT_TYPES} allowDeselect={false} {...form.getInputProps('type')} />
            <Select label="Moneda" data={CURRENCIES} allowDeselect={false} {...form.getInputProps('currency')} />
          </Group>
          {!isEdit && (
            <NumberInput
              label="Saldo inicial"
              description="Lo que tienes hoy en esta cuenta"
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              {...form.getInputProps('balance')}
            />
          )}
          <Textarea label="Descripción (opcional)" autosize minRows={2} maxRows={4} {...form.getInputProps('description')} />
          <Group justify="flex-end" mt="xs">
            <Button variant="default" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={pending}>
              {isEdit ? 'Guardar cambios' : 'Crear cuenta'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
