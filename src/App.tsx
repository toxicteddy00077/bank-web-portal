
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import CustomerDashboard from "./pages/customer/Dashboard";
import CustomerAccounts from "./pages/customer/Accounts";
import CustomerLoans from "./pages/customer/Loans";
import CustomerTransactions from "./pages/customer/Transactions";
import EmployeeDashboard from "./pages/employee/Dashboard";
import EmployeeUsers from "./pages/employee/Users";
import EmployeeAccounts from "./pages/employee/Accounts";
import EmployeeTransactions from "./pages/employee/Transactions";
import EmployeeSQLPage from "./pages/employee/SQL";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Public route */}
            <Route path="/login" element={<Login />} />
            
            {/* Customer routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/accounts" element={
              <ProtectedRoute requiredRole="customer">
                <CustomerAccounts />
              </ProtectedRoute>
            } />
            <Route path="/loans" element={
              <ProtectedRoute requiredRole="customer">
                <CustomerLoans />
              </ProtectedRoute>
            } />
            <Route path="/transactions" element={
              <ProtectedRoute requiredRole="customer">
                <CustomerTransactions />
              </ProtectedRoute>
            } />
            
            {/* Employee routes */}
            <Route path="/employee-dashboard" element={
              <ProtectedRoute requiredRole="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            } />
            <Route path="/employee/users" element={
              <ProtectedRoute requiredRole="employee">
                <EmployeeUsers />
              </ProtectedRoute>
            } />
            <Route path="/employee/accounts" element={
              <ProtectedRoute requiredRole="employee">
                <EmployeeAccounts />
              </ProtectedRoute>
            } />
            <Route path="/employee/transactions" element={
              <ProtectedRoute requiredRole="employee">
                <EmployeeTransactions />
              </ProtectedRoute>
            } />
            <Route path="/employee/sql" element={
              <ProtectedRoute requiredRole="employee">
                <EmployeeSQLPage />
              </ProtectedRoute>
            } />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
