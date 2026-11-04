import React from "react";
import { CheckCircle2, Printer, MessageSquare, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { formatNaira } from "../../utils/formatters";
import { buildWhatsAppReceiptUrl } from "../../utils/whatsapp";

export default function ReceiptWhatsAppModal() {
  const {
    receiptModalData,
    setReceiptModalData,
    getStoreName,
    adminWaNumber,
  } = useAuth();

  if (!receiptModalData) return null;

  const storeName = getStoreName(receiptModalData.storeId);
  const waUrl = buildWhatsAppReceiptUrl(
    adminWaNumber,
    receiptModalData,
    storeName
  );

  return (
    <div className="fixed inset-0 bg-[#212121]/75 flex items-center justify-center p-4 z-50">
      <div className="bg-[#FFFFFF] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#344ABF] font-black text-base">
            <CheckCircle2 className="w-6 h-6" />
            <span>
              {receiptModalData.creditStatus === "UNPAID"
                ? "Credit Alert Dispatched!"
                : "WhatsApp Receipt Dispatched!"}
            </span>
          </div>
          <button
            onClick={() => setReceiptModalData(null)}
            className="p-1 rounded-lg text-[#9E9E9E] hover:text-[#212121]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable & WhatsApp Formatted Receipt */}
        <div
          id="printable-receipt"
          className="bg-[#F5F6FA] border border-[#9E9E9E]/30 rounded-2xl p-4 font-mono text-xs text-[#212121] space-y-1.5"
        >
          <p className="font-black text-[#344ABF]">
            🧾 *ZEEDCOM STORES - {storeName.toUpperCase()}*
          </p>
          <p>
            Status:{" "}
            <strong>
              {receiptModalData.creditStatus === "UNPAID"
                ? "⚠️ SOLD ON CREDIT (UNPAID)"
                : receiptModalData.repaidAt
                ? "✅ CREDIT DEBT REPAID"
                : "✅ PAID SALE"}
            </strong>
          </p>
          <p>Receipt No: *{receiptModalData.receiptNo}*</p>
          <p>Salesperson: *{receiptModalData.staffName}*</p>
          <p>
            Customer: {receiptModalData.customerName} (
            {receiptModalData.customerPhone})
          </p>
          <p>
            Payment Mode: *{receiptModalData.paymentMethod}* (
            {receiptModalData.paymentRef})
          </p>
          <div className="border-t border-[#9E9E9E]/30 my-2 pt-2 space-y-1">
            {receiptModalData.items.map((it, idx) => (
              <div key={idx}>
                <p className="font-bold">
                  {idx + 1}. {it.name} (x{it.qty}) -{" "}
                  {formatNaira(it.price * it.qty)}
                </p>
                {it.imei && (
                  <p className="text-[10px] text-[#9E9E9E]">
                    IMEI/SN: {it.imei}
                  </p>
                )}
              </div>
            ))}
          </div>
          <p className="font-black text-sm pt-1 border-t border-[#9E9E9E]/30">
            💰{" "}
            {receiptModalData.creditStatus === "UNPAID"
              ? "TOTAL OWED:"
              : "TOTAL PAID:"}{" "}
            {formatNaira(receiptModalData.totalAmount)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs font-black">
          <button
            onClick={() => window.print()}
            className="py-3 bg-[#F5F6FA] hover:bg-[#9E9E9E]/20 text-[#212121] rounded-xl flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print 80mm</span>
          </button>
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="py-3 bg-[#344ABF] text-[#FFFFFF] rounded-xl flex items-center justify-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send to WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}