import { createContext, useContext, useEffect, useMemo, useState } from "react";
import menu from "../data/menu2.json";
import { calculateCartTotal } from "../utils/formatOrder";

const CartContext = createContext(null);

const STORAGE_KEY = "restaurant_menu_cart_v2";

/* =========================
   SAFE KEY GENERATION
========================= */
const createCartKey = (item, variant, options = {}) => {
  const itemId = item?.id ?? "unknown";
  const variantKey = variant?.id ?? "default";
  const notesKey = (options.notes || "").trim().toLowerCase();

  const addonsKey = Array.isArray(options.addons)
    ? options.addons
        .map((addon) => addon.id)
        .filter(Boolean)
        .sort()
        .join("_")
    : "no_addons";

  return `${itemId}::${variantKey}::${addonsKey}::${notesKey}`;
};

/* =========================
   NORMALIZE ADDONS
========================= */
const normalizeAddons = (addons = []) => {
  if (!Array.isArray(addons)) return [];

  return addons.map((addon) => ({
    id: addon.id,
    name: addon.name,
    price: Number(addon.price || 0)
  }));
};

/* =========================
   NORMALIZE ITEM
========================= */
const normalizeCartItem = (item, variant = null, options = {}, qty = 1) => {
  const addons = normalizeAddons(options.addons);

  const basePrice = Number(variant?.price ?? item?.price ?? 0);

  const addonsTotal = addons.reduce((sum, addon) => {
    return sum + Number(addon.price || 0);
  }, 0);

  const unitPrice = basePrice + addonsTotal;

  return {
    key: createCartKey(item, variant, options),

    id: item?.id ?? "unknown",
    name: item?.name ?? "",
    variant: variant?.name ?? "",
    image: item?.image ?? "",
    currency: item?.currency || menu.currency || "EGP",

    basePrice,
    addons,
    addonsTotal,
    unitPrice,

    qty: Math.max(1, Number(qty || 1)),
    notes: (options.notes || "").trim()
  };
};

/* =========================
   CONTEXT PROVIDER
========================= */
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      if (typeof window === "undefined") return [];

      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Cart load error:", e);
      return [];
    }
  });

  /* =========================
     SYNC TO LOCAL STORAGE
  ========================= */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Cart save error:", e);
    }
  }, [cart]);

  /* =========================
     ADD TO CART
  ========================= */
  const addToCart = (item, variant = null, options = {}, qty = 1) => {
    if (!item || item.isAvailable === false) return;

    const nextItem = normalizeCartItem(item, variant, options, qty);

    setCart((prev) => {
      const existing = prev.find((entry) => entry.key === nextItem.key);

      if (existing) {
        return prev.map((entry) =>
          entry.key === nextItem.key
            ? {
                ...entry,
                qty: entry.qty + nextItem.qty
              }
            : entry
        );
      }

      return [...prev, nextItem];
    });
  };

  /* =========================
     QUANTITY CONTROL
  ========================= */
  const increaseQty = (key) => {
    setCart((prev) =>
      prev.map((item) =>
        item.key === key
          ? {
              ...item,
              qty: item.qty + 1
            }
          : item
      )
    );
  };

  const decreaseQty = (key) => {
    setCart((prev) =>
      prev.map((item) =>
        item.key === key
          ? {
              ...item,
              qty: Math.max(1, item.qty - 1)
            }
          : item
      )
    );
  };

  /* =========================
     REMOVE / CLEAR
  ========================= */
  const removeFromCart = (key) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const clearCart = () => {
    setCart([]);
  };

  /* =========================
     DERIVED STATE
  ========================= */
  const total = useMemo(() => {
    return calculateCartTotal(cart);
  }, [cart]);

  const count = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  }, [cart]);

  /* =========================
     VALUE
  ========================= */
  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        count,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/* =========================
   HOOK
========================= */
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};