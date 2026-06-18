import { useState } from "react";
import { useCart } from "../context/CartContext";
import QuickViewModal from "./QuickViewModal";

const fallbackImage = "/images/placeholder-food.svg";

export default function MenuCard({ item }) {
  const { addToCart } = useCart();
  const [open, setOpen] = useState(false);

  if (!item) return null;

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
  <div className="card-title-row">
    <h3>{item.name}</h3>

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