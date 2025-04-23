import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  login: (user: User) => void
  logout: () => void
  setLoading: (isLoading: boolean) => void
}

// Default admin user
const defaultUser: User = {
  id: "admin-1",
  email: "admin@menumate.com",
  name: "Admin User",
  role: "admin",
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Start with the default user logged in for demo purposes
      user: defaultUser,
      isAuthenticated: true,
      isLoading: false,

      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "auth-storage",
    },
  ),
)

