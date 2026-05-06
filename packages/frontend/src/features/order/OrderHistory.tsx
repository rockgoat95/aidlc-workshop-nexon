import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/auth-store';
import apiClient from '../../api/client';
import { Loading, ErrorMessage } from '../../shared';

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: { menuName: string; quantity: number; price: number }[];
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: '대기중',
  PREPARING: '준비중',
  COMPLETED: '완료',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  PREPARING: '#3b82f6',
  COMPLETED: '#16a34a',
};

export function OrderHistory() {
  const sessionId = useAuthStore((s) => s.sessionId);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['orders', sessionId],
    queryFn: async () => {
      const { data } = await apiClient.get('/orders');
      return data.orders as Order[];
    },
    enabled: !!sessionId,
    refetchInterval: 5000, // Poll every 5 seconds for status updates
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message="주문 내역을 불러올 수 없습니다." onRetry={refetch} />;

  const orders = data || [];

  if (orders.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
        주문 내역이 없습니다.
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }} data-testid="order-history">
      <h2 style={{ fontSize: 20, marginBottom: 16 }}>주문 내역</h2>
      {orders.map((order) => (
        <div
          key={order.id}
          style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 12 }}
          data-testid={`order-item-${order.id}`}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 600 }}>{order.orderNumber}</span>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 600,
                backgroundColor: STATUS_COLORS[order.status] + '20',
                color: STATUS_COLORS[order.status],
              }}
            >
              {STATUS_LABELS[order.status] || order.status}
            </span>
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
            {new Date(order.createdAt).toLocaleString('ko-KR')}
          </div>
          {order.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '2px 0' }}>
              <span>{item.menuName} x {item.quantity}</span>
              <span>{(item.price * item.quantity).toLocaleString()}원</span>
            </div>
          ))}
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f3f4f6', textAlign: 'right', fontWeight: 700 }}>
            {order.totalAmount.toLocaleString()}원
          </div>
        </div>
      ))}
    </div>
  );
}
