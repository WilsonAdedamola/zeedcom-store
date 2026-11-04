import React from "react";
import {
  Store,
  Calendar,
  Banknote,
  Landmark,
  CreditCard,
  HandCoins,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatNaira } from "../utils/formatters";
import LowStockBanner from "../components/layout/LowStockBanner";

export default function AdminDashboard() {
  const {
    stores,
    inventory,
    sales,
    selectedStoreFilter,
    setSelectedStoreFilter,
    kpis,
    filteredSales,
    unpaidCreditSales,
    getStoreName,
    setActivePage,
    setRepayModalSale,
    setReceiptModalData,
  } = useAuth();

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Bar + Store Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#212121]">
            Executive Multi-Store Command
          </h1>
          <p className="text-xs sm:text-sm text-[#9E9E9E]">
            Weekly revenue roll-up, low-stock alerts, credit book & staff audit
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#9E9E9E]/30 px-3 py-2 rounded-xl shadow-sm">
          <Store className="w-4 h-4 text-[#344ABF] shrink-0" />
          <span className="text-xs font-bold text-[#9E9E9E] uppercase">
            Store:
          </span>
          <select
            value={selectedStoreFilter}
            onChange={(e) => setSelectedStoreFilter(e.target.value)}
            className="text-xs sm:text-sm font-black text-[#212121] bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Stores Combined ({stores.length})</option>
            {stores.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* BOLD LOW STOCK BANNER */}
      <LowStockBanner />

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="col-span-2 lg:col-span-1 bg-[#212121] text-[#FFFFFF] p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-[#344ABF]">
            <span className="text-[10px] font-bold uppercase text-[#9E9E9E]">
              Week's Collected Sales
            </span>
            <Calendar className="w-4 h-4 text-[#344ABF]" />
          </div>
          <p className="text-xl font-black mt-1 text-[#FFFFFF]">
            {formatNaira(kpis.weeklyCollectedRev)}
          </p>
          <p className="text-[11px] text-[#9E9E9E] mt-1">
            {kpis.repaidCreditTotal > 0
              ? `Includes ${formatNaira(kpis.repaidCreditTotal)} repaid debt`
              : `${kpis.paidCount} paid transactions`}
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#9E9E9E]/30 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-[#344ABF]">
            <span className="text-[10px] font-bold uppercase text-[#9E9E9E]">
              Cash in Drawer
            </span>
            <Banknote className="w-4 h-4" />
          </div>
          <p className="text-xl font-black text-[#212121] mt-1">
            {formatNaira(kpis.cash)}
          </p>
          <p className="text-[11px] text-[#9E9E9E] mt-1">
            Physical cash collected
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#9E9E9E]/30 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-[#344ABF]">
            <span className="text-[10px] font-bold uppercase text-[#9E9E9E]">
              Bank Transfer
            </span>
            <Landmark className="w-4 h-4" />
          </div>
          <p className="text-xl font-black text-[#212121] mt-1">
            {formatNaira(kpis.transfer)}
          </p>
          <p className="text-[11px] text-[#9E9E9E] mt-1">
            Verified bank alerts
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#9E9E9E]/30 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-[#344ABF]">
            <span className="text-[10px] font-bold uppercase text-[#9E9E9E]">
              POS Terminal
            </span>
            <CreditCard className="w-4 h-4" />
          </div>
          <p className="text-xl font-black text-[#212121] mt-1">
            {formatNaira(kpis.pos)}
          </p>
          <p className="text-[11px] text-[#9E9E9E] mt-1">Card settlements</p>
        </div>

        <div
          onClick={() => setActivePage("credit")}
          className="bg-amber-50 border-2 border-amber-400 p-4 rounded-2xl shadow-sm cursor-pointer hover:bg-amber-100/70 transition"
        >
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-[10px] font-black uppercase">
              Sold on Credit (Debt)
            </span>
            <HandCoins className="w-4 h-4" />
          </div>
          <p className="text-xl font-black text-[#212121] mt-1">
            {formatNaira(kpis.unpaidCreditAmount)}
          </p>
          <p className="text-[11px] text-amber-800 font-bold mt-1">
            {kpis.unpaidCreditProductCount} products unpaid →
          </p>
        </div>

        <div className="bg-[#344ABF]/10 border border-[#344ABF]/30 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase text-[#344ABF]">
            Store Stock Value
          </span>
          <p className="text-xl font-black text-[#212121] mt-1">
            {formatNaira(kpis.stockValue)}
          </p>
          <p className="text-[11px] text-[#344ABF] font-bold mt-1">
            {kpis.totalUnits} total units in stock
          </p>
        </div>
      </div>

      {/* STORE-BY-STORE BREAKDOWN */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-wider text-[#9E9E9E] mb-3">
          Branch-by-Branch Stock, Collected Sales & Credit Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stores.map((st) => {
            const stInv = inventory.filter((i) => i.storeId === st.id);
            const stUnits = stInv.reduce((a, b) => a + b.quantity, 0);
            const stVal = stInv.reduce(
              (a, b) => a + b.quantity * b.sellingPrice,
              0
            );
            const stPaidSales = sales
              .filter((s) => s.storeId === st.id && s.creditStatus === "PAID")
              .reduce((a, b) => a + b.totalAmount, 0);
            const stUnpaidCredit = sales
              .filter((s) => s.storeId === st.id && s.creditStatus === "UNPAID")
              .reduce((a, b) => a + b.totalAmount, 0);
            const stLow = stInv.filter((i) => i.quantity <= i.threshold).length;

            return (
              <div
                key={st.id}
                className="bg-[#FFFFFF] border border-[#9E9E9E]/30 rounded-2xl p-4 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-base text-[#212121]">
                      {st.name}
                    </h3>
                    {stLow > 0 ? (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[11px] font-bold">
                        {stLow} Low Stock
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-[#344ABF]/10 text-[#344ABF] rounded-full text-[11px] font-bold">
                        Stock Healthy
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#9E9E9E] mt-0.5">{st.location}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 my-4 p-3 bg-[#F5F6FA] rounded-xl text-xs">
                  <div>
                    <span className="text-[#9E9E9E] text-[10px] block">
                      Stock
                    </span>
                    <span className="font-black text-xs text-[#212121]">
                      {stUnits} units
                    </span>
                    <span className="text-[10px] text-[#9E9E9E] block">
                      {formatNaira(stVal)}
                    </span>
                  </div>
                  <div className="border-l border-[#9E9E9E]/20 pl-2">
                    <span className="text-[#9E9E9E] text-[10px] block">
                      Collected
                    </span>
                    <span className="font-black text-xs text-[#344ABF]">
                      {formatNaira(stPaidSales)}
                    </span>
                    <span className="text-[10px] text-[#9E9E9E] block">
                      Paid Sales
                    </span>
                  </div>
                  <div className="border-l border-[#9E9E9E]/20 pl-2">
                    <span className="text-[#9E9E9E] text-[10px] block">
                      On Credit
                    </span>
                    <span className="font-black text-xs text-amber-700">
                      {formatNaira(stUnpaidCredit)}
                    </span>
                    <span className="text-[10px] text-[#9E9E9E] block">
                      Unpaid Debt
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStoreFilter(st.id)}
                  className="w-full py-2 rounded-xl bg-[#F5F6FA] hover:bg-[#344ABF] hover:text-[#FFFFFF] text-[#212121] font-bold text-xs transition"
                >
                  Filter Dashboard to {st.name.split(":")[0]}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECENT SALES & CREDIT AUDIT LOG */}
      <div className="bg-[#FFFFFF] border border-[#9E9E9E]/30 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#9E9E9E]/20 flex items-center justify-between">
          <div>
            <h2 className="font-black text-base text-[#212121]">
              Live Cashier Sales & Credit Audit Feed
            </h2>
            <p className="text-xs text-[#9E9E9E]">
              Attached to active salesperson login • Unpaid credit can be
              settled into weekly sales
            </p>
          </div>
          <button
            onClick={() => setActivePage("credit")}
            className="text-xs font-bold text-[#344ABF] hover:underline flex items-center gap-1"
          >
            <span>Open Credit Book ({unpaidCreditSales.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F6FA] text-[#9E9E9E] uppercase border-b border-[#9E9E9E]/20">
                <th className="py-3 px-4">Receipt / Time</th>
                <th className="py-3 px-4">Store Branch</th>
                <th className="py-3 px-4">Salesperson</th>
                <th className="py-3 px-4">Customer & Items</th>
                <th className="py-3 px-4">Payment / Credit Status</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#9E9E9E]/20">
              {filteredSales.map((sale) => (
                <tr
                  key={sale.id}
                  className={
                    sale.creditStatus === "UNPAID"
                      ? "bg-amber-50/50 hover:bg-amber-50"
                      : "hover:bg-[#F5F6FA]"
                  }
                >
                  <td className="py-3.5 px-4">
                    <p className="font-black text-[#212121]">
                      {sale.receiptNo}
                    </p>
                    <p className="text-[#9E9E9E]">{sale.timestamp}</p>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#212121]">
                    {getStoreName(sale.storeId)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-[#F5F6FA] font-bold text-[#212121]">
                      {sale.staffName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-[#212121]">
                      {sale.customerName}{" "}
                      {sale.customerPhone !== "N/A" && (
                        <span className="text-[#9E9E9E] font-normal">
                          ({sale.customerPhone})
                        </span>
                      )}
                    </p>
                    {sale.items.map((it, idx) => (
                      <div key={idx} className="text-[#9E9E9E]">
                        <strong className="text-[#212121]">{it.qty}x</strong>{" "}
                        {it.name}
                        {it.imei && (
                          <span className="ml-1 text-[11px] font-mono">
                            [{it.imei}]
                          </span>
                        )}
                      </div>
                    ))}
                  </td>
                  <td className="py-3.5 px-4">
                    {sale.creditStatus === "UNPAID" ? (
                      <div>
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-[#212121] font-black text-[10px] uppercase">
                          ⚠️ UNPAID CREDIT
                        </span>
                        <p className="text-[11px] text-amber-800 font-semibold mt-0.5">
                          {sale.paymentRef}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <span className="px-2 py-0.5 rounded bg-[#344ABF]/10 text-[#344ABF] font-bold">
                          {sale.paymentMethod}
                        </span>
                        <p className="text-[11px] text-[#9E9E9E] font-mono mt-0.5">
                          {sale.paymentRef}
                        </p>
                        {sale.repaidAt && (
                          <p className="text-[10px] text-emerald-700 font-bold">
                            ✓ Settled {sale.repaidAt} by {sale.repaidBy}
                          </p>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-sm text-[#212121]">
                    {formatNaira(sale.totalAmount)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {sale.creditStatus === "UNPAID" && (
                        <button
                          onClick={() => setRepayModalSale(sale)}
                          className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-[#212121] rounded-lg font-black text-[11px]"
                        >
                          Settle Debt
                        </button>
                      )}
                      <button
                        onClick={() => setReceiptModalData(sale)}
                        className="px-2.5 py-1.5 bg-[#344ABF] text-[#FFFFFF] rounded-lg font-bold inline-flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WA</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}