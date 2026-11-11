import React from "react";
import { RotateCcw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatNaira } from "../utils/formatters";

export default function SalesAudit() {
  const {
    filteredSales,
    kpis,
    getStoreName,
    setRepayModalSale,
    setReceiptModalData,
    setRefundModalSale,
  } = useAuth();

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#212121]">
          Weekly Sales Ledger, Refunds & Payment Reconciliation
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
          {filteredSales.length === 0 ? (
            <div className="p-10 text-center text-[#9E9E9E]">
              No sales recorded yet.
            </div>
          ) : (
            filteredSales.map((sale) => {
              const hasRefundableItems = (sale.items || []).some(
                (it) => it.qty - (it.refundedQty || 0) > 0
              );

              return (
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
                    <div className="text-[#212121] space-y-0.5">
                      {sale.items.map((i, idx) => (
                        <p key={idx}>
                          • <strong>{i.qty}x</strong> {i.name}
                          {i.refundedQty > 0 && (
                            <span className="ml-1.5 px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-black">
                              Refunded: {i.refundedQty}x (
                              {i.restocked ? "Restocked" : "Bad/No-Restock"})
                            </span>
                          )}
                        </p>
                      ))}
                    </div>
                    <p className="text-[#9E9E9E]">
                      Customer: {sale.customerName} ({sale.customerPhone}) •{" "}
                      {sale.timestamp}
                    </p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                    <span className="text-base font-black text-[#212121]">
                      {formatNaira(sale.totalAmount)}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {sale.creditStatus === "UNPAID" &&
                        sale.totalAmount > 0 && (
                          <button
                            onClick={() => setRepayModalSale(sale)}
                            className="px-3 py-1.5 bg-amber-500 text-[#212121] rounded-xl font-black"
                          >
                            Settle Debt
                          </button>
                        )}
                      {hasRefundableItems && (
                        <button
                          onClick={() => setRefundModalSale(sale)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-[#FFFFFF] rounded-xl font-bold inline-flex items-center gap-1 transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Refund</span>
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
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}