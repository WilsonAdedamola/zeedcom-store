import React, { useState } from "react";
import { X, Plus, Trash2, Tag } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function CategoryFormModal() {
  const {
    categories,
    showCategoryModal,
    setShowCategoryModal,
    createCategory,
    deleteCategory,
    requestConfirm,
  } = useAuth();
  const [newCat, setNewCat] = useState("");

  if (!showCategoryModal) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    const clean = newCat.trim();
    if (!clean) return;

    requestConfirm({
      title: "Confirm New Category",
      message: `Are you sure you want to add "${clean}" as a stock category?`,
      confirmText: "Yes, Add Category",
      variant: "primary",
      onConfirm: async () => {
        const ok = await createCategory(clean);
        if (ok) setNewCat("");
      },
    });
  };

  const handleDelete = (catName) => {
    requestConfirm({
      title: "Delete Stock Category",
      message: `Are you sure you want to delete the category "${catName}"?`,
      confirmText: "Yes, Delete Category",
      variant: "danger",
      onConfirm: async () => {
        await deleteCategory(catName);
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-[#212121]/70 flex items-center justify-center p-4 z-50">
      <div className="bg-[#FFFFFF] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#344ABF]" />
            <h3 className="text-base font-black text-[#212121]">
              Create or Delete Categories
            </h3>
          </div>
          <button type="button" onClick={() => setShowCategoryModal(false)}>
            <X className="w-5 h-5 text-[#9E9E9E]" />
          </button>
        </div>

        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            required
            placeholder="Enter new category name..."
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            className="flex-1 px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl font-medium"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#344ABF] text-[#FFFFFF] font-black rounded-xl inline-flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>

        <div className="max-h-60 overflow-y-auto divide-y divide-[#9E9E9E]/20 border border-[#9E9E9E]/20 rounded-xl px-3">
          {categories.length === 0 ? (
            <p className="py-6 text-center text-[#9E9E9E]">
              No categories created yet.
            </p>
          ) : (
            categories.map((cat) => (
              <div
                key={cat}
                className="py-2.5 flex items-center justify-between"
              >
                <span className="font-bold text-[#212121]">{cat}</span>
                <button
                  type="button"
                  onClick={() => handleDelete(cat)}
                  className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}