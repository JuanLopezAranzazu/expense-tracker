import { Alert, Anchor, Button, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import AuthShell from '@/components/AuthShell';
import { getErrorMessage } from '@/lib/errors';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: { name: '', email: '', password: '', confirm: '' },
    validate: {
      name: (v) => (v.trim().length < 2 ? 'Escribe tu nombre' : null),
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Escribe un correo válido'),
      password: (v) => (v.length < 6 ? 'Usa al menos 6 caracteres' : null),
      confirm: (v, values) => (v !== values.password ? 'Las contraseñas no coinciden' : null),
    },
  });

  const handleSubmit = form.onSubmit(async ({ name, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      await register({ name: name.trim(), email, password });
      navigate('/', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  });

  return (
    <AuthShell>
      <Title order={2}>Crea tu cuenta</Title>
      <Text c="dimmed" size="sm" mt={4} mb="xl">
        ¿Ya tienes una?{' '}
        <Anchor component={Link} to="/login" size="sm">
          Inicia sesión
        </Anchor>
      </Text>

      <form onSubmit={handleSubmit}>
        <Stack>
          {error && (
            <Alert color="red" icon={<IconAlertCircle size={18} />}>
              {error}
            </Alert>
          )}
          <TextInput label="Nombre" autoComplete="name" {...form.getInputProps('name')} />
          <TextInput label="Correo electrónico" placeholder="tu@correo.com" autoComplete="email" {...form.getInputProps('email')} />
          <PasswordInput label="Contraseña" autoComplete="new-password" {...form.getInputProps('password')} />
          <PasswordInput label="Confirmar contraseña" autoComplete="new-password" {...form.getInputProps('confirm')} />
          <Button type="submit" loading={loading} fullWidth mt="xs">
            Crear cuenta
          </Button>
        </Stack>
      </form>
    </AuthShell>
  );
}
