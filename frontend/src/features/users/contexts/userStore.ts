import { create } from "zustand"

import type { PrivateUser } from "@/services";

type UserState = {
  user: PrivateUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: PrivateUser) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
};


export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
