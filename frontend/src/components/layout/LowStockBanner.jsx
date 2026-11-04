import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function LowStockBanner() {
  const { lowStockItems, getStoreName, setShowProductModal } = useAuth();
  const [expanded, setExpanded] = useState(true);

  if (lowStockItems.length === 0) return null;

  return (
    <div className="bg-red-600 text-[#FFFFFF] rounded-2xl p-4 sm:p-5 shadow-lg border-2 border-red-400">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="bg-[#FFFFFF] text-red-600 p-2.5 rounded-xl shrink-0 animate-pulse">
            <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wide">
              CRITICAL LOW STOCK ALERT ({lowStockItems.length} PRODUCTS LOW)
            </h2>
            <p className="text-xs text-red-100 font-medium">
              These items have fallen at or below their minimum safety
              threshold.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowProductModal(true)}
            className="px-3 py-2 bg-[#FFFFFF] text-red-700 font-black rounded-xl text-xs shadow-sm"
          >
            + Restock Now
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-2 bg-red-800 hover:bg-red-900 text-[#FFFFFF] font-bold rounded-xl text-xs"
          >
            {expanded ? "Hide" : "Show All"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 pt-4 border-t border-red-500">
          {lowStockItems.map((item) => (
            <div
              key={item.id}
              className="bg-red-950/60 border border-red-400/40 rounded-xl p-3 flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-red-500/40 rounded text-red-100">
                  {getStoreName(item.storeId)}
                </span>
                <p className="font-bold text-xs sm:text-sm text-[#FFFFFF] mt-1">
                  {item.name}
                </p>
                <p className="text-[11px] text-red-200 font-mono">
                  SKU: {item.sku}
                </p>
              </div>
              <div className="text-right shrink-0 ml-2">
                <span className="text-lg font-black text-yellow-300 block">
                  {item.quantity} left
                </span>
                <span className="text-[10px] text-red-200">
                  Min limit: {item.threshold}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}