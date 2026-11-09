import React, { useState } from "react";
import { Search, Plus, Minus, HandCoins, X, Target } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatNaira } from "../utils/formatters";

export default function POSTerminal() {
  const {
    currentRole,
    stores,
    categories,
    inventory,
    posActiveStoreId,
    setPosActiveStoreId,
    activeStaffUser,
    getStoreName,
    posStoreUnpaidCredits,
    storeTargetMetrics,
    setActivePage,
    cart,
    setCart,
    addToCart,
    updateCartQty,
    updateCartImei,
    cartTotal,
    recordSaleTransaction,
  } = useAuth();

  const [posSearch, setPosSearch] = useState("");
  const [posCategory, setPosCategory] = useState("ALL");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentRef, setPaymentRef] = useState("");
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const activeTarget = storeTargetMetrics[posActiveStoreId] || {
    collected: 0,
    target: 0,
    percentage: 0,
  };

  const handleCompleteSale = async (e) => {
    e.preventDefault();
    if (
      paymentMethod === "Credit" &&
      (!customerName.trim() || !customerPhone.trim())
    ) {
      alert(
        "Customer Name and Phone Number are required when selling on Credit!"
      );
      return;
    }

    setSubmitting(true);
    const ok = await recordSaleTransaction({
      customerName,
      customerPhone,
      paymentMethod,
      paymentRef,
    });
    setSubmitting(false);

    if (ok) {
      setCustomerName("");
      setCustomerPhone("");
      setPaymentRef("");
      setMobileCartOpen(false);
    }
  };

  const storeProducts = inventory
    .filter((i) => i.storeId === posActiveStoreId)
    .filter((i) => posCategory === "ALL" || i.category === posCategory)
    .filter(
      (i) =>
        i.name.toLowerCase().includes(posSearch.toLowerCase()) ||
        i.sku.toLowerCase().includes(posSearch.toLowerCase())
    );

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
      {/* Left 65% Product Grid */}
      <div className="flex-1 p-4 sm:p-6 space-y-4">
        <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#9E9E9E]/30 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-[#344ABF]/10 text-[#344ABF] rounded">
                Active Cashier Session
              </span>
              <h1 className="text-lg font-black text-[#212121] mt-1">
                {getStoreName(posActiveStoreId)}
              </h1>
              <p className="text-xs text-[#9E9E9E]">
                Salesperson on Duty:{" "}
                <strong className="text-[#212121]">
                  {activeStaffUser?.name}
                </strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActivePage("credit")}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-400 text-left hover:bg-amber-100 transition"
              >
                <HandCoins className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-800 block">
                    Store Credit Out ({posStoreUnpaidCredits.length} Bills)
                  </span>
                  <span className="text-xs font-black text-[#212121]">
                    {formatNaira(
                      posStoreUnpaidCredits.reduce(
                        (a, b) => a + b.totalAmount,
                        0
                      )
                    )}{" "}
                    • View / Settle →
                  </span>
                </div>
              </button>

              {currentRole === "admin" && stores.length > 0 && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-[#9E9E9E] block">
                    Switch POS Branch
                  </label>
                  <select
                    value={posActiveStoreId}
                    onChange={(e) => {
                      setPosActiveStoreId(e.target.value);
                      setCart([]);
                    }}
                    className="mt-1 px-3 py-2 bg-[#F5F6FA] border border-[#9E9E9E]/30 rounded-xl text-xs font-bold text-[#212121]"
                  >
                    {stores.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Weekly Store Target Progress Bar (Visible on Sales Dashboard) */}
          <div className="p-3 bg-[#F5F6FA] rounded-xl border border-[#9E9E9E]/20 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-[#212121]">
                <Target className="w-4 h-4 text-[#344ABF]" />
                <span>Store Weekly Sales Target Progress</span>
              </span>
              <span className="text-[#344ABF] font-black">
                {formatNaira(activeTarget.collected)} /{" "}
                {formatNaira(activeTarget.target)} ({activeTarget.percentage}%)
              </span>
            </div>
            <div className="w-full bg-[#FFFFFF] h-2.5 rounded-full overflow-hidden border border-[#9E9E9E]/20">
              <div
                className="bg-[#344ABF] h-full transition-all duration-500 rounded-full"
                style={{ width: `${activeTarget.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-[#9E9E9E] absolute left-3.5 top-3" />
          <input
            type="text"
            value={posSearch}
            onChange={(e) => setPosSearch(e.target.value)}
            placeholder="Scan barcode or search phone screen, battery, IC, gadget..."
            className="w-full pl-11 pr-4 py-3 bg-[#FFFFFF] border border-[#9E9E9E]/30 rounded-2xl text-xs sm:text-sm font-medium shadow-sm focus:outline-none focus:border-[#344ABF]"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setPosCategory("ALL")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
              posCategory === "ALL"
                ? "bg-[#212121] text-[#FFFFFF]"
                : "bg-[#FFFFFF] border border-[#9E9E9E]/30 text-[#212121]"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setPosCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                posCategory === cat
                  ? "bg-[#344ABF] text-[#FFFFFF]"
                  : "bg-[#FFFFFF] border border-[#9E9E9E]/30 text-[#212121]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {storeProducts.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#9E9E9E]/30 rounded-2xl p-12 text-center text-xs text-[#9E9E9E]">
            No products found in this store branch yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {storeProducts.map((item) => {
              const inCart = cart.find((c) => c.id === item.id);
              const isLow = item.quantity <= item.threshold;
              const out = item.quantity <= 0;

              return (
                <button
                  key={item.id}
                  disabled={out}
                  onClick={() => addToCart(item)}
                  className={`text-left p-3.5 rounded-2xl border transition flex flex-col justify-between ${
                    out
                      ? "bg-[#F5F6FA] border-[#9E9E9E]/20 opacity-50 cursor-not-allowed"
                      : inCart
                      ? "bg-[#FFFFFF] border-2 border-[#344ABF] shadow-md"
                      : "bg-[#FFFFFF] border-[#9E9E9E]/30 hover:border-[#344ABF] shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-mono bg-[#F5F6FA] px-2 py-0.5 rounded font-bold text-[#9E9E9E]">
                        {item.sku}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          out
                            ? "bg-red-100 text-red-700"
                            : isLow
                            ? "bg-red-600 text-[#FFFFFF]"
                            : "bg-[#344ABF]/10 text-[#344ABF]"
                        }`}
                      >
                        {out ? "0 Left" : `${item.quantity} in stock`}
                      </span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-[#212121] line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-[#9E9E9E] mt-1">
                      {item.category}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#9E9E9E]/20 flex items-center justify-between">
                    <span className="font-black text-sm sm:text-base text-[#212121]">
                      {formatNaira(item.sellingPrice)}
                    </span>
                    <span className="text-xs font-black text-[#344ABF]">
                      {inCart ? `In Cart (${inCart.qty})` : "+ Add"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* MOBILE STICKY BOTTOM CHECKOUT BAR */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-14 left-0 right-0 p-3 bg-gradient-to-t from-[#212121]/90 to-transparent z-30">
          <button
            onClick={() => setMobileCartOpen(true)}
            className="w-full py-3.5 px-5 bg-[#344ABF] text-[#FFFFFF] rounded-2xl shadow-2xl flex items-center justify-between font-black text-sm"
          >
            <span>🛒 {cart.reduce((a, b) => a + b.qty, 0)} Items in Cart</span>
            <span>Checkout {formatNaira(cartTotal)} ↑</span>
          </button>
        </div>
      )}

      {/* RIGHT 35% DESKTOP CART + MOBILE SLIDE-UP DRAWER */}
      <div
        className={`${
          mobileCartOpen
            ? "fixed inset-0 z-50 bg-[#212121]/70 flex flex-col justify-end lg:static lg:bg-transparent"
            : "hidden lg:flex"
        } w-full lg:w-96 bg-[#FFFFFF] border-l border-[#9E9E9E]/30 flex-col justify-between shrink-0`}
      >
        <div className="bg-[#FFFFFF] rounded-t-3xl lg:rounded-none flex-1 flex flex-col max-h-[90vh] lg:max-h-none overflow-hidden">
          <div className="p-4 bg-[#212121] text-[#FFFFFF] flex items-center justify-between">
            <div>
              <h2 className="font-black text-sm">Active Customer Checkout</h2>
              <p className="text-[11px] text-[#9E9E9E]">
                Select Cash, Transfer, POS, or Credit Sale
              </p>
            </div>
            <button
              onClick={() => setMobileCartOpen(false)}
              className="lg:hidden p-1.5 rounded-lg bg-[#FFFFFF]/10 text-[#FFFFFF]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 divide-y divide-[#9E9E9E]/20">
            {cart.length === 0 ? (
              <div className="py-16 text-center text-[#9E9E9E] text-xs">
                Tap any product card to add it to the customer's bill.
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-3 space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-[#212121]">
                    <span>{item.name}</span>
                    <span>{formatNaira(item.price * item.qty)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-[#F5F6FA] rounded-lg p-1 border border-[#9E9E9E]/20">
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.id, -1)}
                        className="p-1 hover:bg-[#FFFFFF] rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 font-black">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.id, 1)}
                        className="p-1 hover:bg-[#FFFFFF] rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="IMEI / Serial / Note"
                      value={item.imei}
                      onChange={(e) => updateCartImei(item.id, e.target.value)}
                      className="flex-1 px-2.5 py-1.5 border border-[#9E9E9E]/30 rounded-lg font-mono text-[11px]"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={handleCompleteSale}
            className="p-4 bg-[#F5F6FA] border-t border-[#9E9E9E]/30 space-y-3 text-xs"
          >
            <div>
              <label className="text-[10px] font-bold uppercase text-[#9E9E9E] block mb-1">
                Payment Mode (Select "Credit" for Debt Sales)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {["Cash", "Transfer", "POS", "Credit"].map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    onClick={() => setPaymentMethod(mode)}
                    className={`py-2 rounded-xl font-black border transition ${
                      paymentMethod === mode
                        ? mode === "Credit"
                          ? "bg-amber-500 text-[#212121] border-amber-500"
                          : "bg-[#344ABF] text-[#FFFFFF] border-[#344ABF]"
                        : "bg-[#FFFFFF] text-[#212121] border-[#9E9E9E]/30"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required={paymentMethod === "Credit"}
                placeholder={
                  paymentMethod === "Credit"
                    ? "Customer Full Name *"
                    : "Customer Name"
                }
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={`px-3 py-2 bg-[#FFFFFF] border rounded-xl ${
                  paymentMethod === "Credit"
                    ? "border-amber-500 font-semibold"
                    : "border-[#9E9E9E]/30"
                }`}
              />
              <input
                type="tel"
                required={paymentMethod === "Credit"}
                placeholder={
                  paymentMethod === "Credit"
                    ? "Customer Phone *"
                    : "Customer Phone"
                }
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className={`px-3 py-2 bg-[#FFFFFF] border rounded-xl ${
                  paymentMethod === "Credit"
                    ? "border-amber-500 font-semibold"
                    : "border-[#9E9E9E]/30"
                }`}
              />
            </div>

            {(paymentMethod === "Transfer" ||
              paymentMethod === "POS" ||
              paymentMethod === "Credit") && (
              <input
                type="text"
                required
                placeholder={
                  paymentMethod === "Transfer"
                    ? "Bank Name & Sender / Session ID *"
                    : paymentMethod === "POS"
                    ? "POS Terminal Name & RRN Digits *"
                    : "Credit Note / Expected Repayment Date *"
                }
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#344ABF] rounded-xl font-semibold text-[#212121]"
              />
            )}

            <div className="flex items-center justify-between pt-2 border-t border-[#9E9E9E]/30">
              <span className="font-bold text-[#9E9E9E]">
                {paymentMethod === "Credit"
                  ? "CREDIT DEBT AMOUNT"
                  : "TOTAL AMOUNT"}
              </span>
              <span className="text-2xl font-black text-[#212121]">
                {formatNaira(cartTotal)}
              </span>
            </div>

            <button
              type="submit"
              disabled={cart.length === 0 || submitting}
              className={`w-full py-3.5 disabled:bg-[#9E9E9E]/40 font-black rounded-xl text-sm shadow-lg transition ${
                paymentMethod === "Credit"
                  ? "bg-amber-500 hover:bg-amber-600 text-[#212121]"
                  : "bg-[#344ABF] hover:opacity-95 text-[#FFFFFF]"
              }`}
            >
              {submitting
                ? "Recording Transaction..."
                : paymentMethod === "Credit"
                ? "⚠️ Record Credit Sale & Alert Admin"
                : "📲 Complete Sale & Send WhatsApp"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}