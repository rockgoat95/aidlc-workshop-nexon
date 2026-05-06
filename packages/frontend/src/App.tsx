import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { queryClient } from './api/query-client';
import { useAuthStore } from './stores/auth-store';
import { useAdminAuthStore } from './stores/admin-auth-store';
import { AdminLogin } from './features/auth/AdminLogin';
import { TableLogin } from './features/auth/TableLogin';
import { MenuList } from './features/menu/MenuList';
import { CartPanel } from './features/cart/CartPanel';
import { OrderConfirm } from './features/order/OrderConfirm';
import { OrderHistory } from './features/order/OrderHistory';
import { OrderDashboard } from './features/admin/dashboard/OrderDashboard';
import { TableManagement } from './features/admin/table-management/TableManagement';
import { AdminMenuManagement } from './features/admin/menu-management/AdminMenuManagement';
import { Navigation } from './shared/Navigation';

function RootPage() {
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.role);

  if (!token || role !== 'customer') {
    return <TableLogin />;
  }

  return <MenuList />;
}

function AdminRootRedirect() {
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated()) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Navigate to="/admin/login" replace />;
}

function CustomerGuard({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.role);
  if (!token || role !== 'customer') {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navigation />
        <div style={{ paddingBottom: 70 }}>
          <Routes>
            {/* Root - login check then menu or table setup */}
            <Route path="/" element={<RootPage />} />
            <Route path="/login" element={<TableLogin />} />

            {/* Customer routes - require table login */}
            <Route path="/cart" element={<CustomerGuard><CartPanel /></CustomerGuard>} />
            <Route path="/order/confirm" element={<CustomerGuard><OrderConfirm /></CustomerGuard>} />
            <Route path="/orders" element={<CustomerGuard><OrderHistory /></CustomerGuard>} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminRootRedirect />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminGuard><OrderDashboard /></AdminGuard>} />
            <Route path="/admin/menus" element={<AdminGuard><AdminMenuManagement /></AdminGuard>} />
            <Route path="/admin/tables" element={<AdminGuard><TableManagement /></AdminGuard>} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
