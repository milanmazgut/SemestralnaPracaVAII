import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Rozhranie jednej položky v košíku */
interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  dimensions?: string[];
  dimensionsKey?: string;
}

interface CartState {
  items: CartItem[];

  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;

  removeItem: (productId: number, dimensionsKey?: string) => void;

  clearCart: () => void;

  updateItemQuantity: (
    productId: number,
    dimensionsKey: string,
    newQty: number
  ) => void;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      /**
       * addItem:
       * - Ak v košíku existuje rovnaký (productId) + (dimensionsKey),
       *   zvýšime quantity
       * - Inak pridáme ako novú položku
       */
      addItem: (item) => {
        const { items } = get();
        const newDimensionsKey = item.dimensionsKey ?? "";

        const existingItemIndex = items.findIndex(
          (i) =>
            i.productId === item.productId &&
            (i.dimensionsKey ?? "") === newDimensionsKey
        );

        if (existingItemIndex !== -1) {
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += item.quantity ?? 1;
          set({ items: updatedItems });
        } else {
          set({
            items: [
              ...items,
              {
                ...item,
                quantity: item.quantity ?? 1,
                dimensionsKey: newDimensionsKey,
              },
            ],
          });
        }
      },

      /**
       * removeItem:
       * - Vymaže položku s daným productId a dimensionsKey (ak existuje)
       */
      removeItem: (productId, dimensionsKey = "") => {
        set({
          items: get().items.filter(
            (item) =>
              !(
                item.productId === productId &&
                (item.dimensionsKey ?? "") === dimensionsKey
              )
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      updateItemQuantity: (productId, dimensionsKey = "", newQty) => {
        set((state) => {
          // Ak by niekto zadal 0 alebo menej mazeme
          if (newQty <= 0) {
            return {
              items: state.items.filter(
                (item) =>
                  !(
                    item.productId === productId &&
                    (item.dimensionsKey ?? "") === dimensionsKey
                  )
              ),
            };
          }

          const updatedItems = state.items.map((item) => {
            if (
              item.productId === productId &&
              (item.dimensionsKey ?? "") === dimensionsKey
            ) {
              return { ...item, quantity: newQty };
            }
            return item;
          });
          return { items: updatedItems };
        });
      },
    }),
    {
      name: "cart-storage", // localStorage key
    }
  )
);

export default useCartStore;
