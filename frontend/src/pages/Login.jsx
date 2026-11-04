import React from "react";
import { Smartphone, ShieldAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const {
    currentRole,
    setCurrentRole,
    activeStaffUser,
    setIsLoggedIn,
    handleSwitchRole,
  } = useAuth();

  return (
    <div className="min-h-screen bg-[#212121] flex flex-col lg:flex-row">
      {/* Left Branding Panel */}
      <div className="lg:w-5/12 p-8 lg:p-12 flex flex-col justify-between text-[#FFFFFF] border-b lg:border-b-0 lg:border-r border-[#9E9E9E]/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#344ABF]/20 border border-[#344ABF] text-[#FFFFFF] text-xs font-bold mb-6">
            <ShieldAlert className="w-4 h-4 text-[#344ABF]" />
            <span>Multi-Store Anti-Theft POS Architecture</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[#344ABF] p-3 rounded-2xl">
              <Smartphone className="w-8 h-8 text-[#FFFFFF]" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-[#FFFFFF]">
                ZEEDCOM-POS
              </h1>
              <p className="text-xs text-[#9E9E9E]">
                Phone Repair, Spare Parts & Gadget Inventory System
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 my-8">
          <div className="p-4 rounded-2xl bg-[#FFFFFF]/5 border border-[#9E9E9E]/20">
            <p className="font-bold text-sm text-[#FFFFFF]">
              1. Immutable Cashier & Credit Attribution
            </p>
            <p className="text-xs text-[#9E9E9E] mt-1">
              Every cash, transfer, POS, and credit sale is locked to the active
              staff member and branch. Staff cannot delete past records.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[#FFFFFF]/5 border border-[#9E9E9E]/20">
            <p className="font-bold text-sm text-[#FFFFFF]">
              2. Shared Store Credit Book & Instant WhatsApp Alerts
            </p>
            <p className="text-xs text-[#9E9E9E] mt-1">
              Credit sales are visible to all attendants in that store and roll
              automatically into the weekly sales total once repaid.
            </p>
          </div>
        </div>

        <p className="text-xs text-[#9E9E9E]">
          Designed for Zeedcom Multi-Branch Engineering & Gadget Stores
        </p>
      </div>

      {/* Right Login Card */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#F5F6FA]">
        <div className="bg-[#FFFFFF] border border-[#9E9E9E]/30 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-xl">
          <h2 className="text-2xl font-black text-[#212121]">
            Terminal Sign In
          </h2>
          <p className="text-xs text-[#9E9E9E] mt-1">
            Select a role below to access the Admin or Sales Staff interface
          </p>

          <div className="grid grid-cols-2 gap-2 my-5 p-1 bg-[#F5F6FA] rounded-2xl border border-[#9E9E9E]/20">
            <button
              type="button"
              onClick={() => setCurrentRole("admin")}
              className={`py-2.5 rounded-xl text-xs font-black transition ${
                currentRole === "admin"
                  ? "bg-[#212121] text-[#FFFFFF] shadow"
                  : "text-[#9E9E9E] hover:text-[#212121]"
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setCurrentRole("staff")}
              className={`py-2.5 rounded-xl text-xs font-black transition ${
                currentRole === "staff"
                  ? "bg-[#344ABF] text-[#FFFFFF] shadow"
                  : "text-[#9E9E9E] hover:text-[#212121]"
              }`}
            >
              Sales Staff
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-[#9E9E9E]">
                Account Email
              </label>
              <input
                type="email"
                readOnly
                value={
                  currentRole === "admin"
                    ? "engr.azeez@zeedcom.ng"
                    : activeStaffUser.email
                }
                className="w-full mt-1 px-4 py-3 bg-[#F5F6FA] border border-[#9E9E9E]/30 rounded-xl text-sm font-semibold text-[#212121]"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-[#9E9E9E]">
                Security Password
              </label>
              <input
                type="password"
                readOnly
                value="••••••••••••"
                className="w-full mt-1 px-4 py-3 bg-[#F5F6FA] border border-[#9E9E9E]/30 rounded-xl text-sm font-semibold text-[#212121]"
              />
            </div>

            <button
              onClick={() => {
                setIsLoggedIn(true);
                handleSwitchRole(currentRole);
              }}
              className="w-full py-3.5 bg-[#344ABF] hover:opacity-95 text-[#FFFFFF] font-black rounded-xl text-sm shadow-lg transition"
            >
              Enter{" "}
              {currentRole === "admin"
                ? "Admin Command Center"
                : "POS Sales Terminal"}{" "}
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}