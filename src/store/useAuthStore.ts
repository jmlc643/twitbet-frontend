import { create } from 'zustand';
import Cookies from 'js-cookie';
import type { User } from '@/features/auth/types/auth.types';
import { authApi } from '@/features/auth/api/auth.api';

const TOKEN_KEY = 'twitbet_token';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initAuth: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: Cookies.get(TOKEN_KEY) || null,
  isAuthenticated: !!Cookies.get(TOKEN_KEY),

  setAuth: (user, token) => {
    Cookies.set(TOKEN_KEY, token, { expires: 3, secure: true, sameSite: 'lax' });
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    Cookies.remove(TOKEN_KEY);
    set({ user: null, token: null, isAuthenticated: false });
  },

  initAuth: async () => {
    const token = Cookies.get(TOKEN_KEY);
    if (!token) {
      set({ user: null, token: null, isAuthenticated: false });
      return;
    }
    
    try {
      const user = await authApi.getProfile(token);
      set({ user, token, isAuthenticated: true });
    } catch {
      Cookies.remove(TOKEN_KEY);
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  updateUser: (data) => set((state) => ({
    user: state.user ? { ...state.user, ...data } : null
  })),
}));