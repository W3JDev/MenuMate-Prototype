import { create } from "zustand"
import type { Restaurant } from "@/types"

interface RestaurantState {
  restaurant: Restaurant | null
  isLoading: boolean
  error: string | null

  setRestaurant: (restaurant: Restaurant) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useRestaurantStore = create<RestaurantState>((set) => ({
  restaurant: null,
  isLoading: false,
  error: null,

  setRestaurant: (restaurant) => set({ restaurant }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))

