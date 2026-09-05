import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
  maxStock: number;
  colorHex?: string;
}

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  savedForLater: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  moveToSaved: (variantId: string) => void;
  moveToCart: (variantId: string) => void;
  removeSaved: (variantId: string) => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  clear: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      couponDiscount: 0,
      savedForLater: [],
      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.variantId === item.variantId);
        if (existing) {
          const newQty = Math.min(existing.quantity + item.quantity, item.maxStock);
          set({
            items: items.map((i) =>
              i.variantId === item.variantId ? { ...i, quantity: newQty } : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },
      removeItem: (variantId) => {
        set({ items: get().items.filter((i) => i.variantId !== variantId) });
      },
      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set({
          items: get().items.map((i) => {
            if (i.variantId === variantId) {
              return { ...i, quantity: Math.min(quantity, i.maxStock) };
            }
            return i;
          }),
        });
      },
      moveToSaved: (variantId) => {
        const item = get().items.find((i) => i.variantId === variantId);
        if (item) {
          set({
            items: get().items.filter((i) => i.variantId !== variantId),
            savedForLater: [...get().savedForLater, item],
          });
        }
      },
      moveToCart: (variantId) => {
        const item = get().savedForLater.find((i) => i.variantId === variantId);
        if (item) {
          set({
            savedForLater: get().savedForLater.filter((i) => i.variantId !== variantId),
          });
          get().addItem(item);
        }
      },
      removeSaved: (variantId) => {
        set({ savedForLater: get().savedForLater.filter((i) => i.variantId !== variantId) });
      },
      applyCoupon: (code, discount) => {
        set({ couponCode: code, couponDiscount: discount });
      },
      removeCoupon: () => {
        set({ couponCode: null, couponDiscount: 0 });
      },
      clear: () => {
        set({ items: [], couponCode: null, couponDiscount: 0 });
      },
      getSubtotal: () => {
        return get().items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
      },
      getTotalItems: () => {
        return get().items.reduce((acc, i) => acc + i.quantity, 0);
      },
    }),
    { name: 'moda-center-cart', partialize: (state) => ({ ...state }) }
  )
);

interface FilterState {
  search: string;
  category: string | null;
  sizes: string[];
  colors: string[];
  brands: string[];
  priceMin: number | null;
  priceMax: number | null;
  orderBy: string;
  toggleSize: (s: string) => void;
  toggleColor: (c: string) => void;
  toggleBrand: (b: string) => void;
  setSearch: (s: string) => void;
  setCategory: (c: string | null) => void;
  setPriceMin: (n: number | null) => void;
  setPriceMax: (n: number | null) => void;
  setOrderBy: (v: string) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      search: '',
      category: null,
      sizes: [],
      colors: [],
      brands: [],
      priceMin: null,
      priceMax: null,
      orderBy: 'relevance',
      toggleSize: (s) =>
        set((st) => ({
          sizes: st.sizes.includes(s) ? st.sizes.filter((x) => x !== s) : [...st.sizes, s],
        })),
      toggleColor: (c) =>
        set((st) => ({
          colors: st.colors.includes(c) ? st.colors.filter((x) => x !== c) : [...st.colors, c],
        })),
      toggleBrand: (b) =>
        set((st) => ({
          brands: st.brands.includes(b) ? st.brands.filter((x) => x !== b) : [...st.brands, b],
        })),
      setSearch: (s) => set({ search: s }),
      setCategory: (c) => set({ category: c }),
      setPriceMin: (n) => set({ priceMin: n }),
      setPriceMax: (n) => set({ priceMax: n }),
      setOrderBy: (v) => set({ orderBy: v }),
      reset: () =>
        set({
          search: '',
          category: null,
          sizes: [],
          colors: [],
          brands: [],
          priceMin: null,
          priceMax: null,
          orderBy: 'relevance',
        }),
    }),
    { name: 'moda-center-filters' }
  )
);
