import { Button, Card, Divider, Group, PasswordInput, SimpleGrid, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { userApi } from '@/api/services';
import { useAuth } from '@/auth/AuthContext';
import PageHeader from '@/components/PageHeader';
import { getErrorMessage } from '@/lib/errors';

const onError = (err: unknown) =>
  notifications.show({ title: 'No se pudo completar la acción', message: getErrorMessage(err), color: 'red' });

export default function Profile() {
  const { user, setUser } = useAuth();

  // ---- Datos personales ----
  const profileForm = useForm({
    initialValues: { name: user?.name ?? '', email: user?.email ?? '' },
    validate: {
      name: (v) => (v.trim().length < 2 ? 'Escribe tu nombre' : null),
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Escribe un correo válido'),
    },
  });

  useEffect(() => {
    if (user) profileForm.setValues({ name: user.name, email: user.email });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const updateProfile = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (updated) => {
      setUser(updated);
      notifications.show({ message: 'Perfil actualizado', color: 'teal' });
    },
    onError,
  });

  // ---- Contraseña ----
  const passwordForm = useForm({
    initialValues: { oldPassword: '', newPassword: '', confirm: '' },
    validate: {
      oldPassword: (v) => (v ? null : 'Escribe tu contraseña actual'),
      newPassword: (v) => (v.length < 6 ? 'Usa al menos 6 caracteres' : null),
      confirm: (v, values) => (v !== values.newPassword ? 'Las contraseñas no coinciden' : null),
    },
  });

  const changePassword = useMutation({
    mutationFn: userApi.changePassword,
    onSuccess: () => {
      passwordForm.reset();
      notifications.show({ message: 'Contraseña actualizada', color: 'teal' });
    },
    onError,
  });

  return (
    <>
      <PageHeader title="Perfil" description="Tus datos de acceso." />

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Card>
          <Title order={4} mb="md">
            Datos personales
          </Title>
          <form
            onSubmit={profileForm.onSubmit((v) => updateProfile.mutate({ name: v.name.trim(), email: v.email }))}
          >
            <Stack>
              <TextInput label="Nombre" {...profileForm.getInputProps('name')} />
              <TextInput label="Correo electrónico" {...profileForm.getInputProps('email')} />
              <Group justify="flex-end">
                <Button type="submit" loading={updateProfile.isPending} disabled={!profileForm.isDirty()}>
                  Guardar cambios
                </Button>
              </Group>
            </Stack>
          </form>
        </Card>

        <Card>
          <Title order={4} mb="md">
            Cambiar contraseña
          </Title>
          <form
            onSubmit={passwordForm.onSubmit((v) =>
              changePassword.mutate({ oldPassword: v.oldPassword, newPassword: v.newPassword }),
            )}
          >
            <Stack>
              <PasswordInput label="Contraseña actual" autoComplete="current-password" {...passwordForm.getInputProps('oldPassword')} />
              <Divider />
              <PasswordInput label="Nueva contraseña" autoComplete="new-password" {...passwordForm.getInputProps('newPassword')} />
              <PasswordInput label="Confirmar nueva contraseña" autoComplete="new-password" {...passwordForm.getInputProps('confirm')} />
              <Group justify="flex-end">
                <Button type="submit" loading={changePassword.isPending}>
                  Actualizar contraseña
                </Button>
              </Group>
            </Stack>
          </form>
          <Text size="xs" c="dimmed" mt="sm">
            Por seguridad, te pediremos la contraseña actual para confirmar el cambio.
          </Text>
        </Card>
      </SimpleGrid>
    </>
  );
}
