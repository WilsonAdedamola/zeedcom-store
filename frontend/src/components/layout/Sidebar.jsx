import React from "react";
import {
  Smartphone,
  LayoutDashboard,
  ShoppingCart,
  HandCoins,
  Package,
  Store,
  FileText,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const {
    currentRole,
    activePage,
    setActivePage,
    stores,
    staffList,
    activeStaffUser,
    handleSwitchRole,
    handleChangeActiveStaff,
    getStoreName,
    unpaidCreditSales,
    lowStockItems,
    adminWaNumber,
    setIsLoggedIn,
  } = useAuth();

  const navLinks =
    currentRole === "admin"
      ? [
          { id: "dashboard", label: "Admin Command", icon: LayoutDashboard },
          { id: "pos", label: "POS Terminal", icon: ShoppingCart },
          {
            id: "credit",
            label: "Credit & Debt Book",
            icon: HandCoins,
            badge: unpaidCreditSales.length,
          },
          {
            id: "inventory",
            label: "Stock & Parts",
            icon: Package,
            badge: lowStockItems.length,
            isAlert: true,
          },
          { id: "stores", label: "Stores & Staff", icon: Store },
          { id: "sales", label: "Sales Audit", icon: FileText },
        ]
      : [
          { id: "pos", label: "POS Terminal", icon: ShoppingCart },
          {
            id: "credit",
            label: "Store Credit Book",
            icon: HandCoins,
            badge: unpaidCreditSales.length,
          },
          { id: "sales", label: "Store Sales Log", icon: FileText },
        ];

  return (
    <aside className="hidden lg:flex w-64 bg-[#212121] text-[#FFFFFF] flex-col justify-between shrink-0 min-h-screen select-none">
      <div>
        {/* Brand Logo */}
        <div className="p-5 border-b border-[#9E9E9E]/20 flex items-center gap-3">
          <div className="bg-[#344ABF] p-2.5 rounded-xl text-[#FFFFFF]">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tight leading-none text-[#FFFFFF]">
              ZEEDCOM-POS
            </h1>
            <span className="text-[11px] text-[#9E9E9E] font-semibold">
              Multi-Store System
            </span>
          </div>
        </div>

        {/* Role & Staff Switcher */}
        <div className="p-4 border-b border-[#9E9E9E]/20 bg-[#000000]/20">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9E9E] block mb-1.5">
            UI Preview Role Switcher
          </span>
          <div className="grid grid-cols-2 gap-1.5 bg-[#212121] p-1 rounded-xl border border-[#9E9E9E]/30">
            <button
              onClick={() => handleSwitchRole("admin")}
              className={`py-1.5 rounded-lg text-xs font-bold transition ${
                currentRole === "admin"
                  ? "bg-[#344ABF] text-[#FFFFFF]"
                  : "text-[#9E9E9E] hover:text-[#FFFFFF]"
              }`}
            >
              Admin View
            </button>
            <button
              onClick={() => handleSwitchRole("staff")}
              className={`py-1.5 rounded-lg text-xs font-bold transition ${
                currentRole === "staff"
                  ? "bg-[#344ABF] text-[#FFFFFF]"
                  : "text-[#9E9E9E] hover:text-[#FFFFFF]"
              }`}
            >
              Staff View
            </button>
          </div>

          {currentRole === "staff" ? (
            <div className="mt-3">
              <label className="text-[10px] text-[#9E9E9E] uppercase font-bold block">
                Logged-In Attendant:
              </label>
              <select
                value={activeStaffUser.id}
                onChange={(e) => handleChangeActiveStaff(e.target.value)}
                className="w-full mt-1 bg-[#212121] border border-[#9E9E9E]/40 rounded-lg px-2 py-1.5 text-xs font-bold text-[#FFFFFF]"
              >
                {staffList
                  .filter((s) => s.active)
                  .map((stf) => (
                    <option key={stf.id} value={stf.id}>
                      {stf.name} ({getStoreName(stf.storeId).split(":")[0]})
                    </option>
                  ))}
              </select>
              <p className="text-[11px] text-[#9E9E9E] mt-1 truncate">
                {getStoreName(activeStaffUser.storeId)}
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs font-bold text-[#FFFFFF] mt-3 truncate">
                Engr. Azeez (Master Admin)
              </p>
              <p className="text-[11px] text-[#9E9E9E] truncate">
                All {stores.length} Stores Access
              </p>
            </>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs transition ${
                  active
                    ? "bg-[#344ABF] text-[#FFFFFF] shadow-md"
                    : "text-[#9E9E9E] hover:bg-[#FFFFFF]/10 hover:text-[#FFFFFF]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                      item.isAlert
                        ? "bg-red-600 text-[#FFFFFF]"
                        : "bg-amber-500 text-[#212121]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom WhatsApp Audit Line & Sign Out */}
      <div className="p-4 border-t border-[#9E9E9E]/20 space-y-3">
        <div className="p-3 rounded-xl bg-[#000000]/30 border border-[#9E9E9E]/20 text-xs">
          <span className="text-[10px] uppercase font-bold text-[#9E9E9E] block">
            WhatsApp Audit Line
          </span>
          <p className="font-mono font-bold text-[#FFFFFF] mt-0.5">
            +{adminWaNumber}
          </p>
        </div>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FFFFFF]/10 hover:bg-red-600 text-[#FFFFFF] text-xs font-bold transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Lock / Sign Out</span>
        </button>
      </div>
    </aside>
  );
}