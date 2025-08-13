import 'dotenv/config';
import { Telegraf, Markup } from 'telegraf';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const WEBAPP_URL = process.env.WEBAPP_URL || 'http://localhost:5173';
const LOCAL_DEV = String(process.env.LOCAL_DEV || 'false') === 'true';

if (!BOT_TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN is missing');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

function shopKeyboard() {
  const url = LOCAL_DEV ? 'http://localhost:5173/shop' : WEBAPP_URL + '/shop';
  return LOCAL_DEV
    ? Markup.keyboard([[Markup.button.url('Открыть магазин', url)]]).resize()
    : Markup.keyboard([[Markup.button.webApp('Открыть магазин', url)]]).resize();
}

bot.start((ctx) => {
  return ctx.reply('Добро пожаловать в Mini Shop!', shopKeyboard());
});

bot.command('shop', (ctx) =>
  ctx.reply(
    LOCAL_DEV ? 'Открыть в браузере' : 'Открыть мини‑приложение',
    LOCAL_DEV
      ? Markup.inlineKeyboard([[Markup.button.url('Открыть магазин', 'http://localhost:5173/shop')]])
      : Markup.inlineKeyboard([[Markup.button.webApp('Открыть магазин', WEBAPP_URL + '/shop')]])
  )
);

bot.launch().then(() => console.log('Bot started', { LOCAL_DEV }));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
