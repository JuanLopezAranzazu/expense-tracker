import { Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';

/** Estructura compartida de Login y Registro: panel de marca + formulario. */
export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside
        className="ledger-lines relative hidden flex-col justify-between p-12 lg:flex"
        style={{ backgroundColor: 'var(--mantine-color-ink-9)', color: '#fff' }}
      >
        <Text fw={700} size="xl" c="white" style={{ letterSpacing: '-0.01em' }}>
          Libreta
        </Text>

        <div className="max-w-md">
          <Title order={1} c="white" fz={40} lh={1.15} fw={600}>
            Sabe a dónde se va tu plata.
          </Title>
          <Text mt="md" c="ink.1" size="lg" lh={1.5}>
            Registra lo que entra y lo que sale, ordénalo por cuentas y categorías, y mira cómo cambia cada mes.
          </Text>
        </div>

        <Text c="ink.3" size="sm">
          Tus datos son tuyos: cada usuario ve solo sus cuentas y movimientos.
        </Text>
      </aside>

      <main className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
