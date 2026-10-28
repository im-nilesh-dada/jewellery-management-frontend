export const currency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

export const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const getTotal = (items = []) => {
  if (!Array.isArray(items)) return 0;

  return items.reduce((total, item) => {
    const price = Number(item?.price ?? item?.unitPrice ?? 0);
    const quantity = Number(item?.quantity ?? 0);

    return total + price * quantity;
  }, 0);
};