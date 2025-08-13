import crypto from 'crypto';
import axios from 'axios';
import { config } from './config';

export type TelegramUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
};

export function parseInitData(initData: string): Record<string, string> {
  const params = new URLSearchParams(initData);
  const data: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    data[key] = value;
  }
  return data;
}

export function verifyTelegramInitData(initData: string, botToken: string): TelegramUser | null {
  try {
    const data = parseInitData(initData);
    const hash = data['hash'];
    if (!hash) return null;

    const dataCheckArray = Object.keys(data)
      .filter((key) => key !== 'hash')
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckArray)
      .digest('hex');

    if (calculatedHash !== hash) return null;

    const userRaw = data['user'];
    if (!userRaw) return null;
    const user = JSON.parse(userRaw) as TelegramUser;
    return user;
  } catch {
    return null;
  }
}

export async function createInvoiceLink(params: {
  title: string;
  description: string;
  payload: string;
  currency: string;
  prices: { label: string; amount: number }[];
}): Promise<string> {
  const url = `https://api.telegram.org/bot${config.telegramBotToken}/createInvoiceLink`;
  const res = await axios.post(url, params);
  if (!res.data?.ok) {
    throw new Error('Failed to create invoice link');
  }
  return res.data.result as string;
}
