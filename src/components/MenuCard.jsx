import { useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import menu from "../data/menu2.json";
import { formatMoney } from "../utils/money";
import QuickViewModal from "./QuickViewModal";

const fallbackImage = "/images/placeholder-food.svg";

export default function MenuCard({ item }) {
  const { addToCart } = useCart();
  const [open, setOpen] = useState(false);

  if (!item) return null;

  const priceLabel = useMemo(() => {
    const price = Number(item.price ?? 0);
    const currency = item.currency || menu.currency || "EGP";

    return formatMoney(price, currency);
  }, [item.price, item.currency]);

  const imageSrc =
    typeof item.image === "string" && item.image.trim()
      ? item.image.trim()
      : fallbackImage;

  const handleQuickAdd = () => {
    if (item.hasVariants) {
      setOpen(true);
    } else {
      addToCart(item);
    }
  };

  return (
    <>
      <article className="menu-card">
        <button
          type="button"
          className="image-btn"
          onClick={() => setOpen(true)}
          aria-label={`View ${item.name}`}
        >
          <img src={imageSrc} alt={item.name || "Menu item"} />
        </button>

        <div className="content">
          <h3>{item.name}</h3>

          <div className="bottom">
            <span>{priceLabel}</span>

            <button type="button" className="add-btn" onClick={handleQuickAdd}>
              +
            </button>
          </div>
        </div>
      </article>

      {open && (
        <QuickViewModal item={item} onClose={() => setOpen(false)} />
      )}
    </>
  );
}