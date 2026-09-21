import { Button, Group, Modal, SegmentedControl, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import type { Category, TransactionType } from '@/api/types';
import { useCreateCategory, useUpdateCategory } from '@/hooks/queries';

interface Props {
  opened: boolean;
  onClose: () => void;
  category?: Category | null;
  /** Tipo preseleccionado al crear */
  defaultType?: TransactionType;
}

interface FormValues {
  name: string;
  type: TransactionType;
}

export default function CategoryFormModal({ opened, onClose, category, defaultType = 'expense' }: Props) {
  const isEdit = !!category;
  const create = useCreateCategory();
  const update = useUpdateCategory();

  const form = useForm<FormValues>({
    initialValues: { name: '', type: defaultType },
    validate: {
      name: (v) => (v.trim().length < 2 ? 'Escribe un nombre de al menos 2 caracteres' : null),
    },
  });

  useEffect(() => {
    if (!opened) return;
    form.setValues(category ? { name: category.name, type: category.type } : { name: '', type: defaultType });
    form.clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, category, defaultType]);

  const handleSubmit = form.onSubmit((values) => {
    const data = { name: values.name.trim(), type: values.type };
    if (isEdit && category) update.mutate({ id: category.id, data }, { onSuccess: onClose });
    else create.mutate(data, { onSuccess: onClose });
  });

  return (
    <Modal opened={opened} onClose={onClose} title={isEdit ? 'Editar categoría' : 'Nueva categoría'} size="sm">
      <form onSubmit={handleSubmit}>
        <Stack>
          <div>
            <Text size="sm" fw={500} mb={4}>
              Tipo
            </Text>
            <SegmentedControl
              fullWidth
              data={[
                { value: 'expense', label: 'Gasto' },
                { value: 'income', label: 'Ingreso' },
              ]}
              {...form.getInputProps('type')}
            />
          </div>
          <TextInput label="Nombre" placeholder="Ej: Mercado" data-autofocus {...form.getInputProps('name')} />
          <Group justify="flex-end" mt="xs">
            <Button variant="default" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={create.isPending || update.isPending}>
              {isEdit ? 'Guardar cambios' : 'Crear categoría'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
