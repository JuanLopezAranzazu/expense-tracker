import { api } from './client';
import type {
  Account,
  AuthResponse,
  Category,
  ChangePasswordPayload,
  CreateAccountPayload,
  CreateCategoryPayload,
  CreateTransactionPayload,
  LoginPayload,
  RegisterPayload,
  Transaction,
  UpdateAccountPayload,
  UpdateCategoryPayload,
  UpdateProfilePayload,
  UpdateTransactionPayload,
  User,
} from './types';

export const authApi = {
  register: (data: RegisterPayload) => api.post<AuthResponse>('/auth/register', data).then((r) => r.data),
  login: (data: LoginPayload) => api.post<AuthResponse>('/auth/login', data).then((r) => r.data),
};

export const userApi = {
  getProfile: () => api.get<User>('/users/me').then((r) => r.data),
  updateProfile: (data: UpdateProfilePayload) => api.put<User>('/users/me', data).then((r) => r.data),
  changePassword: (data: ChangePasswordPayload) => api.put<void>('/users/me/password', data).then((r) => r.data),
};

export const accountApi = {
  list: () => api.get<Account[]>('/accounts').then((r) => r.data ?? []),
  create: (data: CreateAccountPayload) => api.post<Account>('/accounts', data).then((r) => r.data),
  update: (id: string, data: UpdateAccountPayload) => api.put<Account>(`/accounts/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete<void>(`/accounts/${id}`).then((r) => r.data),
};

export const categoryApi = {
  list: () => api.get<Category[]>('/categories').then((r) => r.data ?? []),
  create: (data: CreateCategoryPayload) => api.post<Category>('/categories', data).then((r) => r.data),
  update: (id: string, data: UpdateCategoryPayload) => api.put<Category>(`/categories/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete<void>(`/categories/${id}`).then((r) => r.data),
};

export const transactionApi = {
  list: () => api.get<Transaction[]>('/transactions').then((r) => r.data ?? []),
  create: (data: CreateTransactionPayload) => api.post<Transaction>('/transactions', data).then((r) => r.data),
  update: (id: string, data: UpdateTransactionPayload) =>
    api.put<Transaction>(`/transactions/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete<void>(`/transactions/${id}`).then((r) => r.data),
};
