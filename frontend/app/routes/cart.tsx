import type { Route } from "./+types/cart";
import { useCart } from '../store/cart';
import { Button, Price } from '../components/ui';
import { Link } from 'react-router';

export function meta({}: Route.MetaArgs) { return [{ title: 'Корзина' }]; }

export default function CartPage() {
  const { items, remove, total } = useCart();
  const sum = total();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Корзина</h1>
      <div className="space-y-3">
        {items.map((i) => (
          <div key={i.productId} className="flex items-center gap-4 border-b pb-3">
            {i.image && <img src={i.image} className="w-16 h-16 object-cover rounded" />}
            <div className="flex-1">
              <div className="font-medium">{i.title}</div>
              <div className="text-sm text-gray-500">Количество: {i.quantity}</div>
            </div>
            <div className="font-semibold"><Price value={i.price * i.quantity} /></div>
            <Button className="ml-2" onClick={() => remove(i.productId)}>Удалить</Button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="text-lg">Итого: <b><Price value={sum} /></b></div>
        <Link to="/checkout"><Button disabled={!sum}>Оформить</Button></Link>
      </div>
    </div>
  );
}
