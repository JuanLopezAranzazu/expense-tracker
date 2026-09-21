import { ActionIcon, Badge, Button, Card, Group, Loader, Menu, SimpleGrid, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconDots, IconPencil, IconPlus, IconTrash, IconWallet } from '@tabler/icons-react';
import { useState } from 'react';
import type { Account } from '@/api/types';
import AccountFormModal from '@/components/AccountFormModal';
import Amount from '@/components/Amount';
import EmptyState from '@/components/EmptyState';
import PageHeader from '@/components/PageHeader';
import { useAccounts, useDeleteAccount } from '@/hooks/queries';
import { accountTypeLabel } from '@/lib/constants';

export default function Accounts() {
  const { data: accounts = [], isLoading } = useAccounts();
  const remove = useDeleteAccount();
  const [opened, { open, close }] = useDisclosure(false);
  const [editing, setEditing] = useState<Account | null>(null);

  const openCreate = () => {
    setEditing(null);
    open();
  };
  const openEdit = (account: Account) => {
    setEditing(account);
    open();
  };
  const confirmDelete = (account: Account) =>
    modals.openConfirmModal({
      title: 'Eliminar cuenta',
      centered: true,
      children: (
        <Text size="sm">
          ¿Seguro que quieres eliminar <b>{account.name}</b>? Esta acción no se puede deshacer.
        </Text>
      ),
      labels: { confirm: 'Eliminar', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: () => remove.mutate(account.id),
    });

  return (
    <>
      <PageHeader
        title="Cuentas"
        description="Dónde guardas tu dinero: efectivo, bancos, tarjetas."
        actions={
          <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
            Nueva cuenta
          </Button>
        }
      />

      {isLoading ? (
        <Group justify="center" py="xl">
          <Loader />
        </Group>
      ) : accounts.length === 0 ? (
        <Card>
          <EmptyState
            icon={<IconWallet size={32} stroke={1.5} />}
            title="Aún no tienes cuentas"
            description="Crea tu primera cuenta con su saldo actual para empezar a registrar movimientos."
            actionLabel="Crear cuenta"
            onAction={openCreate}
          />
        </Card>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {accounts.map((account) => (
            <Card key={account.id}>
              <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Stack gap={4}>
                  <Text fw={600}>{account.name}</Text>
                  <Group gap={6}>
                    <Badge variant="light" color="gray" size="sm" radius="sm">
                      {accountTypeLabel(account.type)}
                    </Badge>
                    <Badge variant="outline" color="gray" size="sm" radius="sm">
                      {account.currency}
                    </Badge>
                  </Group>
                </Stack>
                <Menu position="bottom-end">
                  <Menu.Target>
                    <ActionIcon variant="subtle" color="gray" aria-label={`Opciones de ${account.name}`}>
                      <IconDots size={18} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item leftSection={<IconPencil size={16} />} onClick={() => openEdit(account)}>
                      Editar
                    </Menu.Item>
                    <Menu.Item color="red" leftSection={<IconTrash size={16} />} onClick={() => confirmDelete(account)}>
                      Eliminar
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>

              <Text c="dimmed" size="xs" mt="lg">
                Saldo
              </Text>
              <Amount amount={account.balance} currency={account.currency} size="xl" c={account.balance < 0 ? 'red.7' : undefined} />

              {account.description && (
                <Text c="dimmed" size="sm" mt="sm" lineClamp={2}>
                  {account.description}
                </Text>
              )}
            </Card>
          ))}
        </SimpleGrid>
      )}

      <AccountFormModal opened={opened} onClose={close} account={editing} />
    </>
  );
}
