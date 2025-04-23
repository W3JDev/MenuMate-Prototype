export type Language = "en" | "zh" | "vi" | "ms" | "my" | "ta"

export interface Restaurant {
  id: string
  name: string
  address: string
  phone: string
  whatsapp_link?: string
  booking_link?: string
  map_link?: string
  description?: string
  logo_url?: string
  banner_url?: string
  operating_hours: OperatingHours[]
  businessHours?: {
    [key: string]: {
      open: string
      close: string
    }
  }
  created_date?: string
  updated_date?: string
  created_by?: string
}

export interface OperatingHours {
  day: string
  closed: boolean
  shifts: {
    open: string
    close: string
  }[]
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category_id: string
  image_url?: string
  dietary_info: string[]
  allergens: string[]
  spice_level?: "mild" | "medium" | "hot" | "extra-hot"
  available: boolean
  featured: boolean
}

export interface MenuCategory {
  id: string
  name: string
  image_url?: string
}

export interface MenuTranslation {
  id: string
  item_id: string
  language_code: Language
  translated_name: string
  translated_description: string
}

export interface AIConfig {
  id: string
  restaurant_id: string
  provider: "openai" | "google" | "groq"
  model: string
  temperature: number
  max_tokens: number
  prompt_template: string
}

export interface User {
  id: string
  email: string
  name?: string
  role: "admin" | "staff" | "customer"
}

