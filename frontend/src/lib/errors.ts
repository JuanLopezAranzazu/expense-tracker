import axios from 'axios';

/** Extrae el mensaje del backend ({ error } o { message }) o devuelve uno genérico. */
export function getErrorMessage(err: unknown, fallback = 'Ocurrió un error inesperado. Inténtalo de nuevo.') {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: unknown; message?: unknown } | undefined;
    if (typeof data?.error === 'string') return data.error;
    if (typeof data?.message === 'string') return data.message;
    if (!err.response) return 'No hay conexión con el servidor. Verifica que la API esté en ejecución.';
  }
  return fallback;
}
