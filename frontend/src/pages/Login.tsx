import { Alert, Anchor, Button, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import AuthShell from '@/components/AuthShell';
import { getErrorMessage } from '@/lib/errors';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Escribe un correo válido'),
      password: (v) => (v ? null : 'Escribe tu contraseña'),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true);
    setError(null);
    try {
      await login(values);
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  });

  return (
    <AuthShell>
      <Title order={2}>Inicia sesión</Title>
      <Text c="dimmed" size="sm" mt={4} mb="xl">
        ¿Aún no tienes cuenta?{' '}
        <Anchor component={Link} to="/registro" size="sm">
          Regístrate
        </Anchor>
      </Text>

      <form onSubmit={handleSubmit}>
        <Stack>
          {error && (
            <Alert color="red" icon={<IconAlertCircle size={18} />}>
              {error}
            </Alert>
          )}
          <TextInput label="Correo electrónico" placeholder="tu@correo.com" autoComplete="email" {...form.getInputProps('email')} />
          <PasswordInput label="Contraseña" autoComplete="current-password" {...form.getInputProps('password')} />
          <Button type="submit" loading={loading} fullWidth mt="xs">
            Iniciar sesión
          </Button>
        </Stack>
      </form>
    </AuthShell>
  );
}
