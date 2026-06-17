export const getCurrency = (menuCurrency, itemCurrency) => {
  return itemCurrency || menuCurrency || "جنيه";
};

export const formatMoney = (value, currency = "جنيه") => {
  const number = Number(value || 0);
  return `${number.toLocaleString("ar-EG")} ${currency}`;
};
