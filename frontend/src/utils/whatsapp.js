import { formatNaira } from "./formatters";

export const buildWhatsAppReceiptUrl = (adminWaNumber, sale, storeName) => {
  const statusLine =
    sale.creditStatus === "UNPAID"
      ? "⚠️ CREDIT SALE (UNPAID DEBT)"
      : sale.repaidAt
        ? `✅ CREDIT DEBT REPAID (${sale.repaidAt})`
        : "✅ PAID SALE";

  const itemsText = (sale.items || [])
    .map(
      (it, idx) =>
        `${idx + 1}. ${it.name} (x${it.qty}) - ${formatNaira(
          it.price * it.qty,
        )}${it.imei ? ` [SN: ${it.imei}]` : ""}`,
    )
    .join("\n");

  const message =
    `🧾 *ZEEDCOM STORES (${storeName.toUpperCase()})*\n` +
    `--------------------------------\n` +
    `*Status:* ${statusLine}\n` +
    `*Receipt No:* ${sale.receiptNo}\n` +
    `*Salesperson:* ${sale.staffName}\n` +
    `*Customer:* ${sale.customerName} (${sale.customerPhone})\n` +
    `*Payment Mode:* ${sale.paymentMethod} (${sale.paymentRef})\n` +
    `--------------------------------\n` +
    `*ITEMS:*\n${itemsText}\n` +
    `--------------------------------\n` +
    `💰 *TOTAL: ${formatNaira(sale.totalAmount)}*`;

  return `https://wa.me/${adminWaNumber}?text=${encodeURIComponent(message)}`;
};
