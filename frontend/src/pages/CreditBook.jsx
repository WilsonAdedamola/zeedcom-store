import React from "react";
import { useAuth } from "../context/AuthContext";
import { formatNaira } from "../utils/formatters";

export default function CreditBook() {
  const {
    currentRole,
    stores,
    selectedStoreFilter,
    setSelectedStoreFilter,
    effectiveStoreFilter,
    getStoreName,
    kpis,
    unpaidCreditSales,
    filteredSales,
    setRepayModalSale,
    setReceiptModalData,
  } = useAuth();

  const creditTransactions = filteredSales.filter((s) => s.isCredit);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">
            Shared Store Credit Ledger
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#212121] mt-1">
            Products Sold on Credit & Debt Recovery
          </h1>
          <p className="text-xs sm:text-sm text-[#9E9E9E]">
            Visible to any attendant logged into{" "}
            <strong className="text-[#212121]">
              {effectiveStoreFilter === "ALL"
                ? "All Stores"
                : getStoreName(effectiveStoreFilter)}
            </strong>{" "}
            • Repayments automatically add to This Week's Total Sales
          </p>
        </div>

        {currentRole === "admin" && (
          <select
            value={selectedStoreFilter}
            onChange={(e) => setSelectedStoreFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#FFFFFF] border border-[#9E9E9E]/30 rounded-xl text-xs font-bold text-[#212121]"
          >
            <option value="ALL">All Stores ({stores.length})</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Credit Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-amber-50 border-2 border-amber-400 p-5 rounded-2xl">
          <span className="text-xs font-black uppercase text-amber-900">
            Outstanding Unpaid Credit
          </span>
          <p className="text-2xl font-black text-[#212121] mt-1">
            {formatNaira(kpis.unpaidCreditAmount)}
          </p>
          <p className="text-xs text-amber-800 font-semibold mt-1">
            Across {unpaidCreditSales.length} unpaid credit bills
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#9E9E9E]/30 p-5 rounded-2xl">
          <span className="text-xs font-black uppercase text-[#9E9E9E]">
            Total Products Sold on Credit
          </span>
          <p className="text-2xl font-black text-[#212121] mt-1">
            {kpis.unpaidCreditProductCount} Products Out
          </p>
          <p className="text-xs text-[#9E9E9E] mt-1">
            Stock already deducted from store shelf
          </p>
        </div>

        <div className="bg-[#212121] text-[#FFFFFF] p-5 rounded-2xl">
          <span className="text-xs font-black uppercase text-[#9E9E9E]">
            Credit Repaid & Added to Week's Sales
          </span>
          <p className="text-2xl font-black text-[#FFFFFF] mt-1">
            {formatNaira(kpis.repaidCreditTotal)}
          </p>
          <p className="text-xs text-[#9E9E9E] mt-1">
            Rolled into Weekly Collected Total (
            {formatNaira(kpis.weeklyCollectedRev)})
          </p>
        </div>
      </div>

      {/* Credit Transactions List */}
      <div className="bg-[#FFFFFF] border border-[#9E9E9E]/30 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#9E9E9E]/20 flex items-center justify-between">
          <h2 className="font-black text-base text-[#212121]">
            Store Credit & Repayment Records
          </h2>
          <span className="text-xs font-bold text-[#9E9E9E]">
            Click "Record Repayment" when customer pays debt
          </span>
        </div>

        <div className="divide-y divide-[#9E9E9E]/20 text-xs">
          {creditTransactions.length === 0 ? (
            <div className="p-12 text-center text-[#9E9E9E]">
              No credit sales recorded for this store yet.
            </div>
          ) : (
            creditTransactions.map((creditSale) => {
              const isUnpaid = creditSale.creditStatus === "UNPAID";
              return (
                <div
                  key={creditSale.id}
                  className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isUnpaid ? "bg-amber-50/40" : "bg-[#FFFFFF]"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-sm text-[#212121]">
                        {creditSale.receiptNo}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F5F6FA] border border-[#9E9E9E]/30 font-bold text-[#212121]">
                        {getStoreName(creditSale.storeId)}
                      </span>
                      {isUnpaid ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-[#212121] font-black text-[10px] uppercase">
                          ⚠️ UNPAID DEBT
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase">
                          ✓ REPAID & ADDED TO WEEKLY SALES
                        </span>
                      )}
                    </div>

                    <p className="font-black text-sm text-[#212121]">
                      Customer: {creditSale.customerName} •{" "}
                      <span className="text-[#344ABF]">
                        {creditSale.customerPhone}
                      </span>
                    </p>

                    <div className="text-[#212121] font-medium">
                      {creditSale.items.map((it, idx) => (
                        <span key={idx} className="mr-3">
                          • <strong>{it.qty}x</strong> {it.name} (
                          {formatNaira(it.price * it.qty)})
                        </span>
                      ))}
                    </div>

                    <p className="text-[#9E9E9E]">
                      Logged by:{" "}
                      <strong className="text-[#212121]">
                        {creditSale.staffName}
                      </strong>{" "}
                      on {creditSale.timestamp} • Note:{" "}
                      <span className="italic text-[#212121]">
                        "{creditSale.creditNote || creditSale.paymentRef}"
                      </span>
                    </p>

                    {creditSale.repaidAt && (
                      <p className="text-emerald-700 font-bold">
                        ✓ Debt Repaid on {creditSale.repaidAt} via{" "}
                        {creditSale.paymentMethod} (Received by{" "}
                        {creditSale.repaidBy})
                      </p>
                    )}
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0">
                    <span className="text-lg font-black text-[#212121]">
                      {formatNaira(creditSale.totalAmount)}
                    </span>
                    <div className="flex items-center gap-2">
                      {isUnpaid && (
                        <button
                          onClick={() => setRepayModalSale(creditSale)}
                          className="px-4 py-2 bg-[#344ABF] hover:opacity-95 text-[#FFFFFF] rounded-xl font-black text-xs shadow-sm"
                        >
                          ✓ Record Repayment
                        </button>
                      )}
                      <button
                        onClick={() => setReceiptModalData(creditSale)}
                        className="px-3 py-2 bg-[#F5F6FA] border border-[#9E9E9E]/30 text-[#212121] rounded-xl font-bold text-xs"
                      >
                        📲 WA Receipt
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