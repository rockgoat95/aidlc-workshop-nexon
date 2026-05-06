import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useCartStore } from '../../stores/cart-store';
import { useAuthStore } from '../../stores/auth-store';
import apiClient from '../../api/client';
import { Button } from '../../shared';

export function OrderConfirm() {
  const items = useCartStore((s) => s.items);
  const getTotalAmount = useCartStore((s) => s.getTotalAmount);
  const clear = useCartStore((s) => s.clear);
  const sessionId = useAuthStore((s) => s.sessionId);
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/orders', {
        items: items.map((item) => ({
          menuId: item.id,
          menuName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: getTotalAmount(),
      });
      return data;
    },
    onSuccess: (data) => {
      setOrderNumber(data.orderNumber);
      clear();
      setTimeout(() => navigate('/'), 5000);
    },
  });

  if (orderNumber) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }} data-testid="order-success">
        <h2 style={{ color: '#16a34a', marginBottom: 16 }}>주문 완료!</h2>
        <p style={{ fontSize: 24, fontWeight: 700 }}>주문번호: {orderNumber}</p>
        <p style={{ color: '#6b7280', marginTop: 16 }}>5초 후 메뉴 화면으로 이동합니다.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }} data-testid="order-confirm">
      <h2 style={{ fontSize: 20, marginBottom: 16 }}>주문 확인</h2>

      {items.map((item) => (
        <div
          key={item.id}
          style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}
        >
          <span>{item.name} x {item.quantity}</span>
          <span>{(item.price * item.quantity).toLocaleString()}원</span>
        </div>
      ))}

      <div style={{ marginTop: 16, padding: '12px 0', borderTop: '2px solid #111', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
        <span>총 금액</span>
        <span>{getTotalAmount().toLocaleString()}원</span>
      </div>

      {mutation.error && (
        <p style={{ color: '#dc2626', marginTop: 12 }}>
          주문에 실패했습니다. 다시 시도해주세요.
        </p>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <Button variant="secondary" onClick={() => navigate('/cart')}>
          뒤로
        </Button>
        <Button
          onClick={() => mutation.mutate()}
          loading={mutation.isPending}
          style={{ flex: 1 }}
          data-testid="order-confirm-button"
        >
          주문 확정
        </Button>
      </div>
    </div>
  );
}
