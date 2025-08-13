import './shim-fetch';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config';
import { PrismaClient } from '@prisma/client';
import { verifyTelegramInitData, TelegramUser } from './telegram';

const app = express();
const prisma = new PrismaClient();

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (config.origins.includes(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());

declare global {
  namespace Express {
    interface Request {
      telegramUser?: TelegramUser & { demo?: boolean };
    }
  }
}

function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const initData = req.header('x-telegram-init-data');
  if (initData && config.telegramBotToken) {
    const user = verifyTelegramInitData(initData, config.telegramBotToken);
    if (user) {
      req.telegramUser = user;
      return next();
    }
  }
  // Demo mode fallback
  req.telegramUser = { id: 1, first_name: 'Demo', username: 'demo_user', demo: true };
  return next();
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, env: config.nodeEnv });
});

app.get('/api/categories', async (_req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  res.json(categories);
});

app.get('/api/products', async (req, res) => {
  const q = String(req.query.q || '');
  const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
  const products = await prisma.product.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {},
        categoryId ? { categoryId } : {},
      ],
    },
    include: { images: true, category: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(products);
});

app.get('/api/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true, category: true },
  });
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

app.use(authMiddleware);

app.get('/api/orders/my', async (req, res) => {
  const tg = req.telegramUser!;
  const user = await prisma.user.upsert({
    where: { telegramId: String(tg.id) },
    update: {},
    create: {
      telegramId: String(tg.id),
      firstName: tg.first_name,
      lastName: tg.last_name,
      username: tg.username,
    },
  });
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
});

app.post('/api/orders', async (req, res) => {
  const tg = req.telegramUser!;
  const { items, address } = req.body as {
    items: { productId: number; quantity: number }[];
    address?: unknown;
  };
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Empty items' });
  }

  const user = await prisma.user.upsert({
    where: { telegramId: String(tg.id) },
    update: {},
    create: {
      telegramId: String(tg.id),
      firstName: tg.first_name,
      lastName: tg.last_name,
      username: tg.username,
    },
  });

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
  });
  const itemsMap = new Map(products.map((p) => [p.id, p]));
  let total = 0;
  const orderItemsData = items.map((i) => {
    const p = itemsMap.get(i.productId);
    if (!p) throw new Error('Product not found');
    total += p.price * i.quantity;
    return {
      productId: p.id,
      quantity: i.quantity,
      unitPrice: p.price,
      title: p.title,
    };
  });

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalAmount: total,
      currency: 'RUB',
      status: 'pending',
      address: address ?? undefined,
      items: { create: orderItemsData },
    },
    include: { items: true },
  });

  res.json({ orderId: order.id });
});

app.listen(config.port, () => {
  console.log(`Backend listening on http://localhost:${config.port}`);
});
