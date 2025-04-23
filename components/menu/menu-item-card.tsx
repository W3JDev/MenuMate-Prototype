"use client"

import { useState } from "react"
import Image from "next/image"
import type { MenuItem, MenuTranslation, Language } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Info, Flame } from "lucide-react"
import { cn } from "@/lib/utils"
import { ItemDetailsDialog } from "./item-details-dialog"
import { mockTranslations } from "@/lib/mock-data"

interface MenuItemCardProps {
  item: MenuItem
  translations?: MenuTranslation[]
  language: Language
}

export function MenuItemCard({ item, translations, language }: MenuItemCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Get translations from mock data if not provided
  const itemTranslations = translations || mockTranslations[item.id] || []

  // Get translation for current language
  const translation = itemTranslations.find((t) => t.language_code === language)

  // Use translated content if available, otherwise use default
  const name = translation?.translated_name || item.name
  const description = translation?.translated_description || item.description

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "MYR",
      currencyDisplay: "narrowSymbol",
    }).format(price)
  }

  // Render spice level indicator
  const renderSpiceLevel = () => {
    if (!item.spice_level) return null

    const levels = {
      mild: 1,
      medium: 2,
      hot: 3,
      "extra-hot": 4,
    }

    const level = levels[item.spice_level as keyof typeof levels] || 0

    return (
      <div className="flex items-center gap-1" title={`Spice Level: ${item.spice_level}`}>
        {Array.from({ length: level }).map((_, i) => (
          <Flame key={i} className="h-3 w-3 text-ios-red" />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className={cn("ios-card transition-all duration-300", !item.available && "opacity-60")}>
        <div className="flex gap-3 p-3">
          {/* Image */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-ios overflow-hidden flex-shrink-0">
            <Image
              src={item.image_url || "/placeholder.svg?height=96&width=96"}
              alt={name}
              fill
              className="object-cover"
            />
            {item.featured && (
              <div className="absolute top-0 left-0 bg-ios-yellow text-xs px-1.5 py-0.5 rounded-br-lg font-medium">
                Featured
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-base truncate">{name}</h3>
              <span className="font-bold text-base ml-2 flex-shrink-0">{formatPrice(item.price)}</span>
            </div>

            {description && <p className="text-sm text-ios-gray-1 line-clamp-2 mt-1">{description}</p>}

            <div className="flex items-center justify-between mt-2">
              <div className="flex flex-wrap gap-1">
                {item.dietary_info.length > 0 && (
                  <div className="flex gap-1">
                    {item.dietary_info.slice(0, 2).map((diet) => (
                      <Badge
                        key={diet}
                        variant="outline"
                        className="text-xs rounded-full bg-ios-gray-6 text-ios-gray-1 border-transparent"
                      >
                        {diet}
                      </Badge>
                    ))}
                    {item.dietary_info.length > 2 && (
                      <Badge
                        variant="outline"
                        className="text-xs rounded-full bg-ios-gray-6 text-ios-gray-1 border-transparent"
                      >
                        +{item.dietary_info.length - 2}
                      </Badge>
                    )}
                  </div>
                )}

                {renderSpiceLevel()}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full text-ios-blue"
                onClick={() => setShowDetails(true)}
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {!item.available && <div className="px-3 pb-3 text-sm text-ios-red font-medium">Currently unavailable</div>}
      </div>

      <ItemDetailsDialog
        item={item}
        translations={itemTranslations}
        language={language}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </>
  )
}

