import React from "react";
import { Tag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatNaira } from "../utils/formatters";
import LowStockBanner from "../components/layout/LowStockBanner";

export default function InventoryManager() {
  const {
    stores,
    categories,
    inventory,
    selectedStoreFilter,
    setSelectedStoreFilter,
    getStoreName,
    setShowProductModal,
    setShowCategoryModal,
  } = useAuth();

  const visibleInventory = inventory.filter(
    (i) => selectedStoreFilter === "ALL" || i.storeId === selectedStoreFilter
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#212121]">
            Multi-Store Stock & Categories
          </h1>
          <p className="text-xs sm:text-sm text-[#9E9E9E]">
            Monitor stock across branches, manage categories, and add new
            products
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedStoreFilter}
            onChange={(e) => setSelectedStoreFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#FFFFFF] border border-[#9E9E9E]/30 rounded-xl text-xs font-bold"
          >
            <option value="ALL">All Stores ({stores.length})</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowCategoryModal(true)}
            className="px-4 py-2.5 bg-[#212121] text-[#FFFFFF] rounded-xl text-xs font-black shadow-sm"
          >
            + Manage Categories
          </button>

          <button
            onClick={() => setShowProductModal(true)}
            className="px-4 py-2.5 bg-[#344ABF] text-[#FFFFFF] rounded-xl text-xs font-black shadow-sm"
          >
            + Add / Restock Product
          </button>
        </div>
      </div>

      <LowStockBanner />

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <span
            key={cat}
            className="px-3 py-1.5 bg-[#FFFFFF] border border-[#9E9E9E]/30 rounded-full text-xs font-bold text-[#212121] shrink-0 flex items-center gap-1.5"
          >
            <Tag className="w-3 h-3 text-[#344ABF]" />
            {cat}
          </span>
        ))}
      </div>

      {/* Inventory Table */}
      <div className="bg-[#FFFFFF] border border-[#9E9E9E]/30 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F6FA] text-[#9E9E9E] uppercase border-b border-[#9E9E9E]/20">
                <th className="py-3.5 px-4">SKU & Product Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Store Branch</th>
                <th className="py-3.5 px-4 text-right">Cost Price</th>
                <th className="py-3.5 px-4 text-right">Selling Price</th>
                <th className="py-3.5 px-4 text-center">Stock Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#9E9E9E]/20">
              {visibleInventory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-[#9E9E9E]">
                    No inventory items recorded yet. Click "+ Add / Restock
                    Product" to add stock.
                  </td>
                </tr>
              ) : (
                visibleInventory.map((item) => {
                  const isLow = item.quantity <= item.threshold;
                  return (
                    <tr
                      key={item.id}
                      className={
                        isLow ? "bg-red-50/70" : "hover:bg-[#F5F6FA]"
                      }
                    >
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#212121] text-sm">
                          {item.name}
                        </p>
                        <p className="font-mono text-[11px] text-[#9E9E9E]">
                          {item.sku}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#9E9E9E]">
                        {item.category}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#212121]">
                        {getStoreName(item.storeId)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-[#9E9E9E]">
                        {formatNaira(item.costPrice)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-[#212121]">
                        {formatNaira(item.sellingPrice)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full font-black text-[11px] ${
                            isLow
                              ? "bg-red-600 text-[#FFFFFF] animate-pulse"
                              : "bg-[#344ABF]/10 text-[#344ABF]"
                          }`}
                        >
                          {item.quantity} units {isLow && "(LOW!)"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}