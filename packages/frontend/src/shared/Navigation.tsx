import { useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../stores/cart-store';
import { useAuthStore } from '../stores/auth-store';

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const getTotalItems = useCartStore((s) => s.getTotalItems);
  const role = useAuthStore((s) => s.role);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  // Admin navigation
  if (role === 'admin' && location.pathname.startsWith('/admin')) {
    return (
      <nav style={{
        display: 'flex',
        gap: 8,
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#1f2937',
      }}>
        <NavButton to="/admin/dashboard" current={location.pathname} label="대시보드" light />
        <NavButton to="/admin/tables" current={location.pathname} label="테이블" light />
        <NavButton to="/admin/menus" current={location.pathname} label="메뉴 관리" light />
        <div style={{ flex: 1 }} />
        <button
          onClick={() => { logout(); navigate('/admin/login'); }}
          style={{ padding: '8px 16px', border: 'none', borderRadius: 8, backgroundColor: '#dc2626', color: '#fff', cursor: 'pointer', fontSize: 14 }}
          data-testid="admin-logout-button"
        >
          로그아웃
        </button>
      </nav>
    );
  }

  // Customer navigation
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      borderTop: '1px solid #e5e7eb',
      backgroundColor: '#fff',
      zIndex: 100,
    }}>
      <BottomTab to="/" current={location.pathname} label="메뉴" icon="🍽️" />
      <BottomTab to="/cart" current={location.pathname} label={`장바구니${getTotalItems() > 0 ? ` (${getTotalItems()})` : ''}`} icon="🛒" />
      <BottomTab to="/orders" current={location.pathname} label="주문내역" icon="📋" />
      {!isAuthenticated() && (
        <BottomTab to="/login" current={location.pathname} label="로그인" icon="🔑" />
      )}
    </nav>
  );
}

function NavButton({ to, current, label, light }: { to: string; current: string; label: string; light?: boolean }) {
  const navigate = useNavigate();
  const isActive = current === to;
  return (
    <button
      onClick={() => navigate(to)}
      style={{
        padding: '8px 16px',
        border: 'none',
        borderRadius: 8,
        backgroundColor: isActive ? (light ? '#3b82f6' : '#2563eb') : 'transparent',
        color: light ? '#fff' : (isActive ? '#fff' : '#374151'),
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: isActive ? 700 : 400,
      }}
    >
      {label}
    </button>
  );
}

function BottomTab({ to, current, label, icon }: { to: string; current: string; label: string; icon: string }) {
  const navigate = useNavigate();
  const isActive = current === to;
  return (
    <button
      onClick={() => navigate(to)}
      style={{
        flex: 1,
        padding: '12px 8px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        color: isActive ? '#2563eb' : '#6b7280',
        fontWeight: isActive ? 700 : 400,
        fontSize: 12,
        minHeight: 56,
      }}
      data-testid={`nav-${to.replace('/', '') || 'home'}`}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      {label}
    </button>
  );
}
