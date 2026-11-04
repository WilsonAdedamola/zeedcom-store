import React, { createContext, useContext, useState, useMemo } from "react";
import {
  INITIAL_STORES,
  INITIAL_CATEGORIES,
  INITIAL_STAFF,
  INITIAL_INVENTORY,
  INITIAL_SALES,
} from "../utils/mockData";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  // Navigation & Role State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentRole, setCurrentRole] = useState("admin"); // 'admin' | 'staff'
  const [activePage, setActivePage] = useState("dashboard");
  const [adminWaNumber] = useState("2348031234567");

  // Core Data State
  const [stores, setStores] = useState(INITIAL_STORES);
  const [categories] = useState(INITIAL_CATEGORIES);
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [sales, setSales] = useState(INITIAL_SALES);

  // Global Filters & Active Staff Context
  const [selectedStoreFilter, setSelectedStoreFilter] = useState("ALL");
  const [posActiveStoreId, setPosActiveStoreId] = useState("store-1");
  const [activeStaffUser, setActiveStaffUser] = useState(INITIAL_STAFF[0]);

  // POS Cart State
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

  // Modals State
  const [receiptModalData, setReceiptModalData] = useState(null);
  const [repayModalSale, setRepayModalSale] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);

  const getStoreName = (storeId) =>
    stores.find((s) => s.id === storeId)?.name || "Unknown Store";

  const handleSwitchRole = (role) => {
    setCurrentRole(role);
    if (role === "staff") {
      setActivePage("pos");
      setPosActiveStoreId(activeStaffUser.storeId);
      setSelectedStoreFilter(activeStaffUser.storeId);
    } else {
      setActivePage("dashboard");
      setSelectedStoreFilter("ALL");
    }
  };

  const handleChangeActiveStaff = (staffId) => {
    const found = staffList.find((s) => s.id === staffId);
    if (found) {
      setActiveStaffUser(found);
      setPosActiveStoreId(found.storeId);
      if (currentRole === "staff") {
        setSelectedStoreFilter(found.storeId);
      }
    }
  };

  // Effective Store Filter (Staff are locked to their assigned branch)
  const effectiveStoreFilter =
    currentRole === "staff" ? activeStaffUser.storeId : selectedStoreFilter;

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
      currentRole === "admin" ? "Engr. Azeez (Admin)" : activeStaffUser.name;

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

    setSales((prev) => [newSaleRecord, ...prev]);
    setReceiptModalData(newSaleRecord);
    setCart([]);
    return true;
  };

  // Settle Credit Debt & Add to Weekly Sales
  const settleCreditDebt = (saleToSettle, repayMethod, repayRef) => {
    const actingPerson =
      currentRole === "admin" ? "Engr. Azeez (Admin)" : activeStaffUser.name;
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
        setIsLoggedIn,
        currentRole,
        setCurrentRole,
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
        handleSwitchRole,
        handleChangeActiveStaff,
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