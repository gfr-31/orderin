import { create } from "zustand";

const useCartStore = create((set, get) => ({
  items: [],
  deliveryAddres: "",

  addItem: (menuItem) => {
    const items = get().items;
    const existing = items.find((i) => i.id === menuItem.id);

    if (existing) {
      set({
        items: items.map((i) =>
          i.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      });
    } else {
      set({ items: [...items, { ...menuItem, quantity: 1 }] });
    }
  },

  removeItem: (id) => {
    set({ items: get().items.filter((i) => i.id !== id) });
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      set({ items: get().items.filter((i) => i.id !== id) });
    } else {
      set({
        item: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
      });
    }
  },

  clearCart: () => set({ items: [] }),

  setDeliveryAddres: (address) => set({ deliveryAddres: address }),

  getSubtotal: () => {
    return get().items.reduce((sum, i) => (sum = i.price * i.quantity), 0);
  },

  getTax: () => {
    return get().getSubtotal * 0.11;
  },

  getTotal: () => {
    return get().getSubtotal() + get().getTax();
  },

  getTotalItem: () => {
    return get().items.reduce((sum, i) => sum + i.quantity, 0);
  },
}));

export default useCartStore;
