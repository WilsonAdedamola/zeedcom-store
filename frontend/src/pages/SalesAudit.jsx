import React from "react";
import { useAuth } from "../context/AuthContext";
import { formatNaira } from "../utils/formatters";

export default function SalesAudit() {
  const {
    filteredSales,
    kpis,
    getStoreName,
    setRepayModalSale,
    setReceiptModalData,
  } = useAuth();

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#212121]">
          Weekly Sales Ledger & Payment Reconciliation
        </h1>
        <p className="text-xs sm:text-sm text-[#9E9E9E]">
          Week's Collected Revenue:{" "}
          <strong className="text-[#344ABF]">
            {formatNaira(kpis.weeklyCollectedRev)}
          </strong>{" "}
          • Outstanding Credit:{" "}
          <strong className="text-amber-700">
            {formatNaira(kpis.unpaidCreditAmount)}
          </strong>
        </p>
      </div>

      <div className="bg-[#FFFFFF] border border-[#9E9E9E]/30 rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-[#9E9E9E]/20 text-xs">
          {filteredSales.map((sale) => (
            <div
              key={sale.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-black text-sm text-[#212121]">
                    {sale.receiptNo}
                  </span>
                  <span className="px-2 py-0.5 bg-[#F5F6FA] rounded font-bold">
                    {getStoreName(sale.storeId)}
                  </span>
                  <span className="px-2 py-0.5 bg-[#344ABF]/10 text-[#344ABF] rounded font-bold">
                    Cashier: {sale.staffName}
                  </span>
                  {sale.creditStatus === "UNPAID" ? (
                    <span className="px-2 py-0.5 bg-amber-500 text-[#212121] rounded font-black">
                      UNPAID CREDIT ({sale.paymentRef})
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                      PAID: {sale.paymentMethod} ({sale.paymentRef})
                    </span>
                  )}
                </div>
                <p className="text-[#212121]">
                  {sale.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}
                </p>
                <p className="text-[#9E9E9E]">
                  Customer: {sale.customerName} ({sale.customerPhone}) •{" "}
                  {sale.timestamp}
                </p>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                <span className="text-base font-black text-[#212121]">
                  {formatNaira(sale.totalAmount)}
                </span>
                <div className="flex items-center gap-2">
                  {sale.creditStatus === "UNPAID" && (
                    <button
                      onClick={() => setRepayModalSale(sale)}
                      className="px-3 py-1.5 bg-amber-500 text-[#212121] rounded-xl font-black"
                    >
                      Settle Debt
                    </button>
                  )}
                  <button
                    onClick={() => setReceiptModalData(sale)}
                    className="px-3 py-1.5 bg-[#344ABF] text-[#FFFFFF] rounded-xl font-bold"
                  >
                    📲 Receipt & WA
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}