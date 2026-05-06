import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/client';
import { Button, Loading, ErrorMessage, Modal } from '../../../shared';

interface Table {
  id: string;
  tableNumber: number;
  sessions: { id: string; endedAt: string | null; orders: any[] }[];
}

export function TableManagement() {
  const queryClient = useQueryClient();
  const [showSetup, setShowSetup] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [newTablePassword, setNewTablePassword] = useState('');

  const { data: tables = [], isLoading, error, refetch } = useQuery({
    queryKey: ['admin-tables'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/tables');
      return data.tables as Table[];
    },
  });

  const setupMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post('/admin/tables/setup', {
        tableNumber: parseInt(newTableNumber),
        password: newTablePassword,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tables'] });
      setShowSetup(false);
      setNewTableNumber('');
      setNewTablePassword('');
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (tableId: string) => {
      await apiClient.post(`/admin/tables/${tableId}/complete`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-tables'] }),
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message="테이블 정보를 불러올 수 없습니다." onRetry={refetch} />;

  return (
    <div style={{ padding: 16 }} data-testid="table-management">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>테이블 관리</h1>
        <Button onClick={() => setShowSetup(true)} data-testid="table-setup-button">
          + 테이블 설정
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {tables.map((table) => {
          const activeSession = table.sessions.find(s => !s.endedAt);
          const orderCount = activeSession?.orders.length || 0;

          return (
            <div
              key={table.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 16,
                backgroundColor: activeSession ? '#f0fdf4' : '#f9fafb',
              }}
              data-testid={`table-item-${table.tableNumber}`}
            >
              <h3 style={{ margin: '0 0 8px' }}>테이블 {table.tableNumber}</h3>
              <p style={{ margin: '0 0 4px', fontSize: 13, color: '#6b7280' }}>
                상태: {activeSession ? '사용중' : '비활성'}
              </p>
              {activeSession && (
                <>
                  <p style={{ margin: '0 0 12px', fontSize: 13, color: '#6b7280' }}>
                    주문: {orderCount}건
                  </p>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      if (confirm(`테이블 ${table.tableNumber}을 이용 완료 처리하시겠습니까?`)) {
                        completeMutation.mutate(table.id);
                      }
                    }}
                    data-testid={`table-complete-${table.tableNumber}`}
                  >
                    이용 완료
                  </Button>
                </>
              )}
            </div>
          );
        })}
      </div>

      <Modal isOpen={showSetup} onClose={() => setShowSetup(false)} title="테이블 설정">
        <form
          onSubmit={(e) => { e.preventDefault(); setupMutation.mutate(); }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <input
            type="number"
            placeholder="테이블 번호"
            value={newTableNumber}
            onChange={(e) => setNewTableNumber(e.target.value)}
            style={{ padding: 12, borderRadius: 8, border: '1px solid #d1d5db' }}
            data-testid="table-setup-number"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={newTablePassword}
            onChange={(e) => setNewTablePassword(e.target.value)}
            style={{ padding: 12, borderRadius: 8, border: '1px solid #d1d5db' }}
            data-testid="table-setup-password"
          />
          <Button type="submit" loading={setupMutation.isPending} data-testid="table-setup-submit">
            설정 완료
          </Button>
        </form>
      </Modal>
    </div>
  );
}
