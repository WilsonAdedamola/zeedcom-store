import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/layout/Sidebar";
import MobileHeader from "./components/layout/MobileHeader";
import MobileBottomNav from "./components/layout/MobileBottomNav";
import ReceiptWhatsAppModal from "./components/modals/ReceiptWhatsAppModal";
import RepayDebtModal from "./components/modals/RepayDebtModal";
import RefundModal from "./components/modals/RefundModal";
import ConfirmActionModal from "./components/modals/ConfirmActionModal";
import ProductFormModal from "./components/modals/ProductFormModal";
import StoreFormModal from "./components/modals/StoreFormModal";
import StaffFormModal from "./components/modals/StaffFormModal";
import CategoryFormModal from "./components/modals/CategoryFormModal";
import TargetFormModal from "./components/modals/TargetFormModal";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import POSTerminal from "./pages/POSTerminal";
import CreditBook from "./pages/CreditBook";
import InventoryManager from "./pages/InventoryManager";
import StoresAndStaff from "./pages/StoresAndStaff";
import SalesAudit from "./pages/SalesAudit";

function AppShell() {
  const { isLoggedIn, dbLoading, currentRole, activePage } = useAuth();

  if (dbLoading) {
    return (
      <div className="min-h-screen bg-[#212121] text-[#FFFFFF] flex items-center justify-center font-black text-sm">
        Connecting to Zeedcom Stores...
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex flex-col lg:flex-row text-[#212121]">
      <Sidebar />
      <MobileHeader />

      <main className="flex-1 overflow-y-auto pb-24 lg:pb-8">
        {activePage === "dashboard" && currentRole === "admin" && (
          <AdminDashboard />
        )}
        {activePage === "pos" && <POSTerminal />}
        {activePage === "credit" && <CreditBook />}
        {activePage === "inventory" && currentRole === "admin" && (
          <InventoryManager />
        )}
        {activePage === "stores" && currentRole === "admin" && (
          <StoresAndStaff />
        )}
        {activePage === "sales" && <SalesAudit />}
      </main>

      <MobileBottomNav />

      {/* Global Interactive Modals */}
      <ReceiptWhatsAppModal />
      <RepayDebtModal />
      <RefundModal />
      <ProductFormModal />
      <StoreFormModal />
      <StaffFormModal />
      <CategoryFormModal />
      <TargetFormModal />
      <ConfirmActionModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}