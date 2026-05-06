import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth-store';
import apiClient from '../../api/client';
import { Button } from '../../shared';

export function AdminLogin() {
  const [storeId, setStoreId] = useState('store-001');
  const [username, setUsername] = useState('');
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
      const { data } = await apiClient.post('/admin/login', { storeId, username, password });
      setAuth({ token: data.token, role: 'admin', storeId });
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>관리자 로그인</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input
          type="text"
          placeholder="사용자명"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: 12, fontSize: 16, borderRadius: 8, border: '1px solid #d1d5db' }}
          data-testid="admin-login-username"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 12, fontSize: 16, borderRadius: 8, border: '1px solid #d1d5db' }}
          data-testid="admin-login-password"
        />
        {error && <p style={{ color: '#dc2626', margin: 0 }}>{error}</p>}
        <Button type="submit" loading={loading} data-testid="admin-login-submit">
          로그인
        </Button>
      </form>
    </div>
  );
}
