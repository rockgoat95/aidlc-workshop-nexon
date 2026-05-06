interface TableCardProps {
  tableNumber: number;
  totalAmount: number;
  latestOrder: { orderNumber: string; status: string; items: { menuName: string; quantity: number }[] } | null;
  hasNewOrder: boolean;
  onClick: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: '대기중',
  PREPARING: '준비중',
  COMPLETED: '완료',
};

export function TableCard({ tableNumber, totalAmount, latestOrder, hasNewOrder, onClick }: TableCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        border: hasNewOrder ? '2px solid #f59e0b' : '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 16,
        cursor: 'pointer',
        backgroundColor: hasNewOrder ? '#fffbeb' : '#fff',
        transition: 'transform 0.1s',
      }}
      data-testid={`table-card-${tableNumber}`}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>테이블 {tableNumber}</h3>
        {hasNewOrder && (
          <span style={{ backgroundColor: '#f59e0b', color: '#fff', padding: '2px 8px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
            NEW
          </span>
        )}
      </div>

      <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#2563eb' }}>
        {totalAmount.toLocaleString()}원
      </p>

      {latestOrder && (
        <div style={{ fontSize: 13, color: '#6b7280' }}>
          <p style={{ margin: '0 0 4px' }}>
            최근: {latestOrder.orderNumber} ({STATUS_LABELS[latestOrder.status]})
          </p>
          <p style={{ margin: 0 }}>
            {latestOrder.items.slice(0, 2).map(i => `${i.menuName} x${i.quantity}`).join(', ')}
            {latestOrder.items.length > 2 && ` 외 ${latestOrder.items.length - 2}건`}
          </p>
        </div>
      )}
    </div>
  );
}
