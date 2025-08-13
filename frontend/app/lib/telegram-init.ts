import { getTelegramWebApp } from './config';

export function initTelegramUI() {
  const wa = getTelegramWebApp();
  if (!wa) return;
  try {
    wa.ready();
    wa.expand?.();
    wa.disableVerticalSwipes?.();
    // Theme class toggling could be added here if needed
  } catch {}
}
