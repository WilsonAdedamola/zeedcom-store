import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

const AuthContext = createContext({});

const INACTIVITY_LIMIT_MS = 60 * 60 * 1000; // 1 Hour (3,600,000 ms)

const isDateInCurrentWeek = (isoDateString) => {
  if (!isoDateString) return true;
  const date = new Date(isoDateString);
  if (isNaN(date.getTime())) return true;

  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  return date >= startOfWeek;
};

const mapStoreRow = (r) => ({
  id: r.id,
  name: r.name,
  location: r.location,
  phone: r.phone,
  manager: r.manager,
  weeklyTarget: Number(r.weekly_target || 0),
});

const mapStaffRow = (r) => ({
  id: r.id,
  name: r.name,
  email: r.email,
  role: r.role,
  storeId: r.store_id,
  active: r.active,
  salesCount: Number(r.sales_count || 0),
});

const mapInventoryRow = (r) => ({
  id: r.id,
  sku: r.sku,
  name: r.name,
  category: r.category,
  storeId: r.store_id,
  costPrice: Number(r.cost_price || 0),
  sellingPrice: Number(r.selling_price || 0),
  quantity: Number(r.quantity || 0),
  threshold: Number(r.threshold || 5),
  trackImei: Boolean(r.track_imei),
});

const mapSaleRow = (r) => ({
  id: r.id,
  receiptNo: r.receipt_no,
  storeId: r.store_id,
  staffId: r.staff_id,
  staffName: r.staff_name,
  customerName: r.customer_name,
  customerPhone: r.customer_phone,
  paymentMethod: r.payment_method,
  paymentRef: r.payment_ref,
  totalAmount: Number(r.total_amount || 0),
  timestamp: r.timestamp_label,
  isCredit: Boolean(r.is_credit),
  creditStatus: r.credit_status,
  creditNote: r.credit_note || "",
  repaidAt: r.repaid_at,
  repaidBy: r.repaid_by,
  paidAt: r.paid_at || r.created_at,
  createdAt: r.created_at,
  items: Array.isArray(r.items) ? r.items : [],
});

export const AuthProvider = ({ children }) => {
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [sales, setSales] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);

  const [sessionUser, setSessionUser] = useState(() => {
    try {
      const saved = localStorage.getItem("zeed_session");
      const lastAct = Number(localStorage.getItem("zeed_last_activity") || 0);
      if (saved && lastAct && Date.now() - lastAct > INACTIVITY_LIMIT_MS) {
        localStorage.removeItem("zeed_session");
        localStorage.removeItem("zeed_last_activity");
        return null;
      }
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activePage, setActivePage] = useState(() =>
    sessionUser?.role === "admin" ? "dashboard" : "pos"
  );
  const [adminWaNumber] = useState(
    import.meta.env.VITE_ADMIN_WHATSAPP_NUMBER || "2348031234567"
  );

  const [selectedStoreFilter, setSelectedStoreFilter] = useState("ALL");
  const [posActiveStoreId, setPosActiveStoreId] = useState(
    () => sessionUser?.storeId || ""
  );
  const [cart, setCart] = useState([]);

  // Modals State
  const [receiptModalData, setReceiptModalData] = useState(null);
  const [repayModalSale, setRepayModalSale] = useState(null);
  const [refundModalSale, setRefundModalSale] = useState(null);
  const [confirmModalData, setConfirmModalData] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);

  const logout = useCallback(() => {
    setSessionUser(null);
    setCart([]);
    setConfirmModalData(null);
    setRefundModalSale(null);
    localStorage.removeItem("zeed_session");
    localStorage.removeItem("zeed_last_activity");
    setActivePage("pos");
  }, []);

  // 1-Hour Inactivity Auto-Logout Watcher
  useEffect(() => {
    if (!sessionUser) return;

    const updateActivity = () => {
      localStorage.setItem("zeed_last_activity", String(Date.now()));
    };

    updateActivity();

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "click",
    ];
    events.forEach((ev) =>
      window.addEventListener(ev, updateActivity, { passive: true })
    );

    const interval = setInterval(() => {
      const lastAct = Number(
        localStorage.getItem("zeed_last_activity") || Date.now()
      );
      if (Date.now() - lastAct >= INACTIVITY_LIMIT_MS) {
        logout();
        alert(
          "Session Expired: You have been logged out due to 1 hour of inactivity."
        );
      }
    }, 30000); // Checks every 30 seconds

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, updateActivity));
      clearInterval(interval);
    };
  }, [sessionUser, logout]);

  // Helper to open global confirmation modal
  const requestConfirm = useCallback((config) => {
    setConfirmModalData(config);
  }, []);

  const fetchAllSupabaseData = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setDbLoading(false);
      return;
    }

    try {
      const [
        { data: storesData },
        { data: catData },
        { data: staffData },
        { data: invData },
        { data: salesData },
      ] = await Promise.all([
        supabase
          .from("stores")
          .select("*")
          .order("created_at", { ascending: true }),
        supabase
          .from("categories")
          .select("*")
          .order("id", { ascending: true }),
        supabase
          .from("staff_users")
          .select("*")
          .order("created_at", { ascending: true }),
        supabase
          .from("inventory")
          .select("*")
          .order("updated_at", { ascending: false }),
        supabase
          .from("sales")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      const mappedStores = (storesData || []).map(mapStoreRow);
      setStores(mappedStores);

      if (mappedStores.length > 0 && !posActiveStoreId) {
        setPosActiveStoreId(
          sessionUser?.role === "staff"
            ? sessionUser.storeId
            : mappedStores[0].id
        );
      }

      setCategories((catData || []).map((c) => c.name));

      const mappedStaff = (staffData || [])
        .filter((u) => u.role === "staff")
        .map(mapStaffRow);
      setStaffList(mappedStaff);

      if (sessionUser?.role === "staff") {
        const currentInDb = mappedStaff.find((u) => u.id === sessionUser.id);
        if (!currentInDb || !currentInDb.active) {
          logout();
          alert("Your session has been deactivated by the Administrator.");
        }
      }

      setInventory((invData || []).map(mapInventoryRow));
      setSales((salesData || []).map(mapSaleRow));
    } catch (err) {
      console.error("Error syncing with Supabase:", err);
    } finally {
      setDbLoading(false);
    }
  }, [posActiveStoreId, sessionUser, logout]);

  useEffect(() => {
    fetchAllSupabaseData();

    if (!isSupabaseConfigured || !supabase) return;

    const channel = supabase
      .channel("zeedcom-live-db")
      .on("postgres_changes", { event: "*", schema: "public" }, () => {
        fetchAllSupabaseData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAllSupabaseData]);

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
    stores.find((s) => s.id === storeId)?.name || "Unassigned Store";

  const login = async (email, password, loginTabRole) => {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error: "Database connection missing. Check VITE_SUPABASE_URL in .env",
      };
    }

    const cleanEmail = email.trim().toLowerCase();

    const { data: userRow, error } = await supabase
      .from("staff_users")
      .select("*")
      .ilike("email", cleanEmail)
      .eq("role", loginTabRole)
      .maybeSingle();

    if (error || !userRow || userRow.password !== password) {
      return {
        success: false,
        error: `Invalid ${
          loginTabRole === "admin" ? "Administrator" : "Sales Staff"
        } email or password.`,
      };
    }

    if (!userRow.active) {
      return {
        success: false,
        error:
          "Access Denied: Your account has been frozen by the Administrator.",
      };
    }

    const mappedUser = mapStaffRow(userRow);
    localStorage.setItem("zeed_last_activity", String(Date.now()));
    setSessionUser(mappedUser);

    if (mappedUser.role === "admin") {
      setSelectedStoreFilter("ALL");
      setPosActiveStoreId(stores[0]?.id || "");
      setActivePage("dashboard");
    } else {
      setPosActiveStoreId(mappedUser.storeId);
      setSelectedStoreFilter(mappedUser.storeId);
      setActivePage("pos");
    }

    return { success: true };
  };

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
    return filteredSales.filter(
      (s) => s.creditStatus === "UNPAID" && s.totalAmount > 0
    );
  }, [filteredSales]);

  const posStoreUnpaidCredits = useMemo(() => {
    return sales.filter(
      (s) =>
        s.storeId === posActiveStoreId &&
        s.creditStatus === "UNPAID" &&
        s.totalAmount > 0
    );
  }, [sales, posActiveStoreId]);

  const storeTargetMetrics = useMemo(() => {
    const map = {};
    stores.forEach((st) => {
      const weeklyPaidForStore = sales
        .filter(
          (s) =>
            s.storeId === st.id &&
            s.creditStatus === "PAID" &&
            isDateInCurrentWeek(s.paidAt)
        )
        .reduce((sum, s) => sum + s.totalAmount, 0);

      const target = st.weeklyTarget || 0;
      const percentage =
        target > 0
          ? Math.min(100, Math.round((weeklyPaidForStore / target) * 100))
          : 0;

      map[st.id] = {
        collected: weeklyPaidForStore,
        target,
        percentage,
        remaining: Math.max(0, target - weeklyPaidForStore),
      };
    });
    return map;
  }, [stores, sales]);

  const kpis = useMemo(() => {
    const weeklyPaidSales = filteredSales.filter(
      (s) => s.creditStatus === "PAID" && isDateInCurrentWeek(s.paidAt)
    );

    const weeklyCollectedRev = weeklyPaidSales.reduce(
      (acc, s) => acc + s.totalAmount,
      0
    );
    const cash = weeklyPaidSales
      .filter((s) => s.paymentMethod === "Cash")
      .reduce((acc, s) => acc + s.totalAmount, 0);
    const transfer = weeklyPaidSales
      .filter((s) => s.paymentMethod === "Transfer")
      .reduce((acc, s) => acc + s.totalAmount, 0);
    const pos = weeklyPaidSales
      .filter((s) => s.paymentMethod === "POS")
      .reduce((acc, s) => acc + s.totalAmount, 0);

    const repaidCreditTotal = weeklyPaidSales
      .filter((s) => s.isCredit)
      .reduce((acc, s) => acc + s.totalAmount, 0);

    const unpaidCreditAmount = unpaidCreditSales.reduce(
      (acc, s) => acc + s.totalAmount,
      0
    );
    const unpaidCreditProductCount = unpaidCreditSales.reduce(
      (acc, s) =>
        acc +
        s.items.reduce(
          (itemSum, it) =>
            itemSum + Math.max(0, it.qty - (it.refundedQty || 0)),
          0
        ),
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

    let targetTotal = 0;
    if (effectiveStoreFilter === "ALL") {
      stores.forEach((st) => {
        targetTotal += st.weeklyTarget || 0;
      });
    } else {
      const targetStore = stores.find((s) => s.id === effectiveStoreFilter);
      targetTotal = targetStore?.weeklyTarget || 0;
    }

    const targetPercentage =
      targetTotal > 0
        ? Math.min(100, Math.round((weeklyCollectedRev / targetTotal) * 100))
        : 0;

    return {
      weeklyCollectedRev,
      paidCount: weeklyPaidSales.filter((s) => s.totalAmount > 0).length,
      cash,
      transfer,
      pos,
      repaidCreditTotal,
      unpaidCreditAmount,
      unpaidCreditProductCount,
      totalUnits,
      stockValue,
      targetTotal,
      targetPercentage,
    };
  }, [
    filteredSales,
    unpaidCreditSales,
    inventory,
    effectiveStoreFilter,
    stores,
  ]);

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

  // 1. Record Sale or Credit Transaction
  const recordSaleTransaction = async ({
    customerName,
    customerPhone,
    paymentMethod,
    paymentRef,
  }) => {
    if (cart.length === 0 || !posActiveStoreId) return false;
    const isCreditSale = paymentMethod === "Credit";

    const saleId = `sale-${Date.now()}`;
    const prefix = isCreditSale ? "CRD" : "RCP";
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const receiptNo = `${prefix}-${datePart}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    const storeObj = stores.find((s) => s.id === posActiveStoreId);
    const actingPerson =
      currentRole === "admin"
        ? `${sessionUser?.name} (Admin)`
        : sessionUser?.name || "Sales Staff";

    const timestampStr = new Date().toLocaleString("en-NG", {
      dateStyle: "short",
      timeStyle: "short",
    });

    const itemsPayload = cart.map((c) => ({
      id: c.id,
      name: c.name,
      qty: c.qty,
      refundedQty: 0,
      price: c.price,
      imei: c.imei,
    }));

    const newSaleRecord = {
      id: saleId,
      receiptNo,
      storeId: posActiveStoreId,
      storeName: storeObj?.name || "Store",
      staffId: sessionUser?.id || null,
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
      timestamp: timestampStr,
      isCredit: isCreditSale,
      creditStatus: isCreditSale ? "UNPAID" : "PAID",
      creditNote: isCreditSale ? paymentRef.trim() : "",
      repaidAt: null,
      repaidBy: null,
      items: itemsPayload,
    };

    const { error } = await supabase.rpc("record_zeedcom_sale", {
      p_sale_id: newSaleRecord.id,
      p_receipt_no: newSaleRecord.receiptNo,
      p_store_id: newSaleRecord.storeId,
      p_staff_id: newSaleRecord.staffId,
      p_staff_name: newSaleRecord.staffName,
      p_customer_name: newSaleRecord.customerName,
      p_customer_phone: newSaleRecord.customerPhone,
      p_payment_method: newSaleRecord.paymentMethod,
      p_payment_ref: newSaleRecord.paymentRef,
      p_total_amount: newSaleRecord.totalAmount,
      p_timestamp_label: newSaleRecord.timestamp,
      p_is_credit: newSaleRecord.isCredit,
      p_credit_status: newSaleRecord.creditStatus,
      p_credit_note: newSaleRecord.creditNote,
      p_items: newSaleRecord.items,
    });

    if (error) {
      alert(error.message || "Failed to record sale.");
      return false;
    }

    await fetchAllSupabaseData();
    setReceiptModalData(newSaleRecord);
    setCart([]);
    return true;
  };

  // 2. Process Refund (Deducts from Total Sales & Optionally Restocks Inventory)
  const processSaleRefund = async ({
    sale,
    itemIndex,
    refundQty,
    restock,
    reason,
  }) => {
    const targetItem = sale.items[itemIndex];
    if (!targetItem) return false;

    const refundAmount = Number(targetItem.price) * Number(refundQty);
    const newTotalAmount = Math.max(0, Number(sale.totalAmount) - refundAmount);

    const updatedItems = sale.items.map((it, idx) => {
      if (idx !== itemIndex) return it;
      return {
        ...it,
        refundedQty: (it.refundedQty || 0) + Number(refundQty),
        refundReason: reason,
        restocked: restock,
      };
    });

    const refundTag = `[REFUNDED ${refundQty}x ${targetItem.name} (${
      restock ? "Restocked" : "Bad/No-Restock"
    })]`;
    const updatedRef = sale.paymentRef.includes(refundTag)
      ? sale.paymentRef
      : `${sale.paymentRef} • ${refundTag}`;

    // A. If Admin chose "Return to Previous Quantity", increment stock in Supabase
    if (restock && targetItem.id) {
      const currentInv = inventory.find((i) => i.id === targetItem.id);
      if (currentInv) {
        const { error: invErr } = await supabase
          .from("inventory")
          .update({
            quantity: currentInv.quantity + Number(refundQty),
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentInv.id);

        if (invErr) {
          alert(
            "Failed to return stock quantity: " + (invErr.message || "Error")
          );
          return false;
        }
      }
    }

    // B. Deduct refunded amount from sale total_amount in Supabase
    const { error: saleErr } = await supabase
      .from("sales")
      .update({
        total_amount: newTotalAmount,
        payment_ref: updatedRef,
        items: updatedItems,
      })
      .eq("id", sale.id);

    if (saleErr) {
      alert("Failed to update sale refund: " + (saleErr.message || "Error"));
      return false;
    }

    setRefundModalSale(null);
    await fetchAllSupabaseData();
    return true;
  };

  // 3. Settle Credit Debt
  const settleCreditDebt = async (saleToSettle, repayMethod, repayRef) => {
    const actingPerson =
      currentRole === "admin"
        ? `${sessionUser?.name} (Admin)`
        : sessionUser?.name || "Sales Staff";
    const nowStr = new Date().toLocaleString("en-NG", {
      dateStyle: "short",
      timeStyle: "short",
    });

    const newPaymentRef =
      repayMethod === "Cash"
        ? "Cash (Debt Repaid)"
        : `${repayRef || "Verified"} (Debt Repaid)`;

    const { error } = await supabase.rpc("settle_zeedcom_credit", {
      p_sale_id: saleToSettle.id,
      p_payment_method: repayMethod,
      p_payment_ref: newPaymentRef,
      p_repaid_at_label: nowStr,
      p_repaid_by: actingPerson,
    });

    if (error) {
      alert(error.message || "Failed to settle credit debt.");
      return;
    }

    await fetchAllSupabaseData();
    setRepayModalSale(null);
    setReceiptModalData({
      ...saleToSettle,
      paymentMethod: repayMethod,
      paymentRef: newPaymentRef,
      creditStatus: "PAID",
      repaidAt: nowStr,
      repaidBy: actingPerson,
    });
  };

  // 4. Add or Restock Product
  const addOrRestockProduct = async (productForm) => {
    const cleanSku = productForm.sku.trim().toUpperCase();
    const existingItem = inventory.find(
      (i) =>
        i.sku.toUpperCase() === cleanSku && i.storeId === productForm.storeId
    );

    if (existingItem) {
      const { error } = await supabase
        .from("inventory")
        .update({
          name: productForm.name.trim(),
          category: productForm.category,
          cost_price: Number(productForm.costPrice),
          selling_price: Number(productForm.sellingPrice),
          quantity: existingItem.quantity + Number(productForm.quantity),
          threshold: Number(productForm.threshold),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItem.id);

      if (error) {
        alert(error.message);
        return false;
      }
    } else {
      const { error } = await supabase.from("inventory").insert({
        id: `inv-${Date.now()}`,
        sku: cleanSku,
        name: productForm.name.trim(),
        category: productForm.category,
        store_id: productForm.storeId,
        cost_price: Number(productForm.costPrice),
        selling_price: Number(productForm.sellingPrice),
        quantity: Number(productForm.quantity),
        threshold: Number(productForm.threshold),
        track_imei: false,
      });

      if (error) {
        alert(error.message);
        return false;
      }
    }

    await fetchAllSupabaseData();
    return true;
  };

  // 5. Delete Product from Inventory
  const deleteProduct = async (productId) => {
    const { error } = await supabase
      .from("inventory")
      .delete()
      .eq("id", productId);
    if (error) {
      alert(error.message);
      return false;
    }
    setCart((prev) => prev.filter((c) => c.id !== productId));
    await fetchAllSupabaseData();
    return true;
  };

  // 6. Create Store Branch (Weekly Target is Optional — defaults to 0)
  const createStoreBranch = async (storeForm) => {
    const newId = `store-${Date.now()}`;
    const parsedTarget = storeForm.weeklyTarget
      ? Number(storeForm.weeklyTarget)
      : 0;

    const { error } = await supabase.from("stores").insert({
      id: newId,
      name: storeForm.name.trim(),
      location: storeForm.location.trim(),
      phone: storeForm.phone.trim(),
      manager: storeForm.manager.trim(),
      weekly_target: parsedTarget,
    });

    if (error) {
      alert(error.message);
      return false;
    }

    if (!posActiveStoreId) {
      setPosActiveStoreId(newId);
    }
    await fetchAllSupabaseData();
    return true;
  };

  // 7. Delete Store Branch
  const deleteStoreBranch = async (storeId) => {
    const { error } = await supabase.from("stores").delete().eq("id", storeId);
    if (error) {
      alert(error.message);
      return false;
    }
    if (selectedStoreFilter === storeId) setSelectedStoreFilter("ALL");
    if (posActiveStoreId === storeId) {
      const remaining = stores.filter((s) => s.id !== storeId);
      setPosActiveStoreId(remaining[0]?.id || "");
    }
    await fetchAllSupabaseData();
    return true;
  };

  // 8. Update Store Weekly Target
  const updateStoreTarget = async (storeId, newTarget) => {
    const { error } = await supabase
      .from("stores")
      .update({ weekly_target: Number(newTarget || 0) })
      .eq("id", storeId);

    if (error) {
      alert(error.message);
      return false;
    }
    await fetchAllSupabaseData();
    return true;
  };

  // 9. Register & Delete Sales Staff
  const registerStaffMember = async (staffForm) => {
    const { error } = await supabase.from("staff_users").insert({
      id: `stf-${Date.now()}`,
      name: staffForm.name.trim(),
      email: staffForm.email.trim().toLowerCase(),
      password: staffForm.password,
      role: "staff",
      store_id: staffForm.storeId,
      active: true,
      sales_count: 0,
    });

    if (error) {
      alert(error.message);
      return false;
    }
    await fetchAllSupabaseData();
    return true;
  };

  const deleteStaffMember = async (staffId) => {
    const { error } = await supabase
      .from("staff_users")
      .delete()
      .eq("id", staffId);
    if (error) {
      alert(error.message);
      return false;
    }
    await fetchAllSupabaseData();
    return true;
  };

  const toggleStaffStatus = async (staffId, currentActive) => {
    const { error } = await supabase
      .from("staff_users")
      .update({ active: !currentActive })
      .eq("id", staffId);

    if (error) {
      alert(error.message);
      return;
    }
    await fetchAllSupabaseData();
  };

  // 10. Create & Delete Stock Categories
  const createCategory = async (catName) => {
    const clean = catName.trim();
    if (!clean) return false;
    const { error } = await supabase.from("categories").insert({ name: clean });
    if (error) {
      alert(error.message);
      return false;
    }
    await fetchAllSupabaseData();
    return true;
  };

  const deleteCategory = async (catName) => {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("name", catName);
    if (error) {
      alert(error.message);
      return false;
    }
    await fetchAllSupabaseData();
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        dbLoading,
        sessionUser,
        login,
        logout,
        currentRole,
        activePage,
        setActivePage,
        adminWaNumber,
        stores,
        categories,
        staffList,
        inventory,
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
        storeTargetMetrics,
        kpis,
        cart,
        setCart,
        addToCart,
        updateCartQty,
        updateCartImei,
        cartTotal,
        recordSaleTransaction,
        processSaleRefund,
        settleCreditDebt,
        addOrRestockProduct,
        deleteProduct,
        createStoreBranch,
        deleteStoreBranch,
        updateStoreTarget,
        registerStaffMember,
        deleteStaffMember,
        toggleStaffStatus,
        createCategory,
        deleteCategory,
        requestConfirm,
        confirmModalData,
        setConfirmModalData,
        receiptModalData,
        setReceiptModalData,
        repayModalSale,
        setRepayModalSale,
        refundModalSale,
        setRefundModalSale,
        showProductModal,
        setShowProductModal,
        showStoreModal,
        setShowStoreModal,
        showStaffModal,
        setShowStaffModal,
        showCategoryModal,
        setShowCategoryModal,
        showTargetModal,
        setShowTargetModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);