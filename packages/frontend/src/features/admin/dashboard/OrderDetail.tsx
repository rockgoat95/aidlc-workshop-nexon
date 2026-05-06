import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/client';
import { Button, Modal } from '../../../shared';

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: { menuName: string; quantity: number; price: number }[];
}

interface OrderDetailProps {
  orders: Order[];
  tableNumber: number;
  onClose: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: '대기중',
  PREPARING: '준비중',
  COMPLETED: '완료',
};

const NEXT_STATUS: Record<string, string> = {
  PENDING: 'PREPARING',
  PREPARING: 'COMPLETED',
};

export function OrderDetail({ orders, tableNumber, onClose }: OrderDetailProps) {
  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiClient.patch(`/admin/orders/${id}/status`, { status });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/orders/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  });

  return (
    <Modal isOpen={true} onClose={onClose} title={`테이블 ${tableNumber} 주문 상세`}>
      <div data-testid="order-detail-modal">
        {orders.map((order) => (
          <div
            key={order.id}
            style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 16, marginBottom: 16 }}
            data-testid={`order-detail-${order.id}`}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 600 }}>{order.orderNumber}</span>
              <span style={{ fontSize: 13, color: '#6b7280' }}>
                {new Date(order.createdAt).toLocaleTimeString('ko-KR')}
              </span>
            </div>

            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '2px 0' }}>
                <span>{item.menuName} x {item.quantity}</span>
                <span>{(item.price * item.quantity).toLocaleString()}원</span>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <span style={{ fontWeight: 700 }}>{order.totalAmount.toLocaleString()}원</span>
              <div style={{ display: 'flex', gap: 8 }}>
                {NEXT_STATUS[order.status] && (
                  <Button
                    size="sm"
                    onClick={() => statusMutation.mutate({ id: order.id, status: NEXT_STATUS[order.status] })}
                    loading={statusMutation.isPending}
                    data-testid={`order-status-btn-${order.id}`}
                  >
                    {STATUS_LABELS[NEXT_STATUS[order.status]]}으로 변경
                  </Button>
                )}
                {order.status === 'COMPLETED' && (
                  <span style={{ color: '#16a34a', fontWeight: 600, fontSize: 14 }}>✓ 완료</span>
                )}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    if (confirm('이 주문을 삭제하시겠습니까?')) {
                      deleteMutation.mutate(order.id);
                    }
                  }}
                  data-testid={`order-delete-btn-${order.id}`}
                >
                  삭제
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
