import React, { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function StaffFormModal() {
  const { showStaffModal, setShowStaffModal, stores, setStaffList } = useAuth();
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    storeId: stores[0]?.id || "store-1",
  });

  if (!showStaffModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStaffList((prev) => [
      ...prev,
      {
        id: `stf-${Date.now()}`,
        ...newStaff,
        role: "staff",
        active: true,
        salesCount: 0,
      },
    ]);
    setShowStaffModal(false);
    setNewStaff({ name: "", email: "", storeId: stores[0]?.id || "store-1" });
  };

  return (
    <div className="fixed inset-0 bg-[#212121]/70 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FFFFFF] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#212121]">
            Register Salesperson Login
          </h3>
          <button type="button" onClick={() => setShowStaffModal(false)}>
            <X className="w-5 h-5 text-[#9E9E9E]" />
          </button>
        </div>
        <input
          required
          placeholder="Staff Full Name"
          value={newStaff.name}
          onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
          className="w-full px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl"
        />
        <input
          required
          type="email"
          placeholder="Staff Login Email"
          value={newStaff.email}
          onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
          className="w-full px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl"
        />
        <select
          value={newStaff.storeId}
          onChange={(e) =>
            setNewStaff({ ...newStaff, storeId: e.target.value })
          }
          className="w-full px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl"
        >
          {stores.map((s) => (
            <option key={s.id} value={s.id}>
              Assign to: {s.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full py-3 bg-[#344ABF] text-[#FFFFFF] font-black rounded-xl"
        >
          Create Cashier Account
        </button>
      </form>
    </div>
  );
}