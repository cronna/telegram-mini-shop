import type { Route } from "./+types/checkout";
import { useState } from 'react';
import { useCart } from '../store/cart';
import { Button, Input, Label, Price } from '../components/ui';
import { createOrder } from '../lib/api';
import { getTelegramWebApp } from '../lib/config';

export function meta({}: Route.MetaArgs) { return [{ title: 'Оформление' }]; }

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const sum = total();

  async function onSubmit() {
    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        address: address ? { text: address } : undefined,
      };
      const res = await createOrder(payload);
      const wa = getTelegramWebApp();
      if (res.invoiceLink && wa?.openInvoice) {
        wa.openInvoice(res.invoiceLink, (status) => {
          // handle optional callback, status: paid/cancelled
        });
      }
      clear();
      alert(`Заказ создан #${res.orderId}`);
    } catch (e) {
      alert('Ошибка оформления');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Оформление</h1>
      <div className="space-y-4 max-w-xl">
        <div>
          <Label>Адрес доставки</Label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Город, улица, дом" />
        </div>
        <div className="text-lg">Итого к оплате: <b><Price value={sum} /></b></div>
        <Button onClick={onSubmit} disabled={!sum || loading}>{loading ? 'Отправка…' : 'Подтвердить заказ'}</Button>
      </div>
    </div>
  );
}
