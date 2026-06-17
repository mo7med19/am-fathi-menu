import menu from "../data/menu2.json";
import { formatMoney } from "./money";

const cleanWhatsAppNumber = (value = "") => {
  return String(value).replace(/[^0-9]/g, "");
};

export const getWhatsAppNumber = () => {
  return cleanWhatsAppNumber(menu.whatsapp || menu.phone || "");
};

const formatOptions = (item) => {
  const parts = [];

  if (item.notes) {
    parts.push(`ملاحظات: ${item.notes}`);
  }

  return parts.length ? `\n   ${parts.join(" | ")}` : "";
};

export const calculateCartTotal = (cart = []) => {
  return cart.reduce((sum, item) => {
    const price = Number(item.unitPrice || 0);
    const qty = Number(item.qty || 0);
    return sum + price * qty;
  }, 0);
};

export const formatOrderMessage = ({ cart, customer }) => {
  const currency = menu.currency || "جنيه";
  const total = calculateCartTotal(cart);
  const now = new Date().toLocaleString("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  const lines = cart.map((item, index) => {
    const lineTotal = Number(item.unitPrice || 0) * Number(item.qty || 0);
    return `${index + 1}) ${item.name}\n   الكمية: ${item.qty}\n   سعر الوحدة: ${formatMoney(item.unitPrice, item.currency || currency)}\n   الإجمالي: ${formatMoney(lineTotal, item.currency || currency)}${formatOptions(item)}`;
  });

  return [
    `طلب جديد من منيو ${menu.restaurantName || "المطعم"}`,
    "------------------------------",
    `الوقت: ${now}`,
    `الاسم: ${customer.name}`,
    `الموبايل: ${customer.phone}`,
    customer.address ? `العنوان: ${customer.address}` : null,
    customer.orderNotes ? `ملاحظات عامة: ${customer.orderNotes}` : null,
    "------------------------------",
    "تفاصيل الطلب:",
    lines.join("\n\n"),
    "------------------------------",
    `الإجمالي النهائي: ${formatMoney(total, currency)}`
  ].filter(Boolean).join("\n");
};

export const buildWhatsAppUrl = ({ cart, customer }) => {
  const number = getWhatsAppNumber();
  const message = formatOrderMessage({ cart, customer });

  if (!number) {
    return null;
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};
