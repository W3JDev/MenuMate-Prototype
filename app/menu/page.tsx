"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { MenuItemCard } from "@/components/menu/menu-item-card"
import { MenuFilters } from "@/components/menu/menu-filters"
import { CategoryTabs } from "@/components/menu/category-tabs"
import { LanguageSelector } from "@/components/menu/language-selector"
import { MenuAPI, RestaurantAPI } from "@/lib/api"
import { useMenuStore } from "@/store/menu-store"
import { useRestaurantStore } from "@/store/restaurant-store"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Filter } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { VoiceChatAssistant } from "@/components/ai/voice-chat-assistant"

// Restaurant ID
const RESTAURANT_ID = "67e5935b23a0f201833a3012"

export default function MenuPage() {
  const { restaurant, setRestaurant, isLoading: isRestaurantLoading, error } = useRestaurantStore()
  const { items, categories, setItems, setCategories, currentLanguage, filteredItems } = useMenuStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch restaurant data if not already loaded
        if (!restaurant) {
          const restaurantData = await RestaurantAPI.getRestaurant(RESTAURANT_ID)
          setRestaurant(restaurantData)
        }

        // Fetch menu categories
        const categoriesData = await MenuAPI.getCategories(RESTAURANT_ID)
        setCategories(categoriesData)

        // Fetch menu items
        const itemsData = await MenuAPI.getMenuItems(RESTAURANT_ID)
        setItems(itemsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [restaurant, setRestaurant, setCategories, setItems])

  if (error) {
    return (
      <>
        <Header title="Menu" />
        <div className="container py-8">
          <Alert variant="destructive" className="ios-card border-ios-red/20 bg-ios-red/10">
            <AlertCircle className="h-4 w-4 text-ios-red" />
            <AlertTitle className="text-ios-red">Error</AlertTitle>
            <AlertDescription className="text-ios-red/80">{error}</AlertDescription>
          </Alert>
        </div>
      </>
    )
  }

  return (
    <>
      <Header title="Menu" />
      <main className="flex-1">
        <div className="container py-4">
          {/* Top Bar with Language and Filter */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Our Menu</h1>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="ios" size="icon" className="md:hidden rounded-full">
                    <Filter className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[300px] sm:w-[400px] bg-white/90 dark:bg-black/90 backdrop-blur-md"
                >
                  <div className="py-4">
                    <h2 className="text-lg font-semibold mb-4">Filters</h2>
                    <MenuFilters onClose={() => setIsFilterOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Category Tabs - Horizontal Scrollable */}
          <div className="mb-6">
            {isLoading ? (
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-20 w-20 rounded-full flex-shrink-0" />
                  ))}
              </div>
            ) : (
              <CategoryTabs categories={categories} />
            )}
          </div>

          {/* Filters - Desktop Only */}
          <div className="hidden md:block mb-6">
            <MenuFilters />
          </div>

          {/* Menu Items */}
          <div className="space-y-4">
            {isLoading ? (
              // Loading skeletons
              Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="ios-card p-4">
                    <div className="flex gap-4">
                      <Skeleton className="h-24 w-24 rounded-ios flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                  </div>
                ))
            ) : filteredItems().length > 0 ? (
              filteredItems().map((item) => <MenuItemCard key={item.id} item={item} language={currentLanguage} />)
            ) : (
              <div className="ios-card p-8 text-center">
                <h3 className="text-lg font-medium">No items found</h3>
                <p className="text-ios-gray-1 mt-2">Try adjusting your filters or selecting a different category.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Voice Chat Assistant */}
      <VoiceChatAssistant />
    </>
  )
}

