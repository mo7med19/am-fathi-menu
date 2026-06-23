import menu from "../data/menu2.json";

/* =========================
   CART TOTAL
========================= */
export function calculateCartTotal(cart = []) {
  return cart.reduce((sum, item) => {
    const price = Number(item.unitPrice ?? item.price ?? 0);
    const qty = Number(item.qty ?? 1);

    return sum + price * qty;
  }, 0);
}

/* =========================
   WHATSAPP NUMBER NORMALIZE
========================= */
function normalizeWhatsAppNumber(number = "") {
  let cleaned = String(number).replace(/\D/g, "");

  // مثال: 00201012345678 تصبح 201012345678
  if (cleaned.startsWith("00")) {
    cleaned = cleaned.slice(2);
  }

  // مثال: 01012345678 تصبح 201012345678
  if (cleaned.startsWith("0")) {
    cleaned = `2${cleaned}`;
  }

  return cleaned;
}

/* =========================
   GET WHATSAPP NUMBER
========================= */
export function getWhatsAppNumber() {
  return normalizeWhatsAppNumber(menu.whatsappNumber || "");
}

/* =========================
   BUILD WHATSAPP URL
========================= */
export function buildWhatsAppUrl({ cart = [], customer = {} }) {
  const whatsappNumber = getWhatsAppNumber();

  if (!whatsappNumber) {
    return "";
  }

  const total = calculateCartTotal(cart);
  const currency = menu.currency || "";

  const lines = [
    `طلب جديد من ${menu.restaurantName || "المطعم"}`,
    "-------------------------",

    `اسم العميل: ${customer.name || ""}`,
    `رقم العميل: ${customer.phone || ""}`,

    customer.address ? `العنوان: ${customer.address}` : "",

    customer.orderNotes
      ? `ملاحظات عامة على الطلب: ${customer.orderNotes}`
      : "",

    "",
    "تفاصيل الطلب:",

    ...cart.map((item, index) => {
      const variant = item.variant ? ` - ${item.variant}` : "";
      const itemCurrency = item.currency || currency;

      const qty = Number(item.qty || 1);
      const unitPrice = Number(item.unitPrice || 0);
      const basePrice = Number(item.basePrice ?? unitPrice);
      const itemTotal = unitPrice * qty;

      const addons = Array.isArray(item.addons) ? item.addons : [];

      const basePriceText =
        addons.length > 0
          ? `السعر الأساسي: ${basePrice} ${itemCurrency}`
          : "";

      const addonsText =
        addons.length > 0
          ? `الإضافات:
${addons
  .map((addon) => {
    const addonName = addon.name || "";
    const addonPrice = Number(addon.price || 0);

    return `• ${addonName}: +${addonPrice} ${itemCurrency}`;
  })
  .join("\n")}`
          : "";

      const notesText = item.notes
        ? `ملاحظات الصنف: ${item.notes}`
        : "";

      return [
        `${index + 1}) ${item.name}${variant}`,
        `الكمية: ${qty}`,
        basePriceText,
        addonsText,
        `سعر الوحدة: ${unitPrice} ${itemCurrency}`,
        `إجمالي الصنف: ${itemTotal} ${itemCurrency}`,
        notesText
      ]
        .filter(Boolean)
        .join("\n");
    }),

    "",
    "-------------------------",
    `الإجمالي الكلي: ${total} ${currency}`
  ].filter(Boolean);

  const message = encodeURIComponent(lines.join("\n\n"));

  return `https://wa.me/${whatsappNumber}?text=${message}`;
}