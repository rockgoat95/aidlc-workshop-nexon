import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import apiClient from '../../../api/client';
import { Loading, ErrorMessage } from '../../../shared';
import { TableCard } from './TableCard';
import { OrderDetail } from './OrderDetail';

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: { menuName: string; quantity: number; price: number }[];
  tableSession: { table: { id: string; tableNumber: number } };
}

interface TableGroup {
  tableId: string;
  tableNumber: number;
  orders: Order[];
  totalAmount: number;
  latestOrder: Order | null;
  hasNewOrder: boolean;
}

export function OrderDashboard() {
  const queryClient = useQueryClient();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const { data: orders = [], isLoading, error, refetch } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/orders');
      return data.orders as Order[];
    },
    refetchInterval: 10000,
  });

  // SSE connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const eventSource = new EventSource(`/api/admin/orders/stream?token=${token}`);

    eventSource.onopen = () => setConnected(true);
    eventSource.onerror = () => setConnected(false);

    eventSource.onmessage = () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    };

    eventSource.addEventListener('new-order', () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    });

    eventSource.addEventListener('order-status-changed', () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    });

    eventSource.addEventListener('order-deleted', () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    });

    return () => eventSource.close();
  }, [queryClient]);

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message="주문을 불러올 수 없습니다." onRetry={refetch} />;

  // Group orders by table
  const tableGroups: TableGroup[] = [];
  const tableMap = new Map<string, TableGroup>();

  for (const order of orders) {
    const tableId = order.tableSession.table.id;
    if (!tableMap.has(tableId)) {
      tableMap.set(tableId, {
        tableId,
        tableNumber: order.tableSession.table.tableNumber,
        orders: [],
        totalAmount: 0,
        latestOrder: null,
        hasNewOrder: false,
      });
    }
    const group = tableMap.get(tableId)!;
    group.orders.push(order);
    group.totalAmount += order.totalAmount;
    if (!group.latestOrder || new Date(order.createdAt) > new Date(group.latestOrder.createdAt)) {
      group.latestOrder = order;
    }
    if (order.status === 'PENDING') {
      group.hasNewOrder = true;
    }
  }

  tableMap.forEach((group) => tableGroups.push(group));
  tableGroups.sort((a, b) => a.tableNumber - b.tableNumber);

  const selectedOrders = selectedTable
    ? tableMap.get(selectedTable)?.orders || []
    : [];

  return (
    <div style={{ padding: 16 }} data-testid="order-dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>주문 대시보드</h1>
        <span style={{
          padding: '4px 12px',
          borderRadius: 12,
          fontSize: 13,
          backgroundColor: connected ? '#dcfce7' : '#fee2e2',
          color: connected ? '#16a34a' : '#dc2626',
        }}>
          {connected ? '● 연결됨' : '○ 연결 끊김'}
        </span>
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}
        data-testid="table-grid"
      >
        {tableGroups.map((group) => (
          <TableCard
            key={group.tableId}
            tableNumber={group.tableNumber}
            totalAmount={group.totalAmount}
            latestOrder={group.latestOrder}
            hasNewOrder={group.hasNewOrder}
            onClick={() => setSelectedTable(group.tableId)}
          />
        ))}
      </div>

      {tableGroups.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6b7280', marginTop: 40 }}>
          현재 주문이 없습니다.
        </p>
      )}

      {selectedTable && (
        <OrderDetail
          orders={selectedOrders}
          tableNumber={tableMap.get(selectedTable)?.tableNumber || 0}
          onClose={() => setSelectedTable(null)}
        />
      )}
    </div>
  );
}
