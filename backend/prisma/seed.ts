import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const categories = await prisma.$transaction([
    prisma.category.create({ data: { name: 'Футболки', slug: 'tshirts' } }),
    prisma.category.create({ data: { name: 'Худи', slug: 'hoodies' } }),
    prisma.category.create({ data: { name: 'Обувь', slug: 'shoes' } }),
  ]);

  const [tshirts, hoodies, shoes] = categories;

  const p1 = await prisma.product.create({
    data: {
      title: 'Футболка Minimal Black',
      description: 'Базовая чёрная футболка премиального качества',
      price: 199900, // 1999.00 RUB
      categoryId: tshirts.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1520975922292-5e27b0803c6e?w=1200&q=80' },
        ],
      },
      variants: {
        create: [
          { name: 'size', value: 'S' },
          { name: 'size', value: 'M' },
          { name: 'size', value: 'L' },
        ],
      },
    },
  });

  const p2 = await prisma.product.create({
    data: {
      title: 'Худи Oversize Sand',
      description: 'Тёплое худи oversize в песочном цвете',
      price: 459900,
      categoryId: hoodies.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1618355628824-75d6be39f0fa?w=1200&q=80' },
        ],
      },
      variants: { create: [{ name: 'size', value: 'One Size' }] },
    },
  });

  const p3 = await prisma.product.create({
    data: {
      title: 'Кеды White Classic',
      description: 'Универсальные кеды из натуральной кожи',
      price: 699900,
      categoryId: shoes.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80' },
        ],
      },
      variants: {
        create: [
          { name: 'size', value: '41' },
          { name: 'size', value: '42' },
          { name: 'size', value: '43' },
        ],
      },
    },
  });

  console.log('Seed done:', { p1: p1.id, p2: p2.id, p3: p3.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
