import type { Restaurant, MenuItem, MenuCategory, MenuTranslation, AIConfig } from "@/types"
import {
  mockRestaurant,
  mockCategories,
  mockMenuItems,
  mockTranslations,
  mockAIConfig,
  mockAIResponse,
} from "./mock-data"

// Base API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

// Helper function for API requests
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // In a real app, we would make the API call
  // const res = await fetch(`${API_URL}${endpoint}`, {
  //   ...options,
  //   headers: {
  //     'Content-Type': 'application/json',
  //     ...options?.headers,
  //   },
  // });

  // if (!res.ok) {
  //   const error = await res.json();
  //   throw new Error(error.message || 'An error occurred');
  // }

  // return res.json();

  // For the preview, we'll use mock data instead
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve({} as T)
    }, 500)
  })
}

// Restaurant API
export const RestaurantAPI = {
  getRestaurant: (id: string): Promise<Restaurant> =>
    // fetchAPI(`/restaurants/${id}`),
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockRestaurant)
      }, 500)
    }),

  updateRestaurant: (id: string, data: Partial<Restaurant>): Promise<Restaurant> =>
    // fetchAPI(`/restaurants/${id}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify(data),
    // }),
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...mockRestaurant, ...data })
      }, 500)
    }),

  updateOperatingHours: (id: string, hours: Restaurant["operating_hours"]): Promise<Restaurant> =>
    // fetchAPI(`/restaurants/${id}/hours`, {
    //   method: 'PUT',
    //   body: JSON.stringify({ operating_hours: hours }),
    // }),
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...mockRestaurant, operating_hours: hours })
      }, 500)
    }),
}

// Menu API
export const MenuAPI = {
  getCategories: (restaurantId: string): Promise<MenuCategory[]> =>
    // fetchAPI(`/restaurants/${restaurantId}/categories`),
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCategories)
      }, 500)
    }),

  createCategory: (data: Omit<MenuCategory, "id">): Promise<MenuCategory> =>
    // fetchAPI('/categories', {
    //   method: 'POST',
    //   body: JSON.stringify(data),
    // }),
    new Promise((resolve) => {
      setTimeout(() => {
        const newCategory: MenuCategory = {
          ...(data as any),
          id: `cat${Date.now()}`,
        }
        resolve(newCategory)
      }, 500)
    }),

  updateCategory: (id: string, data: Partial<MenuCategory>): Promise<MenuCategory> =>
    // fetchAPI(`/categories/${id}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify(data),
    // }),
    new Promise((resolve) => {
      setTimeout(() => {
        const category = mockCategories.find((c) => c.id === id) || mockCategories[0]
        resolve({ ...category, ...data })
      }, 500)
    }),

  deleteCategory: (id: string): Promise<void> =>
    // fetchAPI(`/categories/${id}`, {
    //   method: 'DELETE',
    // }),
    new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 500)
    }),

  getMenuItems: (restaurantId: string): Promise<MenuItem[]> =>
    // fetchAPI(`/restaurants/${restaurantId}/menu-items`),
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockMenuItems)
      }, 500)
    }),

  getMenuItem: (id: string): Promise<MenuItem> =>
    // fetchAPI(`/menu-items/${id}`),
    new Promise((resolve) => {
      setTimeout(() => {
        const item = mockMenuItems.find((i) => i.id === id) || mockMenuItems[0]
        resolve(item)
      }, 500)
    }),

  createMenuItem: (data: Omit<MenuItem, "id">): Promise<MenuItem> =>
    // fetchAPI('/menu-items', {
    //   method: 'POST',
    //   body: JSON.stringify(data),
    // }),
    new Promise((resolve) => {
      setTimeout(() => {
        const newItem: MenuItem = {
          ...(data as any),
          id: `item${Date.now()}`,
        }
        resolve(newItem)
      }, 500)
    }),

  updateMenuItem: (id: string, data: Partial<MenuItem>): Promise<MenuItem> =>
    // fetchAPI(`/menu-items/${id}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify(data),
    // }),
    new Promise((resolve) => {
      setTimeout(() => {
        const item = mockMenuItems.find((i) => i.id === id) || mockMenuItems[0]
        resolve({ ...item, ...data })
      }, 500)
    }),

  deleteMenuItem: (id: string): Promise<void> =>
    // fetchAPI(`/menu-items/${id}`, {
    //   method: 'DELETE',
    // }),
    new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 500)
    }),

  getTranslations: (itemId: string): Promise<MenuTranslation[]> =>
    // fetchAPI(`/menu-items/${itemId}/translations`),
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTranslations[itemId] || [])
      }, 500)
    }),

  updateTranslation: (id: string, data: Partial<MenuTranslation>): Promise<MenuTranslation> =>
    // fetchAPI(`/translations/${id}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify(data),
    // }),
    new Promise((resolve) => {
      setTimeout(() => {
        const allTranslations = Object.values(mockTranslations).flat()
        const translation = allTranslations.find((t) => t.id === id) || allTranslations[0]
        resolve({ ...translation, ...data })
      }, 500)
    }),
}

// AI API
export const AIAPI = {
  getConfig: (restaurantId: string): Promise<AIConfig> =>
    // fetchAPI(`/restaurants/${restaurantId}/ai-config`),
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAIConfig)
      }, 500)
    }),

  updateConfig: (id: string, data: Partial<AIConfig>): Promise<AIConfig> =>
    // fetchAPI(`/ai-config/${id}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify(data),
    // }),
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...mockAIConfig, ...data })
      }, 500)
    }),

  generateDescription: (
    itemName: string,
    language: string,
    dietary_info?: string,
    allergens?: string,
    spice_level?: string,
  ): Promise<string> =>
    // fetchAPI(`/ai/generate-description`, {
    //   method: 'POST',
    //   body: JSON.stringify({ itemName, language, dietary_info, allergens, spice_level }),
    // }),
    new Promise((resolve) => {
      setTimeout(() => {
        // Create a more dynamic response that includes the dietary info if provided
        const dietaryInfo = dietary_info ? `It's ${dietary_info}. ` : ""
        const allergensInfo = allergens ? `Contains allergens: ${allergens}. ` : ""
        const spiceInfo = spice_level ? `Spice level: ${spice_level}. ` : ""

        resolve(`${mockAIResponse} ${dietaryInfo}${allergensInfo}${spiceInfo}`)
      }, 1000)
    }),

  askQuestion: (restaurantId: string, question: string): Promise<string> =>
    // fetchAPI(`/ai/ask`, {
    //   method: 'POST',
    //   body: JSON.stringify({ restaurantId, question }),
    // }),
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          `I'm happy to help with your question: "${question}". Here at MenuMate Restaurant, we focus on providing delicious food with excellent service. Is there anything specific about our menu or offerings you'd like to know?`,
        )
      }, 1000)
    }),
}

// Upload API
export const UploadAPI = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    // In a real app, we would upload the file
    // const formData = new FormData();
    // formData.append('file', file);

    // const res = await fetch(`${API_URL}/upload`, {
    //   method: 'POST',
    //   body: formData,
    // });

    // if (!res.ok) {
    //   const error = await res.json();
    //   throw new Error(error.message || 'Upload failed');
    // }

    // return res.json();

    // For the preview, we'll simulate an upload
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create a mock URL based on the file name
        const url = `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(file.name)}`
        resolve({ url })
      }, 1000)
    })
  },
}

