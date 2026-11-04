import React from "react";
import { Smartphone, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function MobileHeader() {
  const { currentRole, sessionUser, getStoreName, logout } = useAuth();

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
              ? `${sessionUser?.name} (Admin)`
              : `${sessionUser?.name} • ${
                  getStoreName(sessionUser?.storeId).split(":")[0]
                }`}
          </span>
        </div>
      </div>

      <button
        onClick={logout}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFFFF]/10 hover:bg-red-600 text-xs font-bold text-[#FFFFFF] transition"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Sign Out</span>
      </button>
    </header>
  );
}