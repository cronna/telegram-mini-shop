import { Link } from "react-router";

export function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Telegram Mini Shop</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl">
          Стильный мини‑магазин для Telegram с каталогом, корзиной и оформлением заказа. Откройте демо ниже.
        </p>
        <div className="mt-8">
          <Link className="inline-flex items-center rounded-md bg-black text-white px-5 py-3" to="/shop">Открыть магазин</Link>
        </div>
      </div>
    </div>
  );
}
