import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { MenuItem, MenuCategory, Language } from "@/types"

interface MenuState {
  items: MenuItem[]
  categories: MenuCategory[]
  selectedCategory: string | null
  searchQuery: string
  dietaryFilters: string[]
  allergenFilters: string[]
  spiceLevelFilter: string | null
  currentLanguage: Language

  setItems: (items: MenuItem[]) => void
  setCategories: (categories: MenuCategory[]) => void
  selectCategory: (categoryId: string | null) => void
  setSearchQuery: (query: string) => void
  toggleDietaryFilter: (filter: string) => void
  toggleAllergenFilter: (filter: string) => void
  setSpiceLevelFilter: (level: string | null) => void
  setLanguage: (language: Language) => void

  filteredItems: () => MenuItem[]
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      items: [],
      categories: [],
      selectedCategory: null,
      searchQuery: "",
      dietaryFilters: [],
      allergenFilters: [],
      spiceLevelFilter: null,
      currentLanguage: "en",

      setItems: (items) => set({ items }),
      setCategories: (categories) => set({ categories }),
      selectCategory: (categoryId) => set({ selectedCategory: categoryId }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      toggleDietaryFilter: (filter) =>
        set((state) => ({
          dietaryFilters: state.dietaryFilters.includes(filter)
            ? state.dietaryFilters.filter((f) => f !== filter)
            : [...state.dietaryFilters, filter],
        })),

      toggleAllergenFilter: (filter) =>
        set((state) => ({
          allergenFilters: state.allergenFilters.includes(filter)
            ? state.allergenFilters.filter((f) => f !== filter)
            : [...state.allergenFilters, filter],
        })),

      setSpiceLevelFilter: (level) => set({ spiceLevelFilter: level }),
      setLanguage: (language) => set({ currentLanguage: language }),

      filteredItems: () => {
        const state = get()
        return state.items.filter((item) => {
          // Filter by category
          if (state.selectedCategory && item.category_id !== state.selectedCategory) {
            return false
          }

          // Filter by search query
          if (state.searchQuery && !item.name.toLowerCase().includes(state.searchQuery.toLowerCase())) {
            return false
          }

          // Filter by dietary preferences
          if (state.dietaryFilters.length > 0) {
            if (!state.dietaryFilters.every((filter) => item.dietary_info.includes(filter))) {
              return false
            }
          }

          // Filter by allergens (exclude items with selected allergens)
          if (state.allergenFilters.length > 0) {
            if (state.allergenFilters.some((allergen) => item.allergens.includes(allergen))) {
              return false
            }
          }

          // Filter by spice level
          if (state.spiceLevelFilter && item.spice_level !== state.spiceLevelFilter) {
            return false
          }

          return true
        })
      },
    }),
    {
      name: "menu-storage",
      partialize: (state) => ({
        currentLanguage: state.currentLanguage,
        dietaryFilters: state.dietaryFilters,
        allergenFilters: state.allergenFilters,
      }),
    },
  ),
)

