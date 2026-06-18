import menu from "../data/menu2.json";

function normalizeWhatsAppNumber(number = "") {
  let cleaned = String(number).replace(/\D/g, "");

  // لو الرقم مكتوب 01012345678 نحوله تلقائيًا إلى 201012345678
  if (cleaned.startsWith("0")) {
    cleaned = `2${cleaned}`;
  }

  // لو الرقم مكتوب 00201012345678 نحوله إلى 201012345678
  if (cleaned.startsWith("00")) {
    cleaned = cleaned.slice(2);
  }

  return cleaned;
}

export function getWhatsAppNumber() {
  return normalizeWhatsAppNumber(menu.whatsappNumber || "");
}

export function buildWhatsAppUrl({ cart, customer }) {
  const whatsappNumber = getWhatsAppNumber();

  const lines = [
    "طلب جديد من منيو عم فتحي",
    "-------------------------",
    `الاسم: ${customer.name}`,
    `رقم العميل: ${customer.phone}`,
    customer.address ? `العنوان: ${customer.address}` : "",
    customer.orderNotes ? `ملاحظات عامة: ${customer.orderNotes}` : "",
    "",
    "تفاصيل الطلب:",
    ...cart.map((item) => {
      const variant = item.variant ? ` - ${item.variant}` : "";
      const notes = item.notes ? ` | ملاحظات: ${item.notes}` : "";

      return `- ${item.name}${variant} × ${item.qty} = ${
        item.unitPrice * item.qty
      } ${item.currency || menu.currency}${notes}`;
    })
  ].filter(Boolean);

  const message = encodeURIComponent(lines.join("\n"));

  return `https://wa.me/${whatsappNumber}?text=${message}`;
}