import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function parseOrigins(value: string | undefined): string[] {
  const v = value || '';
  const parts = v.split(',').map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return ['http://localhost:5173'];
  return parts;
}

export const config = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  origins: parseOrigins(process.env.ORIGINS || process.env.ORIGIN),
  webAppUrl: process.env.WEBAPP_URL || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  telegramPaymentProviderToken: process.env.TELEGRAM_PAYMENT_PROVIDER_TOKEN || '',
  enablePayments: String(process.env.ENABLE_PAYMENTS || 'false') === 'true',
};
