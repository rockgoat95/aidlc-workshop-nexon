import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { queryClient } from './api/query-client';
import { AdminLogin } from './features/auth/AdminLogin';
import { MenuList } from './features/menu/MenuList';
import { CartPanel } from './features/cart/CartPanel';
import { OrderConfirm } from './features/order/OrderConfirm';
import { OrderHistory } from './features/order/OrderHistory';
import { OrderDashboard } from './features/admin/dashboard/OrderDashboard';
import { TableManagement } from './features/admin/table-management/TableManagement';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Customer routes */}
          <Route path="/" element={<MenuList />} />
          <Route path="/cart" element={<CartPanel />} />
          <Route path="/order/confirm" element={<OrderConfirm />} />
          <Route path="/orders" element={<OrderHistory />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<OrderDashboard />} />
          <Route path="/admin/menus" element={<div>메뉴 관리 (추후 구현)</div>} />
          <Route path="/admin/tables" element={<TableManagement />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
