import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ProductFormModal() {
  const {
    showProductModal,
    setShowProductModal,
    categories,
    stores,
    addOrRestockProduct,
  } = useAuth();

  const [newProduct, setNewProduct] = useState({
    sku: "",
    name: "",
    category: "",
    storeId: "",
    costPrice: "",
    sellingPrice: "",
    quantity: "",
    threshold: 5,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNewProduct((prev) => ({
      ...prev,
      category: prev.category || categories[0] || "",
      storeId: prev.storeId || stores[0]?.id || "",
    }));
  }, [categories, stores, showProductModal]);

  if (!showProductModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.storeId) {
      alert("Please create a Store Branch first!");
      return;
    }
    if (!newProduct.category) {
      alert("Please create a Product Category first!");
      return;
    }
    setSaving(true);
    const ok = await addOrRestockProduct(newProduct);
    setSaving(false);
    if (ok) {
      setShowProductModal(false);
      setNewProduct({
        sku: "",
        name: "",
        category: categories[0] || "",
        storeId: stores[0]?.id || "",
        costPrice: "",
        sellingPrice: "",
        quantity: "",
        threshold: 5,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-[#212121]/70 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FFFFFF] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-xs"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#212121]">
            Add / Restock Store Product
          </h3>
          <button type="button" onClick={() => setShowProductModal(false)}>
            <X className="w-5 h-5 text-[#9E9E9E]" />
          </button>
        </div>

        {stores.length === 0 ? (
          <p className="text-red-600 font-bold py-4">
            You must create at least 1 Store Branch in "Stores & Staff" before
            adding stock.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                placeholder="SKU (e.g. SCR-IP14PM)"
                value={newProduct.sku}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, sku: e.target.value })
                }
                className="px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl"
              />
              <select
                required
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                className="px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <input
              required
              placeholder="Product Name (e.g. iPhone 14 Pro Max Original Screen)"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                type="number"
                placeholder="Cost Price (₦)"
                value={newProduct.costPrice}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, costPrice: e.target.value })
                }
                className="px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl"
              />
              <input
                required
                type="number"
                placeholder="Selling Price (₦)"
                value={newProduct.sellingPrice}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, sellingPrice: e.target.value })
                }
                className="px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <select
                required
                value={newProduct.storeId}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, storeId: e.target.value })
                }
                className="px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl"
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <input
                required
                type="number"
                placeholder="Quantity"
                value={newProduct.quantity}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, quantity: e.target.value })
                }
                className="px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl"
              />
              <input
                required
                type="number"
                placeholder="Low Stock Limit"
                value={newProduct.threshold}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, threshold: e.target.value })
                }
                className="px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-[#344ABF] disabled:opacity-50 text-[#FFFFFF] font-black rounded-xl"
            >
              {saving
                ? "Saving to Database..."
                : "Save Product to Store Inventory"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}