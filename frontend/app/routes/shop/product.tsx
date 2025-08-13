import type { Route } from "./+types/product";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { fetchProduct, type Product } from '../../lib/api';
import { Button, Card, Price } from '../../components/ui';
import { useCart } from '../../store/cart';

export function meta({}: Route.MetaArgs) { return [{ title: 'Товар' }]; }

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const add = useCart((s) => s.add);

  useEffect(() => {
    if (!id) return;
    fetchProduct(Number(id)).then(setProduct);
  }, [id]);

  if (!product) return <div className="p-6">Загрузка…</div>;

  return (
    <div className="container mx-auto p-4 grid gap-6 md:grid-cols-2">
      <Card className="overflow-hidden">
        <img src={product.images?.[0]?.url} alt={product.title} className="w-full aspect-square object-cover" />
      </Card>
      <div>
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <div className="text-gray-500 mt-2">{product.description}</div>
        <div className="mt-4 text-xl font-bold"><Price value={product.price} /></div>
        <div className="mt-6">
          <Button onClick={() => add({ productId: product.id, title: product.title, price: product.price, quantity: 1, image: product.images?.[0]?.url })}>
            Добавить в корзину
          </Button>
        </div>
      </div>
    </div>
  );
}
