import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const initialState = {
  token: null,
  user: null
};

export const useAuthStore = create(
  persist(
    (set) => ({
      ...initialState,
      setAuth: ({ token, user }) => set({ token, user }),
      setUser: (user) => set((state) => ({ ...state, user })),
      clearAuth: () => set(initialState)
    }),
    {
      name: "wow-ubon-auth",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
