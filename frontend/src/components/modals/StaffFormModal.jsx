import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function StaffFormModal() {
  const { showStaffModal, setShowStaffModal, stores, registerStaffMember } =
    useAuth();
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    password: "",
    storeId: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (stores.length > 0 && !newStaff.storeId) {
      setNewStaff((prev) => ({ ...prev, storeId: stores[0].id }));
    }
  }, [stores, newStaff.storeId, showStaffModal]);

  if (!showStaffModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newStaff.storeId) {
      alert("Please create a Store Branch first!");
      return;
    }
    setSaving(true);
    const ok = await registerStaffMember(newStaff);
    setSaving(false);
    if (ok) {
      setShowStaffModal(false);
      setNewStaff({
        name: "",
        email: "",
        password: "",
        storeId: stores[0]?.id || "",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-[#212121]/70 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FFFFFF] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#212121]">
            Create Sales Attendant Login
          </h3>
          <button type="button" onClick={() => setShowStaffModal(false)}>
            <X className="w-5 h-5 text-[#9E9E9E]" />
          </button>
        </div>

        {stores.length === 0 ? (
          <p className="text-red-600 font-bold py-4">
            Please create a Store Branch first before registering sales staff.
          </p>
        ) : (
          <>
            <input
              required
              placeholder="Staff Full Name"
              value={newStaff.name}
              onChange={(e) =>
                setNewStaff({ ...newStaff, name: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl"
            />
            <input
              required
              type="email"
              placeholder="Staff Login Email (e.g. cashier1@zeedcom.ng)"
              value={newStaff.email}
              onChange={(e) =>
                setNewStaff({ ...newStaff, email: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl"
            />
            <input
              required
              type="text"
              placeholder="Assign Login Password"
              value={newStaff.password}
              onChange={(e) =>
                setNewStaff({ ...newStaff, password: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl font-mono"
            />
            <select
              required
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
              disabled={saving}
              className="w-full py-3 bg-[#344ABF] disabled:opacity-50 text-[#FFFFFF] font-black rounded-xl"
            >
              {saving ? "Creating Login..." : "Create Sales Attendant Account"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}