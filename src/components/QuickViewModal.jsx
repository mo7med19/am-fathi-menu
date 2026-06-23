import { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import menu from "../data/menu2.json";
import { formatMoney } from "../utils/money";

const fallbackImage = "/images/placeholder-food.svg";

/* =========================
   FIND CATEGORY BY ITEM ID
   يبحث داخل menu2.json عن القسم الذي يحتوي المنتج
========================= */
const findCategoryByItemId = (data, itemId) => {
  if (!data || !itemId) return null;

  if (Array.isArray(data)) {
    for (const entry of data) {
      const result = findCategoryByItemId(entry, itemId);
      if (result) return result;
    }

    return null;
  }

  if (typeof data === "object") {
    if (
      Array.isArray(data.items) &&
      data.items.some((product) => product?.id === itemId)
    ) {
      return data;
    }

    for (const value of Object.values(data)) {
      if (value && (Array.isArray(value) || typeof value === "object")) {
        const result = findCategoryByItemId(value, itemId);
        if (result) return result;
      }
    }
  }

  return null;
};

export default function QuickViewModal({ item, onClose }) {
  const { addToCart } = useCart();

  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);

  /* =========================
     CURRENT CATEGORY
  ========================= */
  const itemCategory = useMemo(() => {
    return findCategoryByItemId(menu, item?.id);
  }, [item?.id]);

  /* =========================
     ADDONS
     يأخذ الإضافات من المنتج نفسه أو من القسم
  ========================= */
  const addons = useMemo(() => {
    if (Array.isArray(item?.addons) && item.addons.length > 0) {
      return item.addons;
    }

    if (Array.isArray(itemCategory?.addons) && itemCategory.addons.length > 0) {
      return itemCategory.addons;
    }

    return [];
  }, [item, itemCategory]);

  /* =========================
     SELECTED ADDONS OBJECTS
  ========================= */
  const selectedAddonObjects = useMemo(() => {
    return addons.filter((addon) => selectedAddons.includes(addon.id));
  }, [addons, selectedAddons]);

  /* =========================
     PRICE CALCULATION
  ========================= */
  const basePrice = Number(selectedVariant?.price ?? item?.price ?? 0);

  const addonsTotal = useMemo(() => {
    return selectedAddonObjects.reduce((sum, addon) => {
      return sum + Number(addon.price || 0);
    }, 0);
  }, [selectedAddonObjects]);

  const unitPrice = basePrice + addonsTotal;

  const lineTotal = useMemo(() => {
    return unitPrice * qty;
  }, [unitPrice, qty]);

  const currency = item?.currency || menu.currency || "جنيه";

  /* =========================
     RESET WHEN ITEM CHANGES
  ========================= */
  useEffect(() => {
    setQty(1);
    setNotes("");
    setSelectedVariant(null);
    setSelectedAddons([]);
  }, [item?.id]);

  /* =========================
     ESC CLOSE
  ========================= */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!item) return null;

  const imageSrc =
    typeof item.image === "string" && item.image.trim()
      ? item.image.trim()
      : fallbackImage;

  /* =========================
     TOGGLE ADDON
  ========================= */
  const toggleAddon = (addonId) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  /* =========================
     ADD TO CART
  ========================= */
  const handleAdd = () => {
    if (item.hasVariants && !selectedVariant) {
      alert("من فضلك اختر النوع/الحجم أولاً");
      return;
    }

    addToCart(
      item,
      selectedVariant,
      {
        notes,
        addons: selectedAddonObjects,
        basePrice,
        addonsTotal
      },
      qty
    );

    onClose?.();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <img src={imageSrc} alt={item?.name || "item"} />

        <h2>{item?.name}</h2>

        {/* Variants */}
        {item.hasVariants && Array.isArray(item.variants) && (
          <div className="variants">
            {item.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariant(variant)}
                className={selectedVariant?.id === variant.id ? "active" : ""}
              >
                {variant.name} - {formatMoney(variant.price, currency)}
              </button>
            ))}
          </div>
        )}

        {/* Base Price */}
        <p className="price">{formatMoney(basePrice, currency)}</p>

        {/* Addons */}
        {addons.length > 0 && (
          <div className="addons-section">
            <h4>الإضافات</h4>

            {addons.map((addon) => (
              <label key={addon.id} className="addon-row">
                <input
                  type="checkbox"
                  checked={selectedAddons.includes(addon.id)}
                  onChange={() => toggleAddon(addon.id)}
                />

                <span>{addon.name}</span>

                <strong>
                  + {formatMoney(Number(addon.price || 0), currency)}
                </strong>
              </label>
            ))}
          </div>
        )}

        {/* Qty */}
        <div className="qty-row">
          <button
            type="button"
            onClick={() => setQty((currentQty) => Math.max(1, currentQty - 1))}
          >
            −
          </button>

          <strong>{qty}</strong>

          <button
            type="button"
            onClick={() => setQty((currentQty) => currentQty + 1)}
          >
            +
          </button>
        </div>

        {/* Notes */}
        <textarea
          placeholder="ملاحظات"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Add Button */}
        <button
          type="button"
          className="primary-btn"
          onClick={handleAdd}
          disabled={item.hasVariants && !selectedVariant}
        >
          إضافة للسلة - {formatMoney(lineTotal, currency)}
        </button>
      </div>
    </div>
  );
}