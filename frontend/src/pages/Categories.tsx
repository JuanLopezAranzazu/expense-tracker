import { ActionIcon, Badge, Button, Card, Group, Loader, Tabs, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconPencil, IconPlus, IconTags, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import type { Category, TransactionType } from '@/api/types';
import CategoryFormModal from '@/components/CategoryFormModal';
import EmptyState from '@/components/EmptyState';
import PageHeader from '@/components/PageHeader';
import { useCategories, useDeleteCategory } from '@/hooks/queries';

export default function Categories() {
  const { data: categories = [], isLoading } = useCategories();
  const remove = useDeleteCategory();
  const [tab, setTab] = useState<TransactionType>('expense');
  const [opened, { open, close }] = useDisclosure(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const openCreate = () => {
    setEditing(null);
    open();
  };
  const openEdit = (category: Category) => {
    setEditing(category);
    open();
  };
  const confirmDelete = (category: Category) =>
    modals.openConfirmModal({
      title: 'Eliminar categoría',
      centered: true,
      children: (
        <Text size="sm">
          ¿Eliminar <b>{category.name}</b>? Las transacciones que la usan podrían quedar sin categoría.
        </Text>
      ),
      labels: { confirm: 'Eliminar', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: () => remove.mutate(category.id),
    });

  const list = categories.filter((c) => c.type === tab);

  return (
    <>
      <PageHeader
        title="Categorías"
        description="Agrupa tus movimientos para ver en qué se va (y de dónde viene) tu dinero."
        actions={
          <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
            Nueva categoría
          </Button>
        }
      />

      <Tabs value={tab} onChange={(v) => setTab((v as TransactionType) ?? 'expense')}>
        <Tabs.List mb="md">
          <Tabs.Tab value="expense">Gastos</Tabs.Tab>
          <Tabs.Tab value="income">Ingresos</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <Card p={0}>
        {isLoading ? (
          <Group justify="center" py="xl">
            <Loader />
          </Group>
        ) : list.length === 0 ? (
          <EmptyState
            icon={<IconTags size={32} stroke={1.5} />}
            title={`No hay categorías de ${tab === 'expense' ? 'gastos' : 'ingresos'}`}
            description="Crea una para clasificar tus movimientos."
            actionLabel="Crear categoría"
            onAction={openCreate}
          />
        ) : (
          list.map((category, i) => {
            const isDefault = category.userId === null;
            return (
              <Group
                key={category.id}
                justify="space-between"
                px="lg"
                py="sm"
                style={i > 0 ? { borderTop: '1px solid var(--mantine-color-default-border)' } : undefined}
              >
                <Group gap="sm">
                  <Text>{category.name}</Text>
                  {isDefault && (
                    <Badge variant="light" color="gray" size="sm" radius="sm">
                      Predeterminada
                    </Badge>
                  )}
                </Group>
                {!isDefault && (
                  <Group gap={4}>
                    <ActionIcon variant="subtle" color="gray" aria-label={`Editar ${category.name}`} onClick={() => openEdit(category)}>
                      <IconPencil size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" aria-label={`Eliminar ${category.name}`} onClick={() => confirmDelete(category)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                )}
              </Group>
            );
          })
        )}
      </Card>

      <CategoryFormModal opened={opened} onClose={close} category={editing} defaultType={tab} />
    </>
  );
}
