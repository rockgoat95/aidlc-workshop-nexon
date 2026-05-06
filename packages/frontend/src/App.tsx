import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { queryClient } from './api/query-client';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Customer routes */}
          <Route path="/" element={<div>메뉴 화면 (Unit 2에서 구현)</div>} />
          <Route path="/cart" element={<div>장바구니 (Unit 3에서 구현)</div>} />
          <Route path="/orders" element={<div>주문 내역 (Unit 3에서 구현)</div>} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<div>관리자 로그인 (Unit 1에서 구현)</div>} />
          <Route path="/admin/dashboard" element={<div>대시보드 (Unit 4에서 구현)</div>} />
          <Route path="/admin/menus" element={<div>메뉴 관리 (Unit 2에서 구현)</div>} />
          <Route path="/admin/tables" element={<div>테이블 관리 (Unit 5에서 구현)</div>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
