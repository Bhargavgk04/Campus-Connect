import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getApiUrl } from "@/config/api";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      login: async (email, password) => {
        try {
          set({ isLoading: true });
          const response = await fetch(getApiUrl('auth/login'), {
            method: "POST",
            credentials: 'include',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error("Login failed");
          }

          const user = await response.json();
          set({ user, isLoading: false });
          return user;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      logout: async () => {
        try {
          set({ isLoading: true });
          await fetch(getApiUrl('auth/logout'), {
            method: "POST",
            credentials: 'include',
          });
          set({ user: null, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      checkAuth: async () => {
        try {
          set({ isLoading: true });
          const response = await fetch(getApiUrl('auth/status'), {
            credentials: 'include'
          });
          if (!response.ok) {
            set({ user: null, isLoading: false });
            return null;
          }
          const user = await response.json();
          set({ user, isLoading: false });
          return user;
        } catch (error) {
          set({ user: null, isLoading: false });
          return null;
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    isLoading: store.isLoading,
    login: store.login,
    logout: store.logout,
    checkAuth: store.checkAuth,
  };
};

export default useAuth; 