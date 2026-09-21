import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Container,
  Group,
  Menu,
  NavLink,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconArrowsExchange,
  IconLayoutDashboard,
  IconLogout,
  IconMoon,
  IconSun,
  IconTags,
  IconUser,
  IconWallet,
} from '@tabler/icons-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';

const links = [
  { to: '/', label: 'Resumen', icon: IconLayoutDashboard },
  { to: '/transacciones', label: 'Transacciones', icon: IconArrowsExchange },
  { to: '/cuentas', label: 'Cuentas', icon: IconWallet },
  { to: '/categorias', label: 'Categorías', icon: IconTags },
  { to: '/perfil', label: 'Perfil', icon: IconUser },
];

export default function Layout() {
  const [opened, { toggle, close }] = useDisclosure();
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setColorScheme } = useMantineColorScheme();
  const scheme = useComputedColorScheme('light');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" aria-label="Abrir menú" />
            <Text component={Link} to="/" fw={700} size="lg" c="ink.9" style={{ textDecoration: 'none', letterSpacing: '-0.01em' }}>
              Libreta
            </Text>
          </Group>

          <Group gap="xs">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              aria-label="Cambiar tema"
              onClick={() => setColorScheme(scheme === 'dark' ? 'light' : 'dark')}
            >
              {scheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>

            <Menu position="bottom-end" width={200}>
              <Menu.Target>
                <ActionIcon variant="transparent" size="lg" aria-label="Menú de usuario">
                  <Avatar color="ink" radius="xl" size="sm">
                    {user?.name.charAt(0).toUpperCase()}
                  </Avatar>
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>{user?.email}</Menu.Label>
                <Menu.Item leftSection={<IconUser size={16} />} component={Link} to="/perfil">
                  Mi perfil
                </Menu.Item>
                <Menu.Item color="red" leftSection={<IconLogout size={16} />} onClick={handleLogout}>
                  Cerrar sesión
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            component={Link}
            to={to}
            label={label}
            leftSection={<Icon size={18} stroke={1.8} />}
            active={to === '/' ? pathname === '/' : pathname.startsWith(to)}
            onClick={close}
            variant="light"
            style={{ borderRadius: 'var(--mantine-radius-md)' }}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="lg" p={0}>
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
