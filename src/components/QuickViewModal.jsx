import { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import menu from "../data/menu2.json";
import { formatMoney } from "../utils/money";

const fallbackImage = "/images/placeholder-food.svg";

export default function QuickViewModal({ item, onClose }) {
  const { addToCart } = useCart();

  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);

  /* Reset when item changes */
  useEffect(() => {
    setQty(1);
    setNotes("");
    setSelectedVariant(null);
  }, [item?.id]);

  /* ESC close */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!item) return null;

  const price = Number(selectedVariant?.price ?? item?.price ?? 0);

  const lineTotal = useMemo(() => price * qty, [price, qty]);

  const imageSrc =
    typeof item.image === "string" && item.image.trim()
      ? item.image.trim()
      : fallbackImage;

  const handleAdd = () => {
    console.log("ADD CLICKED", item, selectedVariant, qty);

    // لو فيه variants لازم اختيار واحد
    if (item.hasVariants) {
      if (!selectedVariant) {
        alert("من فضلك اختر النوع/الحجم أولاً");
        return;
      }

      addToCart(item, selectedVariant, { notes }, qty);
    } else {
      addToCart(item, null, { notes }, qty);
    }

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
            {item.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={selectedVariant?.id === v.id ? "active" : ""}
              >
                {v.name} -{" "}
                {formatMoney(v.price, item.currency || menu.currency)}
              </button>
            ))}
          </div>
        )}

        {/* Price */}
        <p className="price">
          {formatMoney(price, item.currency || menu.currency)}
        </p>

        {/* Qty */}
        <div className="qty-row">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))}>
            −
          </button>

          <strong>{qty}</strong>

          <button onClick={() => setQty((q) => q + 1)}>
            +
          </button>
        </div>

        {/* Notes */}
        <textarea
          placeholder="ملاحظات"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Add button */}
        <button
          className="primary-btn"
          onClick={handleAdd}
          disabled={item.hasVariants && !selectedVariant}
        >
          إضافة للسلة -{" "}
          {formatMoney(lineTotal, item.currency || menu.currency)}
        </button>

      </div>
    </div>
  );
}