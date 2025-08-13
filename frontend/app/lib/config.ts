export const APP_CONFIG = {
  apiBaseUrl:
    (import.meta as any).env?.VITE_API_URL ||
    (typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:4000/api'),
};

export function getTelegramWebApp() {
  return (globalThis as any).Telegram?.WebApp as
    | (import('@twa-dev/types').WebApp)
    | undefined;
}
