import React, { useState } from "react";
import { Smartphone, ShieldAlert, Eye, EyeOff, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState("staff"); // 'staff' | 'admin'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setErrorMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    const result = login(email, password, selectedRole);
    if (!result.success) {
      setErrorMsg(result.error);
    }
  };

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
          © {new Date().getFullYear()} Zeedcom Stores. All rights reserved.
        </p>
      </div>

      {/* Right Login Card */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#F5F6FA]">
        <div className="bg-[#FFFFFF] border border-[#9E9E9E]/30 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-xl">
          <h2 className="text-2xl font-black text-[#212121]">
            Terminal Sign In
          </h2>
          <p className="text-xs text-[#9E9E9E] mt-1">
            Select your access level and enter your assigned credentials
          </p>

          {/* Staff vs Admin Selector */}
          <div className="grid grid-cols-2 gap-2 my-5 p-1 bg-[#F5F6FA] rounded-2xl border border-[#9E9E9E]/20">
            <button
              type="button"
              onClick={() => handleRoleChange("staff")}
              className={`py-2.5 rounded-xl text-xs font-black transition ${
                selectedRole === "staff"
                  ? "bg-[#344ABF] text-[#FFFFFF] shadow"
                  : "text-[#9E9E9E] hover:text-[#212121]"
              }`}
            >
              Sales Staff Login
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("admin")}
              className={`py-2.5 rounded-xl text-xs font-black transition ${
                selectedRole === "admin"
                  ? "bg-[#212121] text-[#FFFFFF] shadow"
                  : "text-[#9E9E9E] hover:text-[#212121]"
              }`}
            >
              Admin Login
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-[#9E9E9E]">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder={
                  selectedRole === "admin"
                    ? "admin@zeedcom.ng"
                    : "cashier@zeedcom.ng"
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-3 bg-[#F5F6FA] border border-[#9E9E9E]/30 rounded-xl text-sm font-semibold text-[#212121] focus:outline-none focus:border-[#344ABF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#9E9E9E]">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 bg-[#F5F6FA] border border-[#9E9E9E]/30 rounded-xl text-sm font-semibold text-[#212121] focus:outline-none focus:border-[#344ABF]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#9E9E9E] hover:text-[#212121]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#344ABF] hover:opacity-95 text-[#FFFFFF] font-black rounded-xl text-sm shadow-lg transition flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>
                Sign In as {selectedRole === "admin" ? "Administrator" : "Sales Staff"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}