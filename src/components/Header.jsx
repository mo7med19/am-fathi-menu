import menu from "../data/menu2.json";
import { useCart } from "../context/CartContext";
import { formatMoney } from "../utils/money";

export default function Header({ onOpenCart }) {
  const { count, total } = useCart();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div>
          <p className="eyebrow">{menu.restaurantType || "منيو إلكتروني"}</p>
          <h1>{menu.restaurantName || "المطعم"}</h1>
          {menu.description && <p className="description">{menu.description}</p>}

          <div className="meta-row">
            {menu.status && <span>{menu.status}</span>}
            {menu.deliveryTime && <span>التوصيل: {menu.deliveryTime}</span>}
            {menu.phone && <span>{menu.phone}</span>}
          </div>
        </div>

        <button className="header-cart" type="button" onClick={onOpenCart}>
          <span>السلة</span>
          <strong>{count}</strong>
          <small>{formatMoney(total, menu.currency)}</small>
        </button>
      </div>
    </header>
  );
}
