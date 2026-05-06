import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  role: 'customer' | 'admin' | null;
  tableId: string | null;
  sessionId: string | null;
  storeId: string | null;
  setAuth: (data: {
    token: string;
    role: 'customer' | 'admin';
    storeId: string;
    tableId?: string;
    sessionId?: string;
  }) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      role: null,
      tableId: null,
      sessionId: null,
      storeId: null,
      setAuth: (data) => {
        localStorage.setItem('token', data.token);
        set({
          token: data.token,
          role: data.role,
          storeId: data.storeId,
          tableId: data.tableId || null,
          sessionId: data.sessionId || null,
        });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({
          token: null,
          role: null,
          tableId: null,
          sessionId: null,
          storeId: null,
        });
      },
      isAuthenticated: () => get().token !== null,
    }),
    {
      name: 'auth-storage',
    }
  )
);
