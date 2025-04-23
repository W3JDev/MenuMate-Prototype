import Image from "next/image"
import type { MenuItem, MenuTranslation, Language } from "@/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Flame, X } from "lucide-react"

interface ItemDetailsDialogProps {
  item: MenuItem
  translations?: MenuTranslation[]
  language: Language
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ItemDetailsDialog({ item, translations, language, open, onOpenChange }: ItemDetailsDialogProps) {
  // Get translation for current language
  const translation = translations?.find((t) => t.language_code === language)

  // Use translated content if available, otherwise use default
  const name = translation?.translated_name || item.name
  const description = translation?.translated_description || item.description

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
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
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">Spice Level:</span>
        <div className="flex">
          {Array.from({ length: level }).map((_, i) => (
            <Flame key={i} className="h-4 w-4 text-red-500" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl">{name}</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="mt-2">
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <Image
              src={item.image_url || "/placeholder.svg?height=192&width=384"}
              alt={name}
              fill
              className="object-cover"
            />
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-2xl font-bold">{formatPrice(item.price)}</div>
            {!item.available && <Badge variant="destructive">Currently unavailable</Badge>}
          </div>

          {description && <p className="mt-4 text-muted-foreground">{description}</p>}

          <Separator className="my-4" />

          <div className="space-y-3">
            {renderSpiceLevel()}

            {item.dietary_info.length > 0 && (
              <div>
                <span className="text-sm font-medium">Dietary:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {item.dietary_info.map((diet) => (
                    <Badge key={diet} variant="outline">
                      {diet}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {item.allergens.length > 0 && (
              <div>
                <span className="text-sm font-medium">Contains Allergens:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {item.allergens.map((allergen) => (
                    <Badge key={allergen} variant="outline" className="bg-red-500/10">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

