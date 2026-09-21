import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { accountApi, categoryApi, transactionApi } from '@/api/services';
import type {
  CreateAccountPayload,
  CreateCategoryPayload,
  CreateTransactionPayload,
  UpdateAccountPayload,
  UpdateCategoryPayload,
  UpdateTransactionPayload,
} from '@/api/types';
import { getErrorMessage } from '@/lib/errors';

export const keys = {
  accounts: ['accounts'] as const,
  categories: ['categories'] as const,
  transactions: ['transactions'] as const,
};

// ---------- Queries ----------
export const useAccounts = () => useQuery({ queryKey: keys.accounts, queryFn: accountApi.list });
export const useCategories = () => useQuery({ queryKey: keys.categories, queryFn: categoryApi.list });
export const useTransactions = () => useQuery({ queryKey: keys.transactions, queryFn: transactionApi.list });

// ---------- Mutations ----------
type Key = readonly string[];

function useAppMutation<TVars, TData>(mutationFn: (vars: TVars) => Promise<TData>, message: string, invalidate: Key[]) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      invalidate.forEach((queryKey) => qc.invalidateQueries({ queryKey }));
      notifications.show({ message, color: 'teal' });
    },
    onError: (err) =>
      notifications.show({ title: 'No se pudo completar la acción', message: getErrorMessage(err), color: 'red' }),
  });
}

// Cuentas
export const useCreateAccount = () =>
  useAppMutation((data: CreateAccountPayload) => accountApi.create(data), 'Cuenta creada', [keys.accounts]);
export const useUpdateAccount = () =>
  useAppMutation(
    ({ id, data }: { id: string; data: UpdateAccountPayload }) => accountApi.update(id, data),
    'Cuenta actualizada',
    [keys.accounts],
  );
export const useDeleteAccount = () =>
  useAppMutation((id: string) => accountApi.remove(id), 'Cuenta eliminada', [keys.accounts, keys.transactions]);

// Categorías
export const useCreateCategory = () =>
  useAppMutation((data: CreateCategoryPayload) => categoryApi.create(data), 'Categoría creada', [keys.categories]);
export const useUpdateCategory = () =>
  useAppMutation(
    ({ id, data }: { id: string; data: UpdateCategoryPayload }) => categoryApi.update(id, data),
    'Categoría actualizada',
    [keys.categories],
  );
export const useDeleteCategory = () =>
  useAppMutation((id: string) => categoryApi.remove(id), 'Categoría eliminada', [keys.categories, keys.transactions]);

// Transacciones
export const useCreateTransaction = () =>
  useAppMutation((data: CreateTransactionPayload) => transactionApi.create(data), 'Transacción registrada', [
    keys.transactions,
    keys.accounts,
  ]);
export const useUpdateTransaction = () =>
  useAppMutation(
    ({ id, data }: { id: string; data: UpdateTransactionPayload }) => transactionApi.update(id, data),
    'Transacción actualizada',
    [keys.transactions, keys.accounts],
  );
export const useDeleteTransaction = () =>
  useAppMutation((id: string) => transactionApi.remove(id), 'Transacción eliminada', [
    keys.transactions,
    keys.accounts,
  ]);
