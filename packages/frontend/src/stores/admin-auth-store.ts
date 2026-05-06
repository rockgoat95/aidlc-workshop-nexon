import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminAuthState {
  token: string | null;
  storeId: string | null;
  username: string | null;
  setAuth: (data: { token: string; storeId: string; username: string }) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      token: null,
      storeId: null,
      username: null,
      setAuth: (data) => {
        set({
          token: data.token,
          storeId: data.storeId,
          username: data.username,
        });
      },
      logout: () => {
        set({ token: null, storeId: null, username: null });
      },
      isAuthenticated: () => get().token !== null,
    }),
    { name: 'admin-auth-storage' }
  )
);
