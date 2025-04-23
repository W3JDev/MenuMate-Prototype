"use client"

import { useMenuStore } from "@/store/menu-store"
import type { MenuCategory } from "@/types"
import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Image from "next/image"

interface CategoryTabsProps {
  categories: MenuCategory[]
}

export function CategoryTabs({ categories }: CategoryTabsProps) {
  const { selectedCategory, selectCategory } = useMenuStore()

  return (
    <ScrollArea className="w-full">
      <div className="flex space-x-3 p-1 no-scrollbar">
        <button
          onClick={() => selectCategory(null)}
          className={cn(
            "flex flex-col items-center space-y-2 p-2 rounded-xl transition-all",
            !selectedCategory
              ? "bg-ios-blue/10 ring-2 ring-ios-blue"
              : "opacity-70 hover:opacity-100 hover:bg-ios-gray-6",
          )}
        >
          <div className="w-16 h-16 relative rounded-full overflow-hidden shadow-ios-sm">
            <Image src="/placeholder.svg?height=64&width=64" alt="All" fill className="object-cover" />
          </div>
          <span className="text-xs font-medium">All</span>
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => selectCategory(category.id)}
            className={cn(
              "flex flex-col items-center space-y-2 p-2 rounded-xl transition-all",
              selectedCategory === category.id
                ? "bg-ios-blue/10 ring-2 ring-ios-blue"
                : "opacity-70 hover:opacity-100 hover:bg-ios-gray-6",
            )}
          >
            <div className="w-16 h-16 relative rounded-full overflow-hidden shadow-ios-sm">
              <Image
                src={category.image_url || "/placeholder.svg?height=64&width=64"}
                alt={category.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs font-medium">{category.name}</span>
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

