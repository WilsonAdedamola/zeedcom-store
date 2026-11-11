import React, { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function StoreFormModal() {
  const {
    showStoreModal,
    setShowStoreModal,
    createStoreBranch,
    requestConfirm,
  } = useAuth();
  const [newStore, setNewStore] = useState({
    name: "",
    location: "",
    phone: "",
    manager: "",
    weeklyTarget: "",
  });

  if (!showStoreModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    requestConfirm({
      title: "Confirm Store Creation",
      message: `Create store branch "${newStore.name}"${
        newStore.weeklyTarget
          ? ` with a weekly target of ₦${Number(
              newStore.weeklyTarget
            ).toLocaleString()}`
          : " (no weekly target set yet)"
      }?`,
      confirmText: "Yes, Create Store",
      variant: "primary",
      onConfirm: async () => {
        const ok = await createStoreBranch(newStore);
        if (ok) {
          setShowStoreModal(false);
          setNewStore({
            name: "",
            location: "",
            phone: "",
            manager: "",
            weeklyTarget: "",
          });
        }
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-[#212121]/70 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FFFFFF] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#212121]">
            Create New Store Branch
          </h3>
          <button type="button" onClick={() => setShowStoreModal(false)}>
            <X className="w-5 h-5 text-[#9E9E9E]" />
          </button>
        </div>
        <input
          required
          placeholder="Store Branch Name (e.g. Store 1: Challenge HQ) *"
          value={newStore.name}
          onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
          className="w-full px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl"
        />
        <input
          required
          placeholder="Physical Address *"
          value={newStore.location}
          onChange={(e) =>
            setNewStore({ ...newStore, location: e.target.value })
          }
          className="w-full px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl"
        />
        <input
          required
          placeholder="Store Phone Number *"
          value={newStore.phone}
          onChange={(e) => setNewStore({ ...newStore, phone: e.target.value })}
          className="w-full px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl"
        />
        <input
          required
          placeholder="Branch Manager Name *"
          value={newStore.manager}
          onChange={(e) =>
            setNewStore({ ...newStore, manager: e.target.value })
          }
          className="w-full px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl"
        />
        <div>
          <label className="text-[10px] font-bold uppercase text-[#9E9E9E] block mb-1">
            Weekly Sales Target in ₦ (Optional — Can be set later)
          </label>
          <input
            type="number"
            placeholder="Leave blank to set later (e.g. 500000)"
            value={newStore.weeklyTarget}
            onChange={(e) =>
              setNewStore({ ...newStore, weeklyTarget: e.target.value })
            }
            className="w-full px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl font-bold"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-[#212121] text-[#FFFFFF] font-black rounded-xl"
        >
          Create Store Branch
        </button>
      </form>
    </div>
  );
}