import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (menu: { id: string; name: string; price: number }, quantity: number) => void;
  removeItem: (menuId: string) => void;
  updateQuantity: (menuId: string, quantity: number) => void;
  clear: () => void;
  getTotalAmount: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (menu, quantity) => {
        set((state) => {
          const existing = state.items.find((item) => item.id === menu.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === menu.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { ...menu, quantity }] };
        });
      },
      removeItem: (menuId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== menuId),
        }));
      },
      updateQuantity: (menuId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === menuId ? { ...item, quantity } : item
          ),
        }));
      },
      clear: () => set({ items: [] }),
      getTotalAmount: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);
