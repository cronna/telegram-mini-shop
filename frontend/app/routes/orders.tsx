import type { Route } from "./+types/orders";
import { useEffect, useState } from 'react';
import { fetchMyOrders, type Order } from '../lib/api';
import { Price } from '../components/ui';

export function meta({}: Route.MetaArgs) { return [{ title: 'Мои заказы' }]; }

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { fetchMyOrders().then(setOrders); }, []);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Мои заказы</h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="border rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">Заказ #{o.id}</div>
              <div className="text-sm">Статус: {o.status}</div>
            </div>
            <div className="text-sm text-gray-500">Товаров: {o.items.length}</div>
            <div className="mt-2 font-semibold"><Price value={o.totalAmount} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
