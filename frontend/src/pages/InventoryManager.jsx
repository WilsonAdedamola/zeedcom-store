import React, { useState } from "react";
import { Tag, Trash2, X } from "lucide-react";
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
    deleteProduct,
    deleteCategory,
    requestConfirm,
  } = useAuth();

  const [activeCategoryTab, setActiveCategoryTab] = useState("ALL");

  const storeFilteredInventory = inventory.filter(
    (i) => selectedStoreFilter === "ALL" || i.storeId === selectedStoreFilter
  );

  const visibleInventory = storeFilteredInventory.filter(
    (i) => activeCategoryTab === "ALL" || i.category === activeCategoryTab
  );

  const handleDeleteProduct = (item) => {
    requestConfirm({
      title: "Delete Product from Inventory",
      message: `Are you sure you want to permanently delete "${item.name}" (SKU: ${item.sku}) from ${getStoreName(
        item.storeId
      )}?`,
      confirmText: "Yes, Delete Product",
      variant: "danger",
      onConfirm: async () => {
        await deleteProduct(item.id);
      },
    });
  };

  const handleDeleteCategoryPill = (e, catName) => {
    e.stopPropagation();
    requestConfirm({
      title: "Delete Stock Category",
      message: `Are you sure you want to delete the category "${catName}"?`,
      confirmText: "Yes, Delete Category",
      variant: "danger",
      onConfirm: async () => {
        if (activeCategoryTab === catName) setActiveCategoryTab("ALL");
        await deleteCategory(catName);
      },
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#212121]">
            Multi-Store Stock & Categories
          </h1>
          <p className="text-xs sm:text-sm text-[#9E9E9E]">
            Click any category tab below to view products under it, or manage
            stock items
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

      {/* CLICKABLE CATEGORY TABS (Filters Products Under Selected Category) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveCategoryTab("ALL")}
          className={`px-3.5 py-2 rounded-xl text-xs font-black shrink-0 transition flex items-center gap-2 ${
            activeCategoryTab === "ALL"
              ? "bg-[#212121] text-[#FFFFFF] shadow-sm"
              : "bg-[#FFFFFF] border border-[#9E9E9E]/30 text-[#212121] hover:border-[#344ABF]"
          }`}
        >
          <span>All Categories</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#344ABF] text-[#FFFFFF]">
            {storeFilteredInventory.length}
          </span>
        </button>

        {categories.map((cat) => {
          const count = storeFilteredInventory.filter(
            (i) => i.category === cat
          ).length;
          const isSelected = activeCategoryTab === cat;

          return (
            <div
              key={cat}
              onClick={() => setActiveCategoryTab(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? "bg-[#344ABF] text-[#FFFFFF] shadow-sm"
                  : "bg-[#FFFFFF] border border-[#9E9E9E]/30 text-[#212121] hover:border-[#344ABF]"
              }`}
            >
              <Tag
                className={`w-3.5 h-3.5 ${
                  isSelected ? "text-[#FFFFFF]" : "text-[#344ABF]"
                }`}
              />
              <span>{cat}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  isSelected
                    ? "bg-[#FFFFFF]/20 text-[#FFFFFF]"
                    : "bg-[#F5F6FA] text-[#212121]"
                }`}
              >
                {count}
              </span>
              <button
                type="button"
                onClick={(e) => handleDeleteCategoryPill(e, cat)}
                title={`Delete ${cat} category`}
                className={`p-0.5 rounded hover:bg-red-500 hover:text-[#FFFFFF] transition ${
                  isSelected ? "text-[#FFFFFF]/80" : "text-[#9E9E9E]"
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Inventory Table */}
      <div className="bg-[#FFFFFF] border border-[#9E9E9E]/30 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#9E9E9E]/20 flex items-center justify-between">
          <h2 className="font-black text-sm text-[#212121]">
            Showing:{" "}
            <span className="text-[#344ABF]">
              {activeCategoryTab === "ALL"
                ? "All Categories"
                : activeCategoryTab}
            </span>{" "}
            ({visibleInventory.length} Products)
          </h2>
        </div>

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
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#9E9E9E]/20">
              {visibleInventory.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-[#9E9E9E]">
                    No products found under{" "}
                    <strong>
                      {activeCategoryTab === "ALL"
                        ? "this filter"
                        : activeCategoryTab}
                    </strong>
                    .
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
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => setActiveCategoryTab(item.category)}
                          className="px-2.5 py-1 rounded-full bg-[#344ABF]/10 text-[#344ABF] font-bold hover:underline"
                        >
                          {item.category}
                        </button>
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
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(item)}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-[#FFFFFF] transition inline-flex items-center gap-1 font-bold"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
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