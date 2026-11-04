import React, { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { formatNaira } from "../../utils/formatters";

export default function RepayDebtModal() {
  const { repayModalSale, setRepayModalSale, settleCreditDebt } = useAuth();
  const [repayMethod, setRepayMethod] = useState("Transfer");
  const [repayRef, setRepayRef] = useState("");

  if (!repayModalSale) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    settleCreditDebt(repayModalSale, repayMethod, repayRef);
    setRepayRef("");
  };

  return (
    <div className="fixed inset-0 bg-[#212121]/75 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FFFFFF] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
              Settle Customer Credit
            </span>
            <h3 className="text-base font-black text-[#212121] mt-1">
              Record Debt Repayment
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setRepayModalSale(null)}
            className="text-[#9E9E9E] hover:text-[#212121]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F5F6FA] border border-[#9E9E9E]/20 space-y-1">
          <p className="font-bold text-[#212121]">
            Customer: {repayModalSale.customerName} (
            {repayModalSale.customerPhone})
          </p>
          <p className="text-[#9E9E9E]">
            Items:{" "}
            {repayModalSale.items
              .map((i) => `${i.qty}x ${i.name}`)
              .join(", ")}
          </p>
          <p className="text-sm font-black text-[#344ABF] pt-1">
            Amount to Add to Weekly Sales:{" "}
            {formatNaira(repayModalSale.totalAmount)}
          </p>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-[#9E9E9E] block mb-1.5">
            How did the customer repay?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["Cash", "Transfer", "POS"].map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setRepayMethod(m)}
                className={`py-2.5 rounded-xl font-black border transition ${
                  repayMethod === m
                    ? "bg-[#344ABF] text-[#FFFFFF] border-[#344ABF]"
                    : "bg-[#FFFFFF] text-[#212121] border-[#9E9E9E]/30"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {(repayMethod === "Transfer" || repayMethod === "POS") && (
          <input
            required
            placeholder="Enter Bank Name / POS Reference *"
            value={repayRef}
            onChange={(e) => setRepayRef(e.target.value)}
            className="w-full px-3 py-2.5 border border-[#9E9E9E]/40 rounded-xl font-semibold"
          />
        )}

        <button
          type="submit"
          className="w-full py-3.5 bg-[#344ABF] text-[#FFFFFF] font-black rounded-xl shadow-lg"
        >
          Confirm Repayment & Add to Weekly Total
        </button>
      </form>
    </div>
  );
}