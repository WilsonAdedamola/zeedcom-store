import React from "react";
import { Smartphone, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function MobileHeader() {
  const {
    currentRole,
    activeStaffUser,
    getStoreName,
    handleSwitchRole,
    setIsLoggedIn,
  } = useAuth();

  return (
    <header className="lg:hidden bg-[#212121] text-[#FFFFFF] px-4 py-3 sticky top-0 z-30 flex items-center justify-between border-b border-[#9E9E9E]/20">
      <div className="flex items-center gap-2">
        <div className="bg-[#344ABF] p-1.5 rounded-lg">
          <Smartphone className="w-4 h-4" />
        </div>
        <div>
          <span className="font-black text-sm tracking-tight block leading-none">
            ZEEDCOM-POS
          </span>
          <span className="text-[10px] text-[#9E9E9E] font-bold">
            {currentRole === "admin"
              ? "Master Admin"
              : `${activeStaffUser.name} • ${
                  getStoreName(activeStaffUser.storeId).split(":")[0]
                }`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            handleSwitchRole(currentRole === "admin" ? "staff" : "admin")
          }
          className="px-2.5 py-1 rounded-lg bg-[#344ABF] text-[11px] font-bold text-[#FFFFFF]"
        >
          Switch to {currentRole === "admin" ? "Staff" : "Admin"}
        </button>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="p-1.5 rounded-lg bg-[#FFFFFF]/10 text-[#FFFFFF]"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}