import React from "react";
import { Lock, Unlock, Trash2, Target } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatNaira } from "../utils/formatters";

export default function StoresAndStaff() {
  const {
    stores,
    staffList,
    toggleStaffStatus,
    deleteStoreBranch,
    deleteStaffMember,
    getStoreName,
    setShowStoreModal,
    setShowStaffModal,
    setShowTargetModal,
    requestConfirm,
  } = useAuth();

  const handleDeleteStore = (st) => {
    requestConfirm({
      title: "Delete Store Branch",
      message: `Are you sure you want to permanently delete "${st.name}"? All inventory and sales records tied to this branch will also be removed.`,
      confirmText: "Yes, Delete Store",
      variant: "danger",
      onConfirm: async () => {
        await deleteStoreBranch(st.id);
      },
    });
  };

  const handleToggleStaff = (stf) => {
    requestConfirm({
      title: stf.active ? "Freeze Staff Account" : "Unfreeze Staff Account",
      message: stf.active
        ? `Are you sure you want to freeze "${stf.name}"? They will be immediately locked out of the terminal.`
        : `Restore terminal login access for "${stf.name}"?`,
      confirmText: stf.active ? "Yes, Freeze Staff" : "Yes, Unfreeze Staff",
      variant: stf.active ? "danger" : "primary",
      onConfirm: async () => {
        await toggleStaffStatus(stf.id, stf.active);
      },
    });
  };

  const handleDeleteStaff = (stf) => {
    requestConfirm({
      title: "Delete Salesperson Account",
      message: `Are you sure you want to permanently delete "${stf.name}" (${stf.email})?`,
      confirmText: "Yes, Delete Staff",
      variant: "danger",
      onConfirm: async () => {
        await deleteStaffMember(stf.id);
      },
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#212121]">
            Stores & Sales Staff Management
          </h1>
          <p className="text-xs sm:text-sm text-[#9E9E9E]">
            Create or delete branches, set optional weekly targets, and manage
            cashier logins
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowTargetModal(true)}
            className="px-4 py-2.5 bg-[#FFFFFF] border border-[#9E9E9E]/30 text-[#212121] rounded-xl text-xs font-black flex items-center gap-1.5"
          >
            <Target className="w-4 h-4 text-[#344ABF]" />
            <span>Set Store Targets</span>
          </button>
          <button
            onClick={() => setShowStoreModal(true)}
            className="px-4 py-2.5 bg-[#212121] text-[#FFFFFF] rounded-xl text-xs font-black"
          >
            + Create New Store
          </button>
          <button
            onClick={() => setShowStaffModal(true)}
            className="px-4 py-2.5 bg-[#344ABF] text-[#FFFFFF] rounded-xl text-xs font-black"
          >
            + Add Salesperson
          </button>
        </div>
      </div>

      {/* Store Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stores.map((st) => (
          <div
            key={st.id}
            className="bg-[#FFFFFF] border border-[#9E9E9E]/30 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 bg-[#344ABF]/10 text-[#344ABF] rounded-full">
                  Active Store Branch
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteStore(st)}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                  title="Delete Store Branch"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-lg font-black text-[#212121] mt-2">
                {st.name}
              </h3>
              <p className="text-xs text-[#9E9E9E] mt-0.5">{st.location}</p>
              <p className="text-xs text-[#9E9E9E] mt-1">Phone: {st.phone}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#9E9E9E]/20 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#9E9E9E]">Branch Lead:</span>
                <span className="font-bold text-[#212121]">{st.manager}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9E9E9E]">Weekly Target:</span>
                <span className="font-black text-[#344ABF]">
                  {st.weeklyTarget > 0
                    ? formatNaira(st.weeklyTarget)
                    : "Not set yet"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Directory */}
      <div className="bg-[#FFFFFF] border border-[#9E9E9E]/30 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#9E9E9E]/20">
          <h2 className="font-black text-base text-[#212121]">
            Salesperson Login & Store Assignment Directory
          </h2>
        </div>
        <div className="divide-y divide-[#9E9E9E]/20 text-xs">
          {staffList.length === 0 ? (
            <div className="p-10 text-center text-[#9E9E9E]">
              No sales attendants registered yet. Click "+ Add Salesperson" to
              create login credentials.
            </div>
          ) : (
            staffList.map((stf) => (
              <div
                key={stf.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-sm text-[#212121]">
                      {stf.name}
                    </p>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        stf.active
                          ? "bg-[#344ABF]/10 text-[#344ABF]"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {stf.active ? "Active Access" : "Account Frozen"}
                    </span>
                  </div>
                  <p className="text-[#9E9E9E] mt-0.5">
                    {stf.email} • Assigned to:{" "}
                    <strong className="text-[#212121]">
                      {getStoreName(stf.storeId)}
                    </strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-[#F5F6FA] rounded-xl font-bold">
                    {stf.salesCount} Sales
                  </span>
                  <button
                    onClick={() => handleToggleStaff(stf)}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 ${
                      stf.active
                        ? "bg-amber-50 text-amber-800 hover:bg-amber-100"
                        : "bg-[#344ABF]/10 text-[#344ABF]"
                    }`}
                  >
                    {stf.active ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Freeze</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Unfreeze</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteStaff(stf)}
                    className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-[#FFFFFF] transition"
                    title="Delete Staff Account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}