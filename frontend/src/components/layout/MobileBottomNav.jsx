import React from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  HandCoins,
  Package,
  Store,
  FileText,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function MobileBottomNav() {
  const { currentRole, activePage, setActivePage } = useAuth();

  const navLinks =
    currentRole === "admin"
      ? [
          { id: "dashboard", label: "Admin", icon: LayoutDashboard },
          { id: "pos", label: "POS", icon: ShoppingCart },
          { id: "credit", label: "Credit", icon: HandCoins },
          { id: "inventory", label: "Stock", icon: Package },
          { id: "stores", label: "Stores", icon: Store },
          { id: "sales", label: "Audit", icon: FileText },
        ]
      : [
          { id: "pos", label: "POS", icon: ShoppingCart },
          { id: "credit", label: "Credit Book", icon: HandCoins },
          { id: "sales", label: "Sales Log", icon: FileText },
        ];

  return (
    <nav
      className={`lg:hidden fixed bottom-0 left-0 right-0 bg-[#212121] text-[#FFFFFF] border-t border-[#9E9E9E]/20 grid ${
        currentRole === "admin" ? "grid-cols-6" : "grid-cols-3"
      } py-2 z-40`}
    >
      {navLinks.map((item) => {
        const Icon = item.icon;
        const active = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex flex-col items-center justify-center py-1 text-[10px] font-bold ${
              active ? "text-[#344ABF]" : "text-[#9E9E9E]"
            }`}
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}