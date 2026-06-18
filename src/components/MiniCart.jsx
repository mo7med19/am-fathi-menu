import { useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import menu from "../data/menu2.json";
import { buildWhatsAppUrl, getWhatsAppNumber } from "../utils/formatOrder";
import { formatMoney } from "../utils/money";

export default function MiniCart({ open, onClose }) {
  const {
    cart,
    total,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart
  } = useCart();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    orderNotes: ""
  });

  const [error, setError] = useState("");

  const canSend = useMemo(() => {
    return cart.length > 0 && customer.name.trim() && customer.phone.trim();
  }, [cart.length, customer.name, customer.phone]);

  const updateField = (field, value) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const sendOrder = () => {
    if (!cart.length) {
      setError("السلة فارغة.");
      return;
    }

    if (!customer.name.trim() || !customer.phone.trim()) {
      setError("اكتب الاسم ورقم الموبايل قبل إرسال الطلب.");
      return;
    }

    const whatsappNumber = getWhatsAppNumber();
    if (!whatsappNumber) {
      setError("رقم واتساب غير موجود في ملف menu.json.");
      return;
    }

    const url = buildWhatsAppUrl({ cart, customer });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {open && <div onClick={onClose} className="cart-backdrop" />}

      <aside className={`mini-cart ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="cart-header">
          <div>
            <strong>السلة</strong>
            <small>{cart.length} صنف مختلف</small>
          </div>
          <button type="button" className="close-btn small" onClick={onClose}>×</button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <p className="empty">السلة فارغة حاليًا.</p>
          ) : (
            cart.map((item) => (
              <div key={item.key} className="cart-item">
                <div className="cart-info">

                  {/* ✔️ اسم المنتج + Variant */}
                  <strong>
                    {item.name}
                    {item.variant ? ` - ${item.variant}` : ""}
                  </strong>

                  {/* ✔️ ملاحظات */}
                  {item.notes && (
                    <small>ملاحظات: {item.notes}</small>
                  )}

                  {/* ✔️ سعر الوحدة */}
                  <span>
                    {formatMoney(item.unitPrice, item.currency)} للوحدة
                  </span>

                  {/* ✔️ إجمالي العنصر */}
                  <div className="item-total">
                    <strong>
                      {formatMoney(item.unitPrice * item.qty, item.currency)}
                    </strong>
                  </div>

                </div>

                <div className="cart-actions">
                  <div className="qty-controls mini">
                    <button type="button" onClick={() => decreaseQty(item.key)}>−</button>
                    <strong>{item.qty}</strong>
                    <button type="button" onClick={() => increaseQty(item.key)}>+</button>
                  </div>

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeFromCart(item.key)}
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))
          )}

          {cart.length > 0 && (
            <>
              <div className="divider" />

              {/* ✔️ الإجمالي العام */}
              <div className="total-row">
                <span>الإجمالي</span>
                <strong>{formatMoney(total, menu.currency)}</strong>
              </div>

              {/* ✔️ بيانات العميل */}
              <div className="checkout-form">
                <input
                  placeholder="اسم العميل"
                  value={customer.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />

                <input
                  placeholder="رقم الموبايل"
                  value={customer.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />

                <input
                  placeholder="العنوان، اختياري"
                  value={customer.address}
                  onChange={(e) => updateField("address", e.target.value)}
                />

                <textarea
                  placeholder="ملاحظات عامة على الطلب، اختياري"
                  value={customer.orderNotes}
                  onChange={(e) => updateField("orderNotes", e.target.value)}
                />
              </div>

              {/* ✔️ خطأ */}
              {error && <p className="form-error">{error}</p>}

              {/* ✔️ إرسال الطلب */}
              <button
                className="primary-btn full"
                type="button"
                onClick={sendOrder}
                disabled={!canSend}
              >
                إرسال الطلب على واتساب
              </button>

              {/* ✔️ مسح السلة */}
              <button
                className="ghost-btn full"
                type="button"
                onClick={clearCart}
              >
                مسح السلة
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
}