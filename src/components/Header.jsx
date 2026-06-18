import menu from "../data/menu2.json";
import { useCart } from "../context/CartContext";
import { formatMoney } from "../utils/money";

const logoSrc = "/images/am-fathy-logo.png";

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function getOpenStatus(openTime, closeTime) {
  if (!openTime || !closeTime) {
    return {
      isOpen: false,
      label: "الحالة غير متاحة"
    };
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const openMinutes = timeToMinutes(openTime);
  const closeMinutes = timeToMinutes(closeTime);

  let isOpen;

  if (closeMinutes > openMinutes) {
    isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  } else {
    // لو المعاد بيعدي بعد نص الليل، مثال: 7 صباحًا إلى 12 بعد منتصف الليل
    isOpen = currentMinutes >= openMinutes || currentMinutes < closeMinutes;
  }

  return {
    isOpen,
    label: isOpen ? "مفتوح الآن" : "مغلق الآن"
  };
}

export default function Header({ onOpenCart }) {
  const { count, total } = useCart();

  const openStatus = getOpenStatus(
    menu.openingHours?.open,
    menu.openingHours?.close
  );

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="header-info">
          <p className="eyebrow">{menu.restaurantType || "فول وطعمية"}</p>

          <h1>{menu.restaurantName || "عم فتحي"}</h1>

          <p className="description">
            {menu.description || "أكلات فول وطعمية بطعم زمان"}
          </p>

          <div className={`header-status ${openStatus.isOpen ? "open" : "closed"}`}>
            <span className="status-dot"></span>
            <span>{openStatus.label}</span>
          </div>

          <div className="meta-row">
            {menu.workingHoursText && <span>⏰ {menu.workingHoursText}</span>}
            {menu.phone && <span>☎ {menu.phone}</span>}
            {menu.address && <span>📍 {menu.address}</span>}
          </div>
        </div>

        <div className="header-logo-wrap">
          <img
            src={logoSrc}
            alt={menu.restaurantName || "عم فتحي"}
            className="header-logo"
          />
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