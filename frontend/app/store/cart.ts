import { create } from 'zustand';

export type CartItem = {
  productId: number;
  title: string;
  price: number; // minor units
  quantity: number;
  image?: string;
};

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (productId: number) => void;
  clear: () => void;
  total: () => number;
};

export const useCart = create<CartState>((set, get) => ({
  items: [],
  add: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  remove: (productId) => set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));
