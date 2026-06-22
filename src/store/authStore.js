import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../shared/services/api.js';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post('/auth/login', { email, password });
          set({
            user: { _id: res.data._id, name: res.data.name, email: res.data.email },
            token: res.data.token,
            isAuthenticated: true,
            loading: false,
          });
          return true;
        } catch (err) {
          const errMsg = err.response?.data?.message || 'Login failed. Please try again.';
          set({ error: errMsg, loading: false });
          return false;
        }
      },

      register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post('/auth/register', { name, email, password });
          set({
            user: { _id: res.data._id, name: res.data.name, email: res.data.email },
            token: res.data.token,
            isAuthenticated: true,
            loading: false,
          });
          return true;
        } catch (err) {
          const errMsg = err.response?.data?.message || 'Registration failed. Please try again.';
          set({ error: errMsg, loading: false });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: async () => {
        if (!get().token) return;
        try {
          const res = await api.get('/auth/profile');
          set({
            user: { _id: res.data._id, name: res.data.name, email: res.data.email },
            isAuthenticated: true,
          });
        } catch (err) {
          // If token failed validation, authStore is reset by the interceptor automatically
          console.error('Session validation failed:', err.message);
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'mockai-auth-store', // Key name in localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
