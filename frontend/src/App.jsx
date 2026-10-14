import React, { useState, useMemo } from "react";
import {
  Smartphone,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Store,
  FileText,
  AlertTriangle,
  Plus,
  Minus,
  Trash2,
  Search,
  CheckCircle2,
  Printer,
  MessageSquare,
  Lock,
  Unlock,
  UserPlus,
  ArrowUpRight,
  Banknote,
  Landmark,
  CreditCard,
  Eye,
  EyeOff,
  LogOut,
  X,
  Filter,
  ShieldAlert,
  ChevronRight,
  Tag,
} from "lucide-react";

// ============================================================================
// INITIAL REALISTIC MOCK DATA (For UI Preview & Client Demo)
// ============================================================================
const INITIAL_STORES = [
  {
    id: "store-1",
    name: "Store 1: Challenge HQ",
    location: "Shop 14, Tech Plaza, Challenge",
    phone: "08031112222",
    manager: "Tunde Bakare",
  },
  {
    id: "store-2",
    name: "Store 2: Mokola Express",
    location: "Suite 6, GSM Village, Mokola",
    phone: "08053334444",
    manager: "Sadiq Yusuf",
  },
  {
    id: "store-3",
    name: "Store 3: Ring Road Hub",
    location: "Block B, Electronics Mall",
    phone: "08075556666",
    manager: "Chinedu Okafor",
  },
];

const INITIAL_CATEGORIES = [
  "Phone Screens (LCD/OLED)",
  "Batteries & Power",
  "Charging Flex & ICs",
  "Smartphones & Gadgets",
  "Accessories & Chargers",
];

const INITIAL_STAFF = [
  {
    id: "stf-1",
    name: "Tunde Bakare",
    email: "tunde@electropos.ng",
    role: "staff",
    storeId: "store-1",
    active: true,
    salesCount: 14,
  },
  {
    id: "stf-2",
    name: "Sadiq Yusuf",
    email: "sadiq@electropos.ng",
    role: "staff",
    storeId: "store-2",
    active: true,
    salesCount: 9,
  },
  {
    id: "stf-3",
    name: "Blessing Adeyemi",
    email: "blessing@electropos.ng",
    role: "staff",
    storeId: "store-1",
    active: true,
    salesCount: 11,
  },
  {
    id: "stf-4",
    name: "Chinedu Okafor",
    email: "chinedu@electropos.ng",
    role: "staff",
    storeId: "store-3",
    active: false,
    salesCount: 4,
  },
];

const INITIAL_INVENTORY = [
  {
    id: "inv-1",
    sku: "SCR-IP13PM-OLED",
    name: "iPhone 13 Pro Max Original OLED Screen",
    category: "Phone Screens (LCD/OLED)",
    storeId: "store-1",
    costPrice: 68000,
    sellingPrice: 85000,
    quantity: 2,
    threshold: 5,
    trackImei: true,
  },
  {
    id: "inv-2",
    sku: "SCR-SAM-A54",
    name: "Samsung Galaxy A54 Super AMOLED Service Pack",
    category: "Phone Screens (LCD/OLED)",
    storeId: "store-1",
    costPrice: 42000,
    sellingPrice: 55000,
    quantity: 12,
    threshold: 4,
    trackImei: false,
  },
  {
    id: "inv-3",
    sku: "IC-SAM-A54-SUB",
    name: "Samsung A54 Original Charging Port Sub-Board",
    category: "Charging Flex & ICs",
    storeId: "store-2",
    costPrice: 4500,
    sellingPrice: 9500,
    quantity: 1,
    threshold: 5,
    trackImei: false,
  },
  {
    id: "inv-4",
    sku: "BAT-INF-N30",
    name: "Infinix Note 30 / Note 30 Pro Battery (BL-49NX)",
    category: "Batteries & Power",
    storeId: "store-2",
    costPrice: 8500,
    sellingPrice: 14500,
    quantity: 16,
    threshold: 5,
    trackImei: false,
  },
  {
    id: "inv-5",
    sku: "GAD-IP12-128",
    name: "iPhone 12 128GB Factory Unlocked (UK Used)",
    category: "Smartphones & Gadgets",
    storeId: "store-1",
    costPrice: 310000,
    sellingPrice: 365000,
    quantity: 4,
    threshold: 2,
    trackImei: true,
  },
  {
    id: "inv-6",
    sku: "ACC-ORA-20K",
    name: "Oraimo 20,000mAh Traveler Fast PowerBank",
    category: "Accessories & Chargers",
    storeId: "store-3",
    costPrice: 13500,
    sellingPrice: 19500,
    quantity: 3,
    threshold: 5,
    trackImei: false,
  },
  {
    id: "inv-7",
    sku: "ACC-20W-USB-C",
    name: "Apple 20W USB-C Fast Power Adapter",
    category: "Accessories & Chargers",
    storeId: "store-1",
    costPrice: 7500,
    sellingPrice: 12500,
    quantity: 24,
    threshold: 6,
    trackImei: false,
  },
];

const INITIAL_SALES = [
  {
    id: "sale-101",
    receiptNo: "RCP-20261013-8492",
    storeId: "store-1",
    staffName: "Tunde Bakare",
    customerName: "Mr. Adebayo",
    customerPhone: "08030001122",
    paymentMethod: "Transfer",
    paymentRef: "GTBank - Sess 99281",
    totalAmount: 97500,
    timestamp: "2026-10-13 14:22",
    items: [
      {
        name: "iPhone 13 Pro Max Original OLED Screen",
        qty: 1,
        price: 85000,
        imei: "SN-8829102",
      },
      {
        name: "Apple 20W USB-C Fast Power Adapter",
        qty: 1,
        price: 12500,
        imei: "",
      },
    ],
  },
  {
    id: "sale-102",
    receiptNo: "RCP-20261013-8491",
    storeId: "store-2",
    staffName: "Sadiq Yusuf",
    customerName: "Walk-in Technician",
    customerPhone: "08029998877",
    paymentMethod: "Cash",
    paymentRef: "Cash Drawer",
    totalAmount: 24000,
    timestamp: "2026-10-13 13:45",
    items: [
      {
        name: "Infinix Note 30 Battery (BL-49NX)",
        qty: 1,
        price: 14500,
        imei: "",
      },
      {
        name: "Samsung A54 Original Charging Port Sub-Board",
        qty: 1,
        price: 9500,
        imei: "",
      },
    ],
  },
  {
    id: "sale-103",
    receiptNo: "RCP-20261013-8490",
    storeId: "store-1",
    staffName: "Blessing Adeyemi",
    customerName: "Mrs. Folake",
    customerPhone: "08091113344",
    paymentMethod: "POS",
    paymentRef: "Moniepoint RRN 4410",
    totalAmount: 365000,
    timestamp: "2026-10-13 12:10",
    items: [
      {
        name: "iPhone 12 128GB Factory Unlocked (UK Used)",
        qty: 1,
        price: 365000,
        imei: "358920104928172",
      },
    ],
  },
];

const formatNaira = (num) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(num || 0);

// ============================================================================
// MAIN APPLICATION UI COMPONENT
// ============================================================================
export default function App() {
  // Navigation & Role Simulation State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentRole, setCurrentRole] = useState("admin"); // 'admin' | 'staff'
  const [activePage, setActivePage] = useState("dashboard"); // 'dashboard' | 'pos' | 'inventory' | 'stores' | 'sales'
  const [adminWaNumber, setAdminWaNumber] = useState("2348031234567");

  // Core Data State
  const [stores, setStores] = useState(INITIAL_STORES);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [sales, setSales] = useState(INITIAL_SALES);

  // Global Filters
  const [selectedStoreFilter, setSelectedStoreFilter] = useState("ALL");
  const [posActiveStoreId, setPosActiveStoreId] = useState("store-1");
  const [activeStaffUser, setActiveStaffUser] = useState(INITIAL_STAFF[0]);

  // POS State
  const [posSearch, setPosSearch] = useState("");
  const [posCategory, setPosCategory] = useState("ALL");
  const [cart, setCart] = useState([
    {
      id: "inv-1",
      name: "iPhone 13 Pro Max Original OLED Screen",
      price: 85000,
      qty: 1,
      maxStock: 2,
      imei: "SN-99201948",
    },
  ]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentRef, setPaymentRef] = useState("");
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  // Modals State
  const [receiptModalData, setReceiptModalData] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [lowStockExpanded, setLowStockExpanded] = useState(true);

  // Form States for Modals
  const [newProduct, setNewProduct] = useState({
    sku: "",
    name: "",
    category: INITIAL_CATEGORIES[0],
    storeId: "store-1",
    costPrice: "",
    sellingPrice: "",
    quantity: "",
    threshold: 5,
  });
  const [newStore, setNewStore] = useState({
    name: "",
    location: "",
    phone: "",
    manager: "",
  });
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    storeId: "store-1",
  });

  // Switch Role Handler (For UI Demo)
  const handleSwitchRole = (role) => {
    setCurrentRole(role);
    if (role === "staff") {
      setActivePage("pos");
      setPosActiveStoreId(activeStaffUser.storeId);
    } else {
      setActivePage("dashboard");
    }
  };

  // Filtered Low Stock Items
  const lowStockItems = useMemo(() => {
    return inventory.filter((item) => {
      const storeMatch =
        selectedStoreFilter === "ALL" || item.storeId === selectedStoreFilter;
      return storeMatch && item.quantity <= item.threshold;
    });
  }, [inventory, selectedStoreFilter]);

  // Filtered Sales for Dashboard & Audit
  const filteredSales = useMemo(() => {
    return sales.filter(
      (s) => selectedStoreFilter === "ALL" || s.storeId === selectedStoreFilter,
    );
  }, [sales, selectedStoreFilter]);

  // Financial KPIs
  const kpis = useMemo(() => {
    const rev = filteredSales.reduce((acc, s) => acc + s.totalAmount, 0);
    const cash = filteredSales
      .filter((s) => s.paymentMethod === "Cash")
      .reduce((acc, s) => acc + s.totalAmount, 0);
    const transfer = filteredSales
      .filter((s) => s.paymentMethod === "Transfer")
      .reduce((acc, s) => acc + s.totalAmount, 0);
    const pos = filteredSales
      .filter((s) => s.paymentMethod === "POS")
      .reduce((acc, s) => acc + s.totalAmount, 0);

    const storeInv = inventory.filter(
      (i) => selectedStoreFilter === "ALL" || i.storeId === selectedStoreFilter,
    );
    const totalUnits = storeInv.reduce((acc, i) => acc + i.quantity, 0);
    const stockValue = storeInv.reduce(
      (acc, i) => acc + i.quantity * i.sellingPrice,
      0,
    );

    return { rev, cash, transfer, pos, totalUnits, stockValue };
  }, [filteredSales, inventory, selectedStoreFilter]);

  // POS Cart Helpers
  const addToCart = (invItem) => {
    if (invItem.quantity <= 0) return;
    setCart((prev) => {
      const exists = prev.find((c) => c.id === invItem.id);
      if (exists) {
        if (exists.qty + 1 > invItem.quantity) return prev;
        return prev.map((c) =>
          c.id === invItem.id ? { ...c, qty: c.qty + 1 } : c,
        );
      }
      return [
        ...prev,
        {
          id: invItem.id,
          name: invItem.name,
          price: invItem.sellingPrice,
          qty: 1,
          maxStock: invItem.quantity,
          imei: "",
        },
      ];
    });
  };

  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.id !== id) return c;
          const next = c.qty + delta;
          if (next > c.maxStock) return c;
          return next > 0 ? { ...c, qty: next } : null;
        })
        .filter(Boolean),
    );
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  const handleCompleteSale = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const receiptNo = `RCP-20261013-${Math.floor(1000 + Math.random() * 9000)}`;
    const storeObj = stores.find((s) => s.id === posActiveStoreId);
    const newSaleRecord = {
      id: `sale-${Date.now()}`,
      receiptNo,
      storeId: posActiveStoreId,
      storeName: storeObj?.name || "Main Store",
      staffName:
        currentRole === "admin" ? "Engr. Kunle (Admin)" : activeStaffUser.name,
      customerName: customerName || "Walk-in Customer",
      customerPhone: customerPhone || "N/A",
      paymentMethod,
      paymentRef:
        paymentMethod === "Cash" ? "Cash Drawer" : paymentRef || "Verified",
      totalAmount: cartTotal,
      timestamp: new Date().toLocaleString("en-NG", {
        dateStyle: "short",
        timeStyle: "short",
      }),
      items: cart.map((c) => ({
        name: c.name,
        qty: c.qty,
        price: c.price,
        imei: c.imei,
      })),
    };

    // Deduct stock in UI state
    setInventory((prev) =>
      prev.map((inv) => {
        const sold = cart.find((c) => c.id === inv.id);
        return sold
          ? { ...inv, quantity: Math.max(0, inv.quantity - sold.qty) }
          : inv;
      }),
    );

    setSales((prev) => [newSaleRecord, ...prev]);
    setReceiptModalData(newSaleRecord);
    setCart([]);
    setCustomerName("");
    setCustomerPhone("");
    setPaymentRef("");
    setMobileCartOpen(false);
  };

  const getStoreName = (storeId) =>
    stores.find((s) => s.id === storeId)?.name || "Unknown Store";

  // ==========================================================================
  // PAGE 1: LOGIN SCREEN UI
  // ==========================================================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#111827] flex flex-col lg:flex-row">
        {/* Left Branding Panel */}
        <div className="lg:w-5/12 p-8 lg:p-12 flex flex-col justify-between text-white border-b lg:border-b-0 lg:border-r border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-6">
              <ShieldAlert className="w-4 h-4" />
              <span>Multi-Store Anti-Theft POS Architecture</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[#047857] p-3 rounded-2xl">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  ZEEDCOM-POS
                </h1>
                <p className="text-xs text-slate-400">
                  Phone Repair, Spare Parts & Gadget Inventory System
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 my-8">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <p className="font-bold text-sm text-emerald-400">
                1. Immutable Cashier Attribution
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Every sale is permanently locked to the active staff member and
                store branch. Staff cannot delete or alter past receipts.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <p className="font-bold text-sm text-emerald-400">
                2. Instant WhatsApp Receipt Dispatch
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Every checkout dispatches an itemized receipt with payment mode
                and low-stock warnings straight to the owner's WhatsApp.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Designed for Multi-Branch Engineering & Gadget Stores
          </p>
        </div>

        {/* Right Login Card */}
        <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-xl">
            <h2 className="text-2xl font-black text-slate-900">
              Terminal Sign In
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select a role below to preview either the Owner or Cashier
              interface
            </p>

            <div className="grid grid-cols-2 gap-2 my-5 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setCurrentRole("admin")}
                className={`py-2.5 rounded-xl text-xs font-black transition ${
                  currentRole === "admin"
                    ? "bg-[#111827] text-white shadow"
                    : "text-slate-600"
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setCurrentRole("staff")}
                className={`py-2.5 rounded-xl text-xs font-black transition ${
                  currentRole === "staff"
                    ? "bg-[#047857] text-white shadow"
                    : "text-slate-600"
                }`}
              >
               Sales Staff
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-600">
                  Account Email
                </label>
                <input
                  type="email"
                  readOnly
                  value={
                    currentRole === "admin"
                      ? "engr.owner@electropos.ng"
                      : activeStaffUser.email
                  }
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-600">
                  Security Password
                </label>
                <input
                  type="password"
                  readOnly
                  value="••••••••••••"
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800"
                />
              </div>

              <button
                onClick={() => {
                  setIsLoggedIn(true);
                  handleSwitchRole(currentRole);
                }}
                className="w-full py-3.5 bg-[#047857] hover:bg-emerald-800 text-white font-black rounded-xl text-sm shadow-lg transition"
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

  // ==========================================================================
  // AUTHENTICATED SHELL (Desktop Left Sidebar + Mobile Top/Bottom Bars)
  // ==========================================================================
  const navLinks =
    currentRole === "admin"
      ? [
          { id: "dashboard", label: "Admin Command", icon: LayoutDashboard },
          { id: "pos", label: "POS Terminal", icon: ShoppingCart },
          { id: "inventory", label: "Stock & Parts", icon: Package },
          { id: "stores", label: "Stores & Staff", icon: Store },
          { id: "sales", label: "Sales Audit", icon: FileText },
        ]
      : [
          { id: "pos", label: "POS Terminal", icon: ShoppingCart },
          { id: "sales", label: "My Shift Sales", icon: FileText },
        ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row text-slate-900">
      {/* ================================================================= */}
      {/* DESKTOP SIDEBAR (Hidden on Mobile)                                */}
      {/* ================================================================= */}
      <aside className="hidden lg:flex w-64 bg-[#111827] text-white flex-col justify-between shrink-0 min-h-screen select-none">
        <div>
          {/* Brand Logo */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="bg-[#047857] p-2.5 rounded-xl text-white">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight leading-none">
                ZEEDCOM-POS
              </h1>
              <span className="text-[11px] text-emerald-400 font-semibold">
                Multi-Store System
              </span>
            </div>
          </div>

          {/* Interactive Role Switcher for UI Testing */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              UI Preview Role Switcher
            </span>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => handleSwitchRole("admin")}
                className={`py-1.5 rounded-lg text-xs font-bold transition ${
                  currentRole === "admin"
                    ? "bg-[#047857] text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Admin View
              </button>
              <button
                onClick={() => handleSwitchRole("staff")}
                className={`py-1.5 rounded-lg text-xs font-bold transition ${
                  currentRole === "staff"
                    ? "bg-[#047857] text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Staff View
              </button>
            </div>
            <p className="text-xs font-bold text-white mt-3 truncate">
              {currentRole === "admin"
                ? "Engr. Azeez (Admin)"
                : activeStaffUser.name}
            </p>
            <p className="text-[11px] text-emerald-400 truncate">
              {currentRole === "admin"
                ? `All ${stores.length} Stores Access`
                : getStoreName(activeStaffUser.storeId)}
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
                      ? "bg-[#047857] text-white shadow-md"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.id === "inventory" && lowStockItems.length > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-black bg-red-600 text-white rounded-full">
                      {lowStockItems.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom WhatsApp Audit Target & Sign Out */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block">
              WhatsApp Audit Line
            </span>
            <p className="font-mono font-bold text-white mt-0.5">
              +{adminWaNumber}
            </p>
          </div>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white text-xs font-bold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock / Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ================================================================= */}
      {/* MOBILE TOP HEADER BAR (Visible on Mobile & Tablet)                */}
      {/* ================================================================= */}
      <header className="lg:hidden bg-[#111827] text-white px-4 py-3 sticky top-0 z-30 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="bg-[#047857] p-1.5 rounded-lg">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <span className="font-black text-sm tracking-tight block leading-none">
              ELECTRO-POS
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">
              {currentRole === "admin" ? "Master Admin" : activeStaffUser.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              handleSwitchRole(currentRole === "admin" ? "staff" : "admin")
            }
            className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-bold text-emerald-400"
          >
            Switch to {currentRole === "admin" ? "Staff" : "Admin"}
          </button>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ================================================================= */}
      {/* MAIN CONTENT WORKSPACE                                            */}
      {/* ================================================================= */}
      <main className="flex-1 overflow-y-auto pb-24 lg:pb-8">
        {/* =============================================================== */}
        {/* PAGE 2: ADMIN COMMAND CENTER DASHBOARD                          */}
        {/* =============================================================== */}
        {activePage === "dashboard" && currentRole === "admin" && (
          <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
            {/* Top Bar + Store Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  Executive Multi-Store Command
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Real-time stock alerts, store-by-store valuation, and staff
                  sales audit
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm">
                <Store className="w-4 h-4 text-[#047857] shrink-0" />
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Store:
                </span>
                <select
                  value={selectedStoreFilter}
                  onChange={(e) => setSelectedStoreFilter(e.target.value)}
                  className="text-xs sm:text-sm font-black text-slate-900 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="ALL">
                    All Stores Combined ({stores.length})
                  </option>
                  {stores.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* BOLD LOW STOCK NOTIFICATION BANNER */}
            {lowStockItems.length > 0 && (
              <div className="bg-red-600 text-white rounded-2xl p-4 sm:p-5 shadow-lg border-2 border-red-400">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="bg-white text-red-600 p-2.5 rounded-xl shrink-0 animate-pulse">
                      <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black uppercase tracking-wide">
                        CRITICAL LOW STOCK ALERT ({lowStockItems.length}{" "}
                        PRODUCTS LOW)
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
                      className="px-3 py-2 bg-white text-red-700 font-black rounded-xl text-xs shadow-sm"
                    >
                      + Restock Now
                    </button>
                    <button
                      onClick={() => setLowStockExpanded(!lowStockExpanded)}
                      className="px-3 py-2 bg-red-800 hover:bg-red-900 text-white font-bold rounded-xl text-xs"
                    >
                      {lowStockExpanded ? "Hide" : "Show All"}
                    </button>
                  </div>
                </div>

                {lowStockExpanded && (
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
                          <p className="font-bold text-xs sm:text-sm text-white mt-1">
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
            )}

            {/* KPI SUMMARY CARDS (2 Cols on Mobile, 5 Cols on Desktop) */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="col-span-2 lg:col-span-1 bg-[#111827] text-white p-4 sm:p-5 rounded-2xl shadow-sm">
                <span className="text-[11px] font-bold uppercase text-emerald-400">
                  Total Sales Revenue
                </span>
                <p className="text-2xl font-black mt-1">
                  {formatNaira(kpis.rev)}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {filteredSales.length} verified receipts
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between text-emerald-700">
                  <span className="text-[11px] font-bold uppercase">
                    Cash in Drawer
                  </span>
                  <Banknote className="w-4 h-4" />
                </div>
                <p className="text-xl font-black text-slate-900 mt-1">
                  {formatNaira(kpis.cash)}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Expected physical cash
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between text-blue-600">
                  <span className="text-[11px] font-bold uppercase">
                    Bank Transfer
                  </span>
                  <Landmark className="w-4 h-4" />
                </div>
                <p className="text-xl font-black text-slate-900 mt-1">
                  {formatNaira(kpis.transfer)}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Check bank alert refs
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between text-purple-600">
                  <span className="text-[11px] font-bold uppercase">
                    POS Terminal
                  </span>
                  <CreditCard className="w-4 h-4" />
                </div>
                <p className="text-xl font-black text-slate-900 mt-1">
                  {formatNaira(kpis.pos)}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Card settlements
                </p>
              </div>

              <div className="col-span-2 lg:col-span-1 bg-emerald-50 border border-emerald-200 p-4 sm:p-5 rounded-2xl shadow-sm">
                <span className="text-[11px] font-bold uppercase text-emerald-800">
                  Store Stock Value
                </span>
                <p className="text-xl font-black text-emerald-950 mt-1">
                  {formatNaira(kpis.stockValue)}
                </p>
                <p className="text-[11px] text-emerald-700 font-bold mt-1">
                  {kpis.totalUnits} total units in stock
                </p>
              </div>
            </div>

            {/* STORE-BY-STORE STOCK & SALES BREAKDOWN */}
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-3">
                Branch-by-Branch Stock & Sales Breakdown
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stores.map((st) => {
                  const stInv = inventory.filter((i) => i.storeId === st.id);
                  const stUnits = stInv.reduce((a, b) => a + b.quantity, 0);
                  const stVal = stInv.reduce(
                    (a, b) => a + b.quantity * b.sellingPrice,
                    0,
                  );
                  const stSales = sales
                    .filter((s) => s.storeId === st.id)
                    .reduce((a, b) => a + b.totalAmount, 0);
                  const stLow = stInv.filter(
                    (i) => i.quantity <= i.threshold,
                  ).length;

                  return (
                    <div
                      key={st.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-black text-base text-slate-900">
                            {st.name}
                          </h3>
                          {stLow > 0 ? (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[11px] font-bold">
                              {stLow} Low Stock
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold">
                              Stock Healthy
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {st.location}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 my-4 p-3 bg-slate-50 rounded-xl text-xs">
                        <div>
                          <span className="text-slate-400 block">
                            Stock Units
                          </span>
                          <span className="font-black text-sm text-slate-900">
                            {stUnits} items
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            {formatNaira(stVal)}
                          </span>
                        </div>
                        <div className="border-l border-slate-200 pl-3">
                          <span className="text-slate-400 block">
                            Recorded Sales
                          </span>
                          <span className="font-black text-sm text-[#047857]">
                            {formatNaira(stSales)}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            Lead: {st.manager}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedStoreFilter(st.id)}
                        className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
                      >
                        Filter Dashboard to {st.name.split(":")[0]}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RECENT SALES AUDIT LOG (Responsive Table on Desktop + Cards on Mobile) */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="font-black text-base text-slate-900">
                    Live Cashier Sales & WhatsApp Audit Feed
                  </h2>
                  <p className="text-xs text-slate-500">
                    Attached to active salesperson login • Zero-delete
                    protection active
                  </p>
                </div>
                <button
                  onClick={() => setActivePage("sales")}
                  className="text-xs font-bold text-[#047857] hover:underline flex items-center gap-1"
                >
                  <span>Full History</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200">
                      <th className="py-3 px-4">Receipt / Time</th>
                      <th className="py-3 px-4">Store Branch</th>
                      <th className="py-3 px-4">Salesperson</th>
                      <th className="py-3 px-4">Sold Items & IMEI</th>
                      <th className="py-3 px-4">Payment Mode</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4 text-center">
                        WhatsApp Receipt
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4">
                          <p className="font-black text-slate-900">
                            {sale.receiptNo}
                          </p>
                          <p className="text-slate-400">{sale.timestamp}</p>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-700">
                          {getStoreName(sale.storeId)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 font-bold text-slate-800">
                            {sale.staffName}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {sale.items.map((it, idx) => (
                            <div key={idx} className="text-slate-700">
                              <strong>{it.qty}x</strong> {it.name}
                              {it.imei && (
                                <span className="ml-1 text-[11px] font-mono text-slate-400">
                                  [{it.imei}]
                                </span>
                              )}
                            </div>
                          ))}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded font-bold ${
                              sale.paymentMethod === "Cash"
                                ? "bg-emerald-100 text-emerald-800"
                                : sale.paymentMethod === "Transfer"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {sale.paymentMethod}
                          </span>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {sale.paymentRef}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-right font-black text-sm text-slate-900">
                          {formatNaira(sale.totalAmount)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => setReceiptModalData(sale)}
                            className="px-3 py-1.5 bg-[#047857] hover:bg-emerald-800 text-white rounded-lg font-bold inline-flex items-center gap-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>View WA</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Audit Cards */}
              <div className="md:hidden divide-y divide-slate-100">
                {filteredSales.map((sale) => (
                  <div key={sale.id} className="p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900">
                        {sale.receiptNo}
                      </span>
                      <span className="font-black text-sm text-[#047857]">
                        {formatNaira(sale.totalAmount)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 bg-slate-100 rounded font-bold text-slate-700">
                        {getStoreName(sale.storeId)}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 rounded font-bold text-slate-700">
                        Staff: {sale.staffName}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold">
                        {sale.paymentMethod} ({sale.paymentRef})
                      </span>
                    </div>
                    <div className="text-slate-600">
                      {sale.items.map((it, idx) => (
                        <p key={idx}>
                          • {it.qty}x {it.name} {it.imei && `[${it.imei}]`}
                        </p>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400">
                        {sale.timestamp}
                      </span>
                      <button
                        onClick={() => setReceiptModalData(sale)}
                        className="px-3 py-1.5 bg-[#047857] text-white rounded-lg font-bold"
                      >
                        📲 WhatsApp Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* PAGE 3: SUPERMARKET FAST POS TERMINAL (Desktop + Mobile Drawer) */}
        {/* =============================================================== */}
        {activePage === "pos" && (
          <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
            {/* Left 65% Product Grid */}
            <div className="flex-1 p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                    Active Cashier Session
                  </span>
                  <h1 className="text-lg font-black text-slate-900 mt-1">
                    {getStoreName(posActiveStoreId)}
                  </h1>
                  <p className="text-xs text-slate-500">
                    Salesperson on Duty:{" "}
                    <strong className="text-slate-800">
                      {currentRole === "admin"
                        ? "Engr. Kunle (Admin)"
                        : activeStaffUser.name}
                    </strong>
                  </p>
                </div>

                {currentRole === "admin" && (
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block">
                      Switch POS Branch
                    </label>
                    <select
                      value={posActiveStoreId}
                      onChange={(e) => {
                        setPosActiveStoreId(e.target.value);
                        setCart([]);
                      }}
                      className="mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
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

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={posSearch}
                  onChange={(e) => setPosSearch(e.target.value)}
                  placeholder="Scan barcode or search phone screen, battery, IC, gadget..."
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium shadow-sm focus:outline-none focus:border-[#047857]"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setPosCategory("ALL")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                    posCategory === "ALL"
                      ? "bg-[#111827] text-white"
                      : "bg-white border border-slate-200 text-slate-700"
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
                        ? "bg-[#047857] text-white"
                        : "bg-white border border-slate-200 text-slate-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Product Cards Grid (2 Cols on Mobile, 3 Cols on Desktop) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {inventory
                  .filter((i) => i.storeId === posActiveStoreId)
                  .filter(
                    (i) => posCategory === "ALL" || i.category === posCategory,
                  )
                  .filter(
                    (i) =>
                      i.name.toLowerCase().includes(posSearch.toLowerCase()) ||
                      i.sku.toLowerCase().includes(posSearch.toLowerCase()),
                  )
                  .map((item) => {
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
                            ? "bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed"
                            : inCart
                              ? "bg-white border-2 border-[#047857] shadow-md"
                              : "bg-white border-slate-200 hover:border-[#047857] shadow-sm"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-600">
                              {item.sku}
                            </span>
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                out
                                  ? "bg-red-100 text-red-700"
                                  : isLow
                                    ? "bg-red-600 text-white"
                                    : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {out ? "0 Left" : `${item.quantity} in stock`}
                            </span>
                          </div>
                          <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {item.category}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          <span className="font-black text-sm sm:text-base text-slate-900">
                            {formatNaira(item.sellingPrice)}
                          </span>
                          <span className="text-xs font-black text-[#047857]">
                            {inCart ? `In Cart (${inCart.qty})` : "+ Add"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* MOBILE STICKY BOTTOM CHECKOUT BAR (Opens Slide-Up Cart Drawer) */}
            {cart.length > 0 && (
              <div className="lg:hidden fixed bottom-14 left-0 right-0 p-3 bg-gradient-to-t from-slate-900/90 to-transparent z-30">
                <button
                  onClick={() => setMobileCartOpen(true)}
                  className="w-full py-3.5 px-5 bg-[#047857] text-white rounded-2xl shadow-2xl flex items-center justify-between font-black text-sm"
                >
                  <span>
                    🛒 {cart.reduce((a, b) => a + b.qty, 0)} Items in Cart
                  </span>
                  <span>Checkout {formatNaira(cartTotal)} ↑</span>
                </button>
              </div>
            )}

            {/* RIGHT 35% DESKTOP CART + MOBILE SLIDE-UP DRAWER */}
            <div
              className={`${
                mobileCartOpen
                  ? "fixed inset-0 z-50 bg-slate-900/70 flex flex-col justify-end lg:static lg:bg-transparent"
                  : "hidden lg:flex"
              } w-full lg:w-96 bg-white border-l border-slate-200 flex-col justify-between shrink-0`}
            >
              <div className="bg-white rounded-t-3xl lg:rounded-none flex-1 flex flex-col max-h-[90vh] lg:max-h-none overflow-hidden">
                <div className="p-4 bg-[#111827] text-white flex items-center justify-between">
                  <div>
                    <h2 className="font-black text-sm">
                      Active Customer Checkout
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Receipt auto-dispatches to Admin WhatsApp
                    </p>
                  </div>
                  <button
                    onClick={() => setMobileCartOpen(false)}
                    className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Cart Line Items */}
                <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
                  {cart.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 text-xs">
                      Tap any product card to add it to the customer's bill.
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="py-3 space-y-2 text-xs">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{item.name}</span>
                          <span>{formatNaira(item.price * item.qty)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-slate-100 rounded-lg p-1">
                            <button
                              type="button"
                              onClick={() => updateCartQty(item.id, -1)}
                              className="p-1 hover:bg-white rounded"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 font-black">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQty(item.id, 1)}
                              className="p-1 hover:bg-white rounded"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="IMEI / Serial / Job Note"
                            value={item.imei}
                            onChange={(e) =>
                              setCart((prev) =>
                                prev.map((c) =>
                                  c.id === item.id
                                    ? { ...c, imei: e.target.value }
                                    : c,
                                ),
                              )
                            }
                            className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-lg font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Payment & Checkout Form */}
                <form
                  onSubmit={handleCompleteSale}
                  className="p-4 bg-slate-50 border-t border-slate-200 space-y-3 text-xs"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Customer Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl"
                    />
                    <input
                      type="tel"
                      placeholder="Customer Phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                      Payment Mode (Required)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Cash", "Transfer", "POS"].map((mode) => (
                        <button
                          type="button"
                          key={mode}
                          onClick={() => setPaymentMethod(mode)}
                          className={`py-2 rounded-xl font-black border transition ${
                            paymentMethod === mode
                              ? "bg-[#047857] text-white border-[#047857]"
                              : "bg-white text-slate-700 border-slate-200"
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(paymentMethod === "Transfer" ||
                    paymentMethod === "POS") && (
                    <input
                      type="text"
                      required
                      placeholder={
                        paymentMethod === "Transfer"
                          ? "Bank Name & Sender / Session ID *"
                          : "POS Terminal Name & RRN Digits *"
                      }
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      className="w-full px-3 py-2 bg-amber-50 border border-amber-400 rounded-xl font-semibold"
                    />
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-500">
                      TOTAL AMOUNT
                    </span>
                    <span className="text-2xl font-black text-slate-900">
                      {formatNaira(cartTotal)}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={cart.length === 0}
                    className="w-full py-3.5 bg-[#047857] hover:bg-emerald-800 disabled:bg-slate-300 text-white font-black rounded-xl text-sm shadow-lg transition"
                  >
                    📲 Complete Sale & Send WhatsApp
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* PAGE 4: MULTI-STORE INVENTORY & CATEGORY MANAGER                */}
        {/* =============================================================== */}
        {activePage === "inventory" && (
          <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  Multi-Store Stock & Categories
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Monitor stock across branches, set low-stock alert limits, and
                  add new products
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedStoreFilter}
                  onChange={(e) => setSelectedStoreFilter(e.target.value)}
                  className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="ALL">All Stores ({stores.length})</option>
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowProductModal(true)}
                  className="px-4 py-2.5 bg-[#047857] text-white rounded-xl text-xs font-black shadow-sm"
                >
                  + Add / Restock Product
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 shrink-0 flex items-center gap-1.5"
                >
                  <Tag className="w-3 h-3 text-[#047857]" />
                  {cat}
                </span>
              ))}
            </div>

            {/* Inventory Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200">
                      <th className="py-3.5 px-4">SKU & Product Name</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Store Branch</th>
                      <th className="py-3.5 px-4 text-right">Cost Price</th>
                      <th className="py-3.5 px-4 text-right">Selling Price</th>
                      <th className="py-3.5 px-4 text-center">Stock Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inventory
                      .filter(
                        (i) =>
                          selectedStoreFilter === "ALL" ||
                          i.storeId === selectedStoreFilter,
                      )
                      .map((item) => {
                        const isLow = item.quantity <= item.threshold;
                        return (
                          <tr
                            key={item.id}
                            className={
                              isLow ? "bg-red-50/70" : "hover:bg-slate-50"
                            }
                          >
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-slate-900 text-sm">
                                {item.name}
                              </p>
                              <p className="font-mono text-[11px] text-slate-400">
                                {item.sku}
                              </p>
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-600">
                              {item.category}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-800">
                              {getStoreName(item.storeId)}
                            </td>
                            <td className="py-3.5 px-4 text-right text-slate-500">
                              {formatNaira(item.costPrice)}
                            </td>
                            <td className="py-3.5 px-4 text-right font-black text-slate-900">
                              {formatNaira(item.sellingPrice)}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`inline-block px-3 py-1 rounded-full font-black text-[11px] ${
                                  isLow
                                    ? "bg-red-600 text-white animate-pulse"
                                    : "bg-emerald-100 text-emerald-800"
                                }`}
                              >
                                {item.quantity} units {isLow && "(LOW!)"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* PAGE 5: STORES & STAFF ACCESS CONTROL                           */}
        {/* =============================================================== */}
        {activePage === "stores" && (
          <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  Stores & Sales Staff Management
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Create new branches, onboard cashiers, or freeze staff login
                  access
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowStoreModal(true)}
                  className="px-4 py-2.5 bg-[#111827] text-white rounded-xl text-xs font-black"
                >
                  + Create New Store
                </button>
                <button
                  onClick={() => setShowStaffModal(true)}
                  className="px-4 py-2.5 bg-[#047857] text-white rounded-xl text-xs font-black"
                >
                  + Add Salesperson
                </button>
              </div>
            </div>

            {/* Store Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stores.map((st) => (
                <div
                  key={st.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
                >
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                    Active Store Branch
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-2">
                    {st.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{st.location}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Phone: {st.phone}
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Branch Lead:</span>
                    <span className="font-bold text-slate-900">
                      {st.manager}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Staff Directory */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h2 className="font-black text-base text-slate-900">
                  Salesperson Login & Store Assignment Directory
                </h2>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {staffList.map((stf) => (
                  <div
                    key={stf.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-black text-sm text-slate-900">
                          {stf.name}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            stf.active
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {stf.active ? "Active Access" : "Account Frozen"}
                        </span>
                      </div>
                      <p className="text-slate-500 mt-0.5">
                        {stf.email} • Assigned to:{" "}
                        <strong className="text-slate-800">
                          {getStoreName(stf.storeId)}
                        </strong>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1.5 bg-slate-100 rounded-xl font-bold">
                        {stf.salesCount} Sales Recorded
                      </span>
                      <button
                        onClick={() =>
                          setStaffList((prev) =>
                            prev.map((x) =>
                              x.id === stf.id ? { ...x, active: !x.active } : x,
                            ),
                          )
                        }
                        className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 ${
                          stf.active
                            ? "bg-red-50 text-red-700 hover:bg-red-100"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {stf.active ? (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Freeze Staff</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Unfreeze</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* PAGE 6: FULL SALES AUDIT & PAYMENT RECONCILIATION               */}
        {/* =============================================================== */}
        {activePage === "sales" && (
          <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Sales Ledger & Payment Reconciliation
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Verify Cash, Bank Transfer, and POS payments attached to every
                staff member
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100 text-xs">
                {sales.map((sale) => (
                  <div
                    key={sale.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-sm text-slate-900">
                          {sale.receiptNo}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 rounded font-bold">
                          {getStoreName(sale.storeId)}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold">
                          Cashier: {sale.staffName}
                        </span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-bold">
                          {sale.paymentMethod} ({sale.paymentRef})
                        </span>
                      </div>
                      <p className="text-slate-600">
                        {sale.items
                          .map((i) => `${i.qty}x ${i.name}`)
                          .join(", ")}
                      </p>
                      <p className="text-slate-400">
                        Customer: {sale.customerName} • {sale.timestamp}
                      </p>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                      <span className="text-base font-black text-slate-900">
                        {formatNaira(sale.totalAmount)}
                      </span>
                      <button
                        onClick={() => setReceiptModalData(sale)}
                        className="px-3 py-1.5 bg-[#047857] text-white rounded-xl font-bold"
                      >
                        📲 Receipt & WhatsApp
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================================================================= */}
      {/* MOBILE BOTTOM NAVIGATION BAR (Fixed on Phones)                    */}
      {/* ================================================================= */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#111827] text-white border-t border-slate-800 grid grid-cols-5 py-2 z-40">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center justify-center py-1 text-[10px] font-bold ${
                active ? "text-emerald-400" : "text-slate-400"
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </nav>

      {/* ================================================================= */}
      {/* PAGE 7 / MODAL: WHATSAPP & 80MM THERMAL RECEIPT PREVIEW           */}
      {/* ================================================================= */}
      {receiptModalData && (
        <div className="fixed inset-0 bg-slate-900/75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#047857] font-black text-base">
                <CheckCircle2 className="w-6 h-6" />
                <span>WhatsApp Receipt Dispatched!</span>
              </div>
              <button
                onClick={() => setReceiptModalData(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated WhatsApp Message Bubble */}
            <div className="bg-[#DCF8C6] border border-emerald-300 rounded-2xl p-4 font-mono text-xs text-slate-900 space-y-1.5 shadow-inner">
              <p className="font-black text-emerald-900">
                🧾 *NEW SALE RECEIPT -{" "}
                {getStoreName(receiptModalData.storeId).toUpperCase()}*
              </p>
              <p>Receipt No: *{receiptModalData.receiptNo}*</p>
              <p>Salesperson: *{receiptModalData.staffName}*</p>
              <p>Customer: {receiptModalData.customerName}</p>
              <p>
                Payment: *{receiptModalData.paymentMethod}* (
                {receiptModalData.paymentRef})
              </p>
              <div className="border-t border-emerald-400/60 my-2 pt-2 space-y-1">
                {receiptModalData.items.map((it, idx) => (
                  <div key={idx}>
                    <p className="font-bold">
                      {idx + 1}. {it.name} (x{it.qty}) -{" "}
                      {formatNaira(it.price * it.qty)}
                    </p>
                    {it.imei && (
                      <p className="text-[10px] text-slate-600">
                        IMEI/SN: {it.imei}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <p className="font-black text-sm pt-1 border-t border-emerald-400/60">
                💰 TOTAL PAID: {formatNaira(receiptModalData.totalAmount)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-black">
              <button
                onClick={() => window.print()}
                className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print 80mm</span>
              </button>
              <a
                href={`https://wa.me/${adminWaNumber}?text=${encodeURIComponent(
                  `NEW SALE ${receiptModalData.receiptNo} - Total:${formatNaira(
                    receiptModalData.totalAmount,
                  )} via ${receiptModalData.paymentMethod} by${receiptModalData.staffName}`,
                )}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 bg-[#047857] hover:bg-emerald-800 text-white rounded-xl flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send to WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: ADD / RESTOCK PRODUCT                                      */}
      {/* ================================================================= */}
      {showProductModal && (
        <div className="fixed inset-0 bg-slate-900/70 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setInventory((prev) => [
                {
                  id: `inv-${Date.now()}`,
                  ...newProduct,
                  costPrice: Number(newProduct.costPrice),
                  sellingPrice: Number(newProduct.sellingPrice),
                  quantity: Number(newProduct.quantity),
                  threshold: Number(newProduct.threshold),
                },
                ...prev,
              ]);
              setShowProductModal(false);
            }}
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-xs"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">
                Add / Restock Store Product
              </h3>
              <button type="button" onClick={() => setShowProductModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                placeholder="SKU (e.g. SCR-IP14PM)"
                value={newProduct.sku}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, sku: e.target.value })
                }
                className="px-3 py-2.5 border border-slate-200 rounded-xl"
              />
              <select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                className="px-3 py-2.5 border border-slate-200 rounded-xl"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <input
              required
              placeholder="Product Name (e.g. iPhone 14 Pro Max Original Screen)"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                type="number"
                placeholder="Cost Price (₦)"
                value={newProduct.costPrice}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, costPrice: e.target.value })
                }
                className="px-3 py-2.5 border border-slate-200 rounded-xl"
              />
              <input
                required
                type="number"
                placeholder="Selling Price (₦)"
                value={newProduct.sellingPrice}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, sellingPrice: e.target.value })
                }
                className="px-3 py-2.5 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <select
                value={newProduct.storeId}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, storeId: e.target.value })
                }
                className="px-3 py-2.5 border border-slate-200 rounded-xl"
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <input
                required
                type="number"
                placeholder="Quantity"
                value={newProduct.quantity}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, quantity: e.target.value })
                }
                className="px-3 py-2.5 border border-slate-200 rounded-xl"
              />
              <input
                required
                type="number"
                placeholder="Low Stock Alert"
                value={newProduct.threshold}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, threshold: e.target.value })
                }
                className="px-3 py-2.5 border border-slate-200 rounded-xl"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#047857] text-white font-black rounded-xl"
            >
              Save Product to Store Inventory
            </button>
          </form>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: CREATE NEW STORE                                           */}
      {/* ================================================================= */}
      {showStoreModal && (
        <div className="fixed inset-0 bg-slate-900/70 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStores((prev) => [
                ...prev,
                { id: `store-${Date.now()}`, ...newStore },
              ]);
              setShowStoreModal(false);
            }}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">
                Create New Store Branch
              </h3>
              <button type="button" onClick={() => setShowStoreModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <input
              required
              placeholder="Store Branch Name (e.g. Store 4: Dugbe Branch)"
              value={newStore.name}
              onChange={(e) =>
                setNewStore({ ...newStore, name: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl"
            />
            <input
              required
              placeholder="Physical Address"
              value={newStore.location}
              onChange={(e) =>
                setNewStore({ ...newStore, location: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl"
            />
            <input
              required
              placeholder="Store Phone Number"
              value={newStore.phone}
              onChange={(e) =>
                setNewStore({ ...newStore, phone: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl"
            />
            <input
              required
              placeholder="Branch Manager Name"
              value={newStore.manager}
              onChange={(e) =>
                setNewStore({ ...newStore, manager: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl"
            />
            <button
              type="submit"
              className="w-full py-3 bg-[#111827] text-white font-black rounded-xl"
            >
              Create Store Branch
            </button>
          </form>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: ONBOARD NEW SALES STAFF                                    */}
      {/* ================================================================= */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-slate-900/70 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStaffList((prev) => [
                ...prev,
                {
                  id: `stf-${Date.now()}`,
                  ...newStaff,
                  role: "staff",
                  active: true,
                  salesCount: 0,
                },
              ]);
              setShowStaffModal(false);
            }}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">
                Register Salesperson Login
              </h3>
              <button type="button" onClick={() => setShowStaffModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <input
              required
              placeholder="Staff Full Name"
              value={newStaff.name}
              onChange={(e) =>
                setNewStaff({ ...newStaff, name: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl"
            />
            <input
              required
              type="email"
              placeholder="Staff Login Email"
              value={newStaff.email}
              onChange={(e) =>
                setNewStaff({ ...newStaff, email: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl"
            />
            <select
              value={newStaff.storeId}
              onChange={(e) =>
                setNewStaff({ ...newStaff, storeId: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl"
            >
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  Assign to: {s.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="w-full py-3 bg-[#047857] text-white font-black rounded-xl"
            >
              Create Cashier Account
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
