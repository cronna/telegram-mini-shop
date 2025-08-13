import type { Route } from "./+types/index";
import { useEffect, useMemo, useState } from 'react';
import { fetchCategories, fetchProducts, type Category, type Product } from '../../lib/api';
import { Card, Price, Button, Input } from '../../components/ui';
import { Link } from 'react-router';
import { useCart } from '../../store/cart';

export function meta({}: Route.MetaArgs) { return [{ title: 'Каталог' }]; }

export default function ShopIndex() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const add = useCart((s) => s.add);

  useEffect(() => {
    (async () => {
      const [cats, prods] = await Promise.all([fetchCategories(), fetchProducts({})]);
      setCategories(cats);
      setProducts(prods);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchQ = q ? (p.title + ' ' + p.description).toLowerCase().includes(q.toLowerCase()) : true;
      const matchCat = categoryId ? p.categoryId === categoryId : true;
      return matchQ && matchCat;
    });
  }, [products, q, categoryId]);

  if (loading) return <div className="p-6">Загрузка…</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-3 mb-6">
        <Input placeholder="Поиск" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="border rounded-md px-3 py-2" value={String(categoryId ?? '')} onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}>
          <option value="">Все категории</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <Card key={p.id} className="overflow-hidden">
            <Link to={`/shop/product/${p.id}`}>
              <img src={p.images?.[0]?.url} alt={p.title} className="w-full aspect-square object-cover" />
              <div className="p-3">
                <div className="font-medium line-clamp-1">{p.title}</div>
                <div className="text-sm text-gray-500 line-clamp-2">{p.description}</div>
                <div className="mt-2 font-semibold"><Price value={p.price} /></div>
              </div>
            </Link>
            <div className="p-3 pt-0">
              <Button onClick={() => add({ productId: p.id, title: p.title, price: p.price, quantity: 1, image: p.images?.[0]?.url })} className="w-full">В корзину</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
