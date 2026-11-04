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
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const {
    currentRole,
    sessionUser,
    activePage,
    setActivePage,
    stores,
    getStoreName,
    unpaidCreditSales,
    lowStockItems,
    adminWaNumber,
    logout,
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

        {/* Authenticated User Profile Summary */}
        <div className="p-4 border-b border-[#9E9E9E]/20 bg-[#000000]/20">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#344ABF]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {currentRole === "admin"
                ? "Master Administrator"
                : "Sales Attendant"}
            </span>
          </div>
          <p className="text-sm font-black text-[#FFFFFF] mt-1 truncate">
            {sessionUser?.name}
          </p>
          <p className="text-[11px] text-[#9E9E9E] mt-0.5 truncate">
            {currentRole === "admin"
              ? `All ${stores.length} Stores Access`
              : getStoreName(sessionUser?.storeId)}
          </p>
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
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FFFFFF]/10 hover:bg-red-600 text-[#FFFFFF] text-xs font-bold transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Session</span>
        </button>
      </div>
    </aside>
  );
}