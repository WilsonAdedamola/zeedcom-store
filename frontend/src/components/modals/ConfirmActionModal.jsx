import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ConfirmActionModal() {
  const { confirmModalData, setConfirmModalData } = useAuth();
  const [processing, setProcessing] = useState(false);

  if (!confirmModalData) return null;

  const {
    title = "Confirm Action",
    message = "Are you sure you want to proceed with this action?",
    confirmText = "Yes, Proceed",
    cancelText = "Cancel",
    variant = "primary", // 'danger' | 'primary' | 'warning'
    onConfirm,
  } = confirmModalData;

  const handleConfirm = async () => {
    if (!onConfirm) {
      setConfirmModalData(null);
      return;
    }
    setProcessing(true);
    try {
      await onConfirm();
    } finally {
      setProcessing(false);
      setConfirmModalData(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#212121]/75 flex items-center justify-center p-4 z-[60]">
      <div className="bg-[#FFFFFF] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs border border-[#9E9E9E]/30">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-2xl shrink-0 ${
                variant === "danger"
                  ? "bg-red-100 text-red-600"
                  : variant === "warning"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-[#344ABF]/10 text-[#344ABF]"
              }`}
            >
              {variant === "danger" || variant === "warning" ? (
                <AlertTriangle className="w-6 h-6" />
              ) : (
                <CheckCircle2 className="w-6 h-6" />
              )}
            </div>
            <div>
              <h3 className="text-base font-black text-[#212121]">{title}</h3>
              <p className="text-[11px] text-[#9E9E9E] font-semibold">
                Please confirm before proceeding
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={processing}
            onClick={() => setConfirmModalData(null)}
            className="text-[#9E9E9E] hover:text-[#212121]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F5F6FA] border border-[#9E9E9E]/20 text-[#212121] font-medium leading-relaxed">
          {message}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1 font-black">
          <button
            type="button"
            disabled={processing}
            onClick={() => setConfirmModalData(null)}
            className="py-3 rounded-xl bg-[#F5F6FA] hover:bg-[#9E9E9E]/20 text-[#212121] transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={processing}
            onClick={handleConfirm}
            className={`py-3 rounded-xl text-[#FFFFFF] shadow-md transition disabled:opacity-50 ${
              variant === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : variant === "warning"
                ? "bg-amber-500 hover:bg-amber-600 !text-[#212121]"
                : "bg-[#344ABF] hover:opacity-95"
            }`}
          >
            {processing ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}