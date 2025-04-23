import Image from "next/image"
import type { Restaurant } from "@/types"
import { MapPin, Phone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RestaurantBannerProps {
  restaurant: Restaurant
}

export function RestaurantBanner({ restaurant }: RestaurantBannerProps) {
  const isOpen = () => {
    const now = new Date()
    const day = now.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
    const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })

    const todayHours = restaurant.operating_hours.find((h) => h.day.toLowerCase() === day)

    if (!todayHours || todayHours.closed) return false

    return todayHours.shifts.some((shift) => {
      return time >= shift.open && time <= shift.close
    })
  }

  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
      {/* Banner Image */}
      <Image
        src={restaurant.banner_url || "/placeholder.svg?height=400&width=1200"}
        alt={restaurant.name}
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 flex flex-col md:flex-row items-start md:items-end gap-4">
        {/* Logo */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-background glass">
          <Image
            src={restaurant.logo_url || "/placeholder.svg?height=128&width=128"}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-4xl font-bold">{restaurant.name}</h1>
          <p className="text-muted-foreground mt-1">{restaurant.description}</p>

          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-1 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{restaurant.address}</span>
            </div>

            <div className="flex items-center gap-1 text-sm">
              <Phone className="w-4 h-4" />
              <span>{restaurant.phone}</span>
            </div>

            <div className="flex items-center gap-1 text-sm">
              <Clock className="w-4 h-4" />
              <span className={cn(isOpen() ? "text-green-500" : "text-red-500")}>
                {isOpen() ? "Open Now" : "Closed"}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 md:mt-0">
          {restaurant.booking_link && (
            <Button variant="default" size="sm" asChild>
              <a href={restaurant.booking_link} target="_blank" rel="noopener noreferrer">
                Book a Table
              </a>
            </Button>
          )}

          {restaurant.map_link && (
            <Button variant="outline" size="sm" asChild>
              <a href={restaurant.map_link} target="_blank" rel="noopener noreferrer">
                Get Directions
              </a>
            </Button>
          )}

          {restaurant.whatsapp_link && (
            <Button variant="outline" size="sm" asChild>
              <a href={restaurant.whatsapp_link} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

