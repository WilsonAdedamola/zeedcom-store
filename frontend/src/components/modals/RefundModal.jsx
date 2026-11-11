import React, { useState, useEffect } from "react";
import { RotateCcw, X, PackageCheck, PackageX } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { formatNaira } from "../../utils/formatters";

export default function RefundModal() {
  const {
    refundModalSale,
    setRefundModalSale,
    processSaleRefund,
    requestConfirm,
  } = useAuth();

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [refundQty, setRefundQty] = useState(1);
  const [restockChoice, setRestockChoice] = useState("RESTOCK"); // 'RESTOCK' | 'KEEP_SAME'
  const [refundReason, setRefundReason] = useState("Defective / Bad Product");

  useEffect(() => {
    if (refundModalSale) {
      const firstRefundableIdx = (refundModalSale.items || []).findIndex(
        (it) => it.qty - (it.refundedQty || 0) > 0
      );
      setSelectedItemIndex(firstRefundableIdx >= 0 ? firstRefundableIdx : 0);
      setRefundQty(1);
      setRestockChoice("KEEP_SAME");
      setRefundReason("Defective / Bad Product");
    }
  }, [refundModalSale]);

  if (!refundModalSale) return null;

  const items = refundModalSale.items || [];
  const targetItem = items[selectedItemIndex] || items[0];
  const availableToRefund = targetItem
    ? Math.max(0, targetItem.qty - (targetItem.refundedQty || 0))
    : 0;
  const refundAmount = targetItem ? Number(targetItem.price) * refundQty : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetItem || availableToRefund <= 0) return;

    const shouldRestock = restockChoice === "RESTOCK";

    requestConfirm({
      title: "Confirm Product Refund",
      message: `You are refunding ${refundQty}x "${
        targetItem.name
      }" (${formatNaira(
        refundAmount
      )}). This amount will be deducted from total sales, and stock will ${
        shouldRestock
          ? "RETURN to its previous shelf quantity (+ " + refundQty + ")"
          : "REMAIN THE SAME (not added back to stock)"
      }. Proceed?`,
      confirmText: "Yes, Confirm Refund",
      variant: "danger",
      onConfirm: async () => {
        await processSaleRefund({
          sale: refundModalSale,
          itemIndex: selectedItemIndex,
          refundQty: Number(refundQty),
          restock: shouldRestock,
          reason: refundReason,
        });
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-[#212121]/75 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FFFFFF] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-100 text-red-600">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#212121]">
                Refund Sold Product
              </h3>
              <p className="text-[11px] text-[#9E9E9E]">
                Receipt: {refundModalSale.receiptNo} • Customer:{" "}
                {refundModalSale.customerName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setRefundModalSale(null)}
            className="text-[#9E9E9E] hover:text-[#212121]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Select Product to Refund */}
        <div>
          <label className="text-[10px] font-bold uppercase text-[#9E9E9E] block mb-1">
            Select Sold Product to Refund
          </label>
          <select
            value={selectedItemIndex}
            onChange={(e) => {
              setSelectedItemIndex(Number(e.target.value));
              setRefundQty(1);
            }}
            className="w-full px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl font-bold text-[#212121]"
          >
            {items.map((it, idx) => {
              const rem = Math.max(0, it.qty - (it.refundedQty || 0));
              return (
                <option key={idx} value={idx} disabled={rem <= 0}>
                  {it.name} — {formatNaira(it.price)} each (
                  {rem > 0 ? `${rem} refundable` : "Already Refunded"})
                </option>
              );
            })}
          </select>
        </div>

        {/* 2. Quantity & Reason */}
        {availableToRefund > 0 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-[#9E9E9E] block mb-1">
                  Quantity Returning (Max: {availableToRefund})
                </label>
                <input
                  type="number"
                  min={1}
                  max={availableToRefund}
                  required
                  value={refundQty}
                  onChange={(e) =>
                    setRefundQty(
                      Math.min(
                        availableToRefund,
                        Math.max(1, Number(e.target.value))
                      )
                    )
                  }
                  className="w-full px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl font-black text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-[#9E9E9E] block mb-1">
                  Reason for Refund
                </label>
                <input
                  type="text"
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="e.g. Bad screen / Touch issue"
                  className="w-full px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl font-medium"
                />
              </div>
            </div>

            {/* 3. Stock Quantity Decision (Return to Previous Qty vs Remain the Same) */}
            <div>
              <label className="text-[10px] font-bold uppercase text-[#9E9E9E] block mb-1.5">
                What should happen to the Store Stock Quantity?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRestockChoice("RESTOCK")}
                  className={`p-3 rounded-2xl border text-left transition flex items-start gap-2.5 ${
                    restockChoice === "RESTOCK"
                      ? "border-2 border-[#344ABF] bg-[#344ABF]/5"
                      : "border-[#9E9E9E]/30 bg-[#FFFFFF]"
                  }`}
                >
                  <PackageCheck className="w-5 h-5 text-[#344ABF] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-[#212121]">
                      Return to Previous Qty
                    </p>
                    <p className="text-[11px] text-[#9E9E9E] mt-0.5">
                      Add +{refundQty} back into store inventory shelf.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRestockChoice("KEEP_SAME")}
                  className={`p-3 rounded-2xl border text-left transition flex items-start gap-2.5 ${
                    restockChoice === "KEEP_SAME"
                      ? "border-2 border-red-600 bg-red-50/50"
                      : "border-[#9E9E9E]/30 bg-[#FFFFFF]"
                  }`}
                >
                  <PackageX className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-[#212121]">
                      Remain the Same
                    </p>
                    <p className="text-[11px] text-[#9E9E9E] mt-0.5">
                      Product is bad/damaged. Do not add back to stock.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* 4. Financial Deduction Preview */}
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-red-700 block">
                  Amount Deducted from Total Sales
                </span>
                <span className="text-[11px] text-red-600">
                  Original Bill: {formatNaira(refundModalSale.totalAmount)} → New
                  Total:{" "}
                  {formatNaira(
                    Math.max(0, refundModalSale.totalAmount - refundAmount)
                  )}
                </span>
              </div>
              <span className="text-lg font-black text-red-700">
                - {formatNaira(refundAmount)}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-[#FFFFFF] font-black rounded-xl shadow-lg transition"
            >
              Process Refund & Deduct {formatNaira(refundAmount)}
            </button>
          </>
        )}
      </form>
    </div>
  );
}