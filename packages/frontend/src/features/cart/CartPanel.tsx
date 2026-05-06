import { useCartStore } from '../../stores/cart-store';
import { Button } from '../../shared';
import { useNavigate } from 'react-router-dom';

export function CartPanel() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const getTotalAmount = useCartStore((s) => s.getTotalAmount);
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: 16 }}>장바구니가 비어있습니다.</p>
        <Button variant="secondary" onClick={() => navigate('/')}>
          메뉴 보기
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }} data-testid="cart-panel">
      <h2 style={{ fontSize: 20, marginBottom: 16 }}>장바구니</h2>

      {items.map((item) => (
        <div
          key={item.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid #e5e7eb',
          }}
          data-testid={`cart-item-${item.id}`}
        >
          <div>
            <p style={{ margin: 0, fontWeight: 600 }}>{item.name}</p>
            <p style={{ margin: '4px 0 0', color: '#6b7280' }}>
              {item.price.toLocaleString()}원
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: 18 }}
              data-testid={`cart-decrease-${item.id}`}
            >
              -
            </button>
            <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: 18 }}
              data-testid={`cart-increase-${item.id}`}
            >
              +
            </button>
            <button
              onClick={() => removeItem(item.id)}
              style={{ marginLeft: 8, color: '#dc2626', border: 'none', background: 'none', cursor: 'pointer', fontSize: 14 }}
              data-testid={`cart-remove-${item.id}`}
            >
              삭제
            </button>
          </div>
        </div>
      ))}

      <div style={{ marginTop: 20, padding: '16px 0', borderTop: '2px solid #111' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700 }}>
          <span>총 금액</span>
          <span>{getTotalAmount().toLocaleString()}원</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <Button variant="secondary" onClick={clear} data-testid="cart-clear-button">
          비우기
        </Button>
        <Button onClick={() => navigate('/order/confirm')} style={{ flex: 1 }} data-testid="cart-order-button">
          주문하기
        </Button>
      </div>
    </div>
  );
}
