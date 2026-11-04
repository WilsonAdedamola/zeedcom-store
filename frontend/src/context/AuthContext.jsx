import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import {
  ADMIN_ACCOUNT,
  INITIAL_STORES,
  INITIAL_CATEGORIES,
  INITIAL_STAFF,
  INITIAL_INVENTORY,
  INITIAL_SALES,
} from "../utils/mockData";

const AuthContext = createContext({});

const loadSaved = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

export const AuthProvider = ({ children }) => {
  // Core Persistent Data State
  const [stores, setStores] = useState(() => loadSaved("zeed_stores", INITIAL_STORES));
  const [categories] = useState(INITIAL_CATEGORIES);
  const [staffList, setStaffList] = useState(() => loadSaved("zeed_staff", INITIAL_STAFF));
  const [inventory, setInventory] = useState(() => loadSaved("zeed_inventory", INITIAL_INVENTORY));
  const [sales, setSales] = useState(() => loadSaved("zeed_sales", INITIAL_SALES));

  // Authenticated User Session State
  const [sessionUser, setSessionUser] = useState(() => loadSaved("zeed_session", null));
  const [activePage, setActivePage] = useState(() =>
    sessionUser?.role === "admin" ? "dashboard" : "pos"
  );
  const [adminWaNumber] = useState("2348031234567");

  // Global Filters & Active Store Context
  const [selectedStoreFilter, setSelectedStoreFilter] = useState("ALL");
  const [posActiveStoreId, setPosActiveStoreId] = useState(
    () => sessionUser?.storeId || "store-1"
  );

  // POS Cart State (Starts empty in production)
  const [cart, setCart] = useState([]);

  // Modals State
  const [receiptModalData, setReceiptModalData] = useState(null);
  const [repayModalSale, setRepayModalSale] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);

  // Sync changes to localStorage
  useEffect(() => {
    localStorage.setItem("zeed_stores", JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem("zeed_staff", JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem("zeed_inventory", JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem("zeed_sales", JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    if (sessionUser) {
      localStorage.setItem("zeed_session", JSON.stringify(sessionUser));
    } else {
      localStorage.removeItem("zeed_session");
    }
  }, [sessionUser]);

  const isLoggedIn = Boolean(sessionUser);
  const currentRole = sessionUser?.role || "staff";
  const activeStaffUser = sessionUser || {};

  const getStoreName = (storeId) =>
    stores.find((s) => s.id === storeId)?.name || "Unknown Store";

  // Production Login Function
  const login = (email, password, loginTabRole) => {
    const cleanEmail = email.trim().toLowerCase();

    if (loginTabRole === "admin") {
      if (
        cleanEmail === ADMIN_ACCOUNT.email.toLowerCase() &&
        password === ADMIN_ACCOUNT.password
      ) {
        setSessionUser(ADMIN_ACCOUNT);
        setSelectedStoreFilter("ALL");
        setPosActiveStoreId(stores[0]?.id || "store-1");
        setActivePage("dashboard");
        return { success: true };
      }
      return {
        success: false,
        error: "Invalid Administrator email or password.",
      };
    }

    // Staff Login Verification
    const matchedStaff = staffList.find(
      (s) => s.email.toLowerCase() === cleanEmail
    );

    if (!matchedStaff || (matchedStaff.password && matchedStaff.password !== password)) {
      return {
        success: false,
        error: "Invalid Sales Staff email or password.",
      };
    }

    if (!matchedStaff.active) {
      return {
        success: false,
        error:
          "Access Denied: Your staff account has been frozen by the Administrator.",
      };
    }

    setSessionUser(matchedStaff);
    setPosActiveStoreId(matchedStaff.storeId);
    setSelectedStoreFilter(matchedStaff.storeId);
    setActivePage("pos");
    return { success: true };
  };

  // Production Logout Function
  const logout = () => {
    setSessionUser(null);
    setCart([]);
    setActivePage("pos");
  };

  // Effective Store Filter (Staff are strictly locked to their assigned branch)
  const effectiveStoreFilter =
    currentRole === "staff" ? sessionUser?.storeId : selectedStoreFilter;

  const lowStockItems = useMemo(() => {
    return inventory.filter((item) => {
      const storeMatch =
        effectiveStoreFilter === "ALL" || item.storeId === effectiveStoreFilter;
      return storeMatch && item.quantity <= item.threshold;
    });
  }, [inventory, effectiveStoreFilter]);

  const filteredSales = useMemo(() => {
    return sales.filter(
      (s) =>
        effectiveStoreFilter === "ALL" || s.storeId === effectiveStoreFilter
    );
  }, [sales, effectiveStoreFilter]);

  const unpaidCreditSales = useMemo(() => {
    return filteredSales.filter((s) => s.creditStatus === "UNPAID");
  }, [filteredSales]);

  const posStoreUnpaidCredits = useMemo(() => {
    return sales.filter(
      (s) => s.storeId === posActiveStoreId && s.creditStatus === "UNPAID"
    );
  }, [sales, posActiveStoreId]);

  const kpis = useMemo(() => {
    const paidSales = filteredSales.filter((s) => s.creditStatus === "PAID");

    const weeklyCollectedRev = paidSales.reduce(
      (acc, s) => acc + s.totalAmount,
      0
    );
    const cash = paidSales
      .filter((s) => s.paymentMethod === "Cash")
      .reduce((acc, s) => acc + s.totalAmount, 0);
    const transfer = paidSales
      .filter((s) => s.paymentMethod === "Transfer")
      .reduce((acc, s) => acc + s.totalAmount, 0);
    const pos = paidSales
      .filter((s) => s.paymentMethod === "POS")
      .reduce((acc, s) => acc + s.totalAmount, 0);

    const repaidCreditTotal = paidSales
      .filter((s) => s.isCredit)
      .reduce((acc, s) => acc + s.totalAmount, 0);

    const unpaidCreditAmount = unpaidCreditSales.reduce(
      (acc, s) => acc + s.totalAmount,
      0
    );
    const unpaidCreditProductCount = unpaidCreditSales.reduce(
      (acc, s) =>
        acc + s.items.reduce((itemSum, it) => itemSum + it.qty, 0),
      0
    );

    const storeInv = inventory.filter(
      (i) =>
        effectiveStoreFilter === "ALL" || i.storeId === effectiveStoreFilter
    );
    const totalUnits = storeInv.reduce((acc, i) => acc + i.quantity, 0);
    const stockValue = storeInv.reduce(
      (acc, i) => acc + i.quantity * i.sellingPrice,
      0
    );

    return {
      weeklyCollectedRev,
      paidCount: paidSales.length,
      cash,
      transfer,
      pos,
      repaidCreditTotal,
      unpaidCreditAmount,
      unpaidCreditProductCount,
      totalUnits,
      stockValue,
    };
  }, [filteredSales, unpaidCreditSales, inventory, effectiveStoreFilter]);

  // Cart Operations
  const addToCart = (invItem) => {
    if (invItem.quantity <= 0) return;
    setCart((prev) => {
      const exists = prev.find((c) => c.id === invItem.id);
      if (exists) {
        if (exists.qty + 1 > invItem.quantity) return prev;
        return prev.map((c) =>
          c.id === invItem.id ? { ...c, qty: c.qty + 1 } : c
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
        .filter(Boolean)
    );
  };

  const updateCartImei = (id, imeiValue) => {
    setCart((prev) =>
      prev.map((c) => (c.id === id ? { ...c, imei: imeiValue } : c))
    );
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  // Record Standard or Credit Sale
  const recordSaleTransaction = ({
    customerName,
    customerPhone,
    paymentMethod,
    paymentRef,
  }) => {
    if (cart.length === 0) return false;
    const isCreditSale = paymentMethod === "Credit";

    const prefix = isCreditSale ? "CRD" : "RCP";
    const receiptNo = `${prefix}-20261104-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    const storeObj = stores.find((s) => s.id === posActiveStoreId);
    const actingPerson =
      currentRole === "admin"
        ? `${sessionUser?.name} (Admin)`
        : sessionUser?.name || "Sales Staff";

    const newSaleRecord = {
      id: `sale-${Date.now()}`,
      receiptNo,
      storeId: posActiveStoreId,
      storeName: storeObj?.name || "Main Store",
      staffName: actingPerson,
      customerName: customerName.trim() || "Walk-in Customer",
      customerPhone: customerPhone.trim() || "N/A",
      paymentMethod,
      paymentRef:
        paymentMethod === "Cash"
          ? "Cash Drawer"
          : paymentRef.trim() ||
            (isCreditSale ? "Unpaid Credit" : "Verified"),
      totalAmount: cartTotal,
      timestamp: new Date().toLocaleString("en-NG", {
        dateStyle: "short",
        timeStyle: "short",
      }),
      isCredit: isCreditSale,
      creditStatus: isCreditSale ? "UNPAID" : "PAID",
      creditNote: isCreditSale ? paymentRef.trim() : "",
      repaidAt: null,
      repaidBy: null,
      items: cart.map((c) => ({
        name: c.name,
        qty: c.qty,
        price: c.price,
        imei: c.imei,
      })),
    };

    setInventory((prev) =>
      prev.map((inv) => {
        const sold = cart.find((c) => c.id === inv.id);
        return sold
          ? { ...inv, quantity: Math.max(0, inv.quantity - sold.qty) }
          : inv;
      })
    );

    if (currentRole === "staff" && sessionUser?.id) {
      setStaffList((prev) =>
        prev.map((st) =>
          st.id === sessionUser.id
            ? { ...st, salesCount: (st.salesCount || 0) + 1 }
            : st
        )
      );
    }

    setSales((prev) => [newSaleRecord, ...prev]);
    setReceiptModalData(newSaleRecord);
    setCart([]);
    return true;
  };

  // Settle Credit Debt & Add to Weekly Sales
  const settleCreditDebt = (saleToSettle, repayMethod, repayRef) => {
    const actingPerson =
      currentRole === "admin"
        ? `${sessionUser?.name} (Admin)`
        : sessionUser?.name || "Sales Staff";
    const nowStr = new Date().toLocaleString("en-NG", {
      dateStyle: "short",
      timeStyle: "short",
    });

    const updatedSale = {
      ...saleToSettle,
      paymentMethod: repayMethod,
      paymentRef:
        repayMethod === "Cash"
          ? "Cash (Debt Repaid)"
          : `${repayRef || "Verified"} (Debt Repaid)`,
      creditStatus: "PAID",
      repaidAt: nowStr,
      repaidBy: actingPerson,
    };

    setSales((prev) =>
      prev.map((s) => (s.id === saleToSettle.id ? updatedSale : s))
    );
    setRepayModalSale(null);
    setReceiptModalData(updatedSale);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        sessionUser,
        login,
        logout,
        currentRole,
        activePage,
        setActivePage,
        adminWaNumber,
        stores,
        setStores,
        categories,
        staffList,
        setStaffList,
        inventory,
        setInventory,
        sales,
        selectedStoreFilter,
        setSelectedStoreFilter,
        effectiveStoreFilter,
        posActiveStoreId,
        setPosActiveStoreId,
        activeStaffUser,
        getStoreName,
        lowStockItems,
        filteredSales,
        unpaidCreditSales,
        posStoreUnpaidCredits,
        kpis,
        cart,
        setCart,
        addToCart,
        updateCartQty,
        updateCartImei,
        cartTotal,
        recordSaleTransaction,
        settleCreditDebt,
        receiptModalData,
        setReceiptModalData,
        repayModalSale,
        setRepayModalSale,
        showProductModal,
        setShowProductModal,
        showStoreModal,
        setShowStoreModal,
        showStaffModal,
        setShowStaffModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);