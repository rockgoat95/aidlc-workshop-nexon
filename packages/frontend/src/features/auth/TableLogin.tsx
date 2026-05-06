import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth-store';
import apiClient from '../../api/client';
import { Button } from '../../shared';

export function TableLogin() {
  const [storeId] = useState('store-001');
  const [tableNumber, setTableNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await apiClient.post('/tables/login', {
        storeId,
        tableNumber: parseInt(tableNumber),
        password,
      });
      setAuth({
        token: data.token,
        role: 'customer',
        storeId,
        tableId: data.tableId,
        sessionId: data.sessionId,
      });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>테이블 로그인</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>테이블 번호와 비밀번호를 입력하세요.</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input
          type="number"
          placeholder="테이블 번호"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          style={{ padding: 12, fontSize: 16, borderRadius: 8, border: '1px solid #d1d5db' }}
          data-testid="table-login-number"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 12, fontSize: 16, borderRadius: 8, border: '1px solid #d1d5db' }}
          data-testid="table-login-password"
        />
        {error && <p style={{ color: '#dc2626', margin: 0 }}>{error}</p>}
        <Button type="submit" loading={loading} data-testid="table-login-submit">
          로그인
        </Button>
      </form>
    </div>
  );
}
