import { Button, Stack, Text } from '@mantine/core';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export default function EmptyState({ title, description, actionLabel, onAction, icon }: Props) {
  return (
    <Stack align="center" gap="xs" py="xl" ta="center">
      {icon}
      <Text fw={600}>{title}</Text>
      <Text c="dimmed" size="sm" maw={360}>
        {description}
      </Text>
      {actionLabel && (
        <Button mt="xs" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Stack>
  );
}
