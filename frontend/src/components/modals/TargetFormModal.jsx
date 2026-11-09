import React, { useState, useEffect } from "react";
import { X, Target } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { formatNaira } from "../../utils/formatters";

export default function TargetFormModal() {
  const { stores, showTargetModal, setShowTargetModal, updateStoreTarget } =
    useAuth();
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (stores.length > 0 && !selectedStoreId) {
      setSelectedStoreId(stores[0].id);
    }
  }, [stores, selectedStoreId]);

  if (!showTargetModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStoreId || !targetAmount) return;
    setSaving(true);
    const ok = await updateStoreTarget(selectedStoreId, targetAmount);
    setSaving(false);
    if (ok) {
      setShowTargetModal(false);
      setTargetAmount("");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#212121]/70 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FFFFFF] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#344ABF]" />
            <h3 className="text-base font-black text-[#212121]">
              Set Store Weekly Sales Target
            </h3>
          </div>
          <button type="button" onClick={() => setShowTargetModal(false)}>
            <X className="w-5 h-5 text-[#9E9E9E]" />
          </button>
        </div>

        {stores.length === 0 ? (
          <p className="text-[#9E9E9E] py-4">
            Please create a store branch first before setting a weekly target.
          </p>
        ) : (
          <>
            <div>
              <label className="text-[10px] font-bold uppercase text-[#9E9E9E] block mb-1">
                Select Store Branch
              </label>
              <select
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl font-bold text-[#212121]"
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (Current: {formatNaira(s.weeklyTarget)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-[#9E9E9E] block mb-1">
                Weekly Target Amount (₦)
              </label>
              <input
                required
                type="number"
                placeholder="e.g. 750000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#9E9E9E]/30 rounded-xl font-black text-sm text-[#212121]"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-[#344ABF] disabled:opacity-50 text-[#FFFFFF] font-black rounded-xl"
            >
              {saving ? "Saving Target..." : "Save Weekly Sales Target"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}