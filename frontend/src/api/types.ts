export type TransactionType = 'income' | 'expense';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  userId: string | null;
  name: string;
  type: TransactionType;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string | null;
  type: TransactionType;
  amount: number;
  description?: string | null;
  date: string;
  createdAt: string;
}

// ---------- Payloads ----------
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}
export interface LoginPayload {
  email: string;
  password: string;
}
export interface UpdateProfilePayload {
  name?: string;
  email?: string;
}
export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface CreateAccountPayload {
  name: string;
  type: string;
  balance: number;
  currency: string;
  description?: string;
}
export interface UpdateAccountPayload {
  name?: string;
  type?: string;
  currency?: string;
  description?: string;
}

export interface CreateCategoryPayload {
  name: string;
  type: TransactionType;
}
export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export interface CreateTransactionPayload {
  accountId: string;
  categoryId?: string | null;
  type: TransactionType;
  amount: number;
  description?: string;
  date: string;
}
export type UpdateTransactionPayload = Partial<CreateTransactionPayload>;
