import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { queryClient } from './api/query-client';
import { AdminLogin } from './features/auth/AdminLogin';
import { TableLogin } from './features/auth/TableLogin';
import { MenuList } from './features/menu/MenuList';
import { CartPanel } from './features/cart/CartPanel';
import { OrderConfirm } from './features/order/OrderConfirm';
import { OrderHistory } from './features/order/OrderHistory';
import { OrderDashboard } from './features/admin/dashboard/OrderDashboard';
import { TableManagement } from './features/admin/table-management/TableManagement';
import { Navigation } from './shared/Navigation';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navigation />
        <div style={{ paddingBottom: 70 }}>
          <Routes>
            {/* Customer routes */}
            <Route path="/" element={<MenuList />} />
            <Route path="/cart" element={<CartPanel />} />
            <Route path="/order/confirm" element={<OrderConfirm />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/login" element={<TableLogin />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<OrderDashboard />} />
            <Route path="/admin/menus" element={<div style={{ padding: 16 }}>메뉴 관리 (관리자 메뉴 CRUD UI - 추후 개선)</div>} />
            <Route path="/admin/tables" element={<TableManagement />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
