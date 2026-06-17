import { useCart } from "../context/CartContext";
import menu from "../data/menu2.json";
import { formatMoney } from "../utils/money";

export default function FloatingCart({ onOpen }) {
  const { count, total } = useCart();

  if (count === 0) return null;

  return (
    <button className="cart-btn" type="button" onClick={onOpen}>
      <span>🛒 {count} صنف</span>
      <strong>{formatMoney(total, menu.currency)}</strong>
    </button>
  );
}
