import axios from 'axios';
import { APP_CONFIG, getTelegramWebApp } from './config';

export const api = axios.create({ baseURL: APP_CONFIG.apiBaseUrl });

api.interceptors.request.use((config) => {
  const wa = getTelegramWebApp();
  if (wa?.initData) {
    config.headers = config.headers ?? {};
    (config.headers as any)['x-telegram-init-data'] = wa.initData;
  }
  return config;
});

export type Category = { id: number; name: string; slug: string };
export type ProductImage = { id: number; url: string };
export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: ProductImage[];
  categoryId: number;
};

export type Order = {
  id: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'cancelled';
  items: { id: number; title: string; quantity: number; unitPrice: number }[];
};

export async function fetchCategories() {
  const { data } = await api.get<Category[]>('/categories');
  return data;
}

export async function fetchProducts(params?: { q?: string; categoryId?: number }) {
  const { data } = await api.get<Product[]>('/products', { params });
  return data;
}

export async function fetchProduct(id: number) {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
}

export async function createOrder(payload: {
  items: { productId: number; quantity: number }[];
  address?: unknown;
}) {
  const { data } = await api.post<{ orderId: number; invoiceLink?: string }>(`/orders`, payload);
  return data;
}

export async function fetchMyOrders() {
  const { data } = await api.get<Order[]>(`/orders/my`);
  return data;
}
