import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/layout/Sidebar";
import MobileHeader from "./components/layout/MobileHeader";
import MobileBottomNav from "./components/layout/MobileBottomNav";
import ReceiptWhatsAppModal from "./components/modals/ReceiptWhatsAppModal";
import RepayDebtModal from "./components/modals/RepayDebtModal";
import ProductFormModal from "./components/modals/ProductFormModal";
import StoreFormModal from "./components/modals/StoreFormModal";
import StaffFormModal from "./components/modals/StaffFormModal";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import POSTerminal from "./pages/POSTerminal";
import CreditBook from "./pages/CreditBook";
import InventoryManager from "./pages/InventoryManager";
import StoresAndStaff from "./pages/StoresAndStaff";
import SalesAudit from "./pages/SalesAudit";

function AppShell() {
  const { isLoggedIn, currentRole, activePage } = useAuth();

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
      <ProductFormModal />
      <StoreFormModal />
      <StaffFormModal />
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
