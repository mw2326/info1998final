const base = (import.meta.env.VITE_API_BASE as string | undefined) ?? '';

export const apiUrl = (path: string): string => `${base}${path}`;
