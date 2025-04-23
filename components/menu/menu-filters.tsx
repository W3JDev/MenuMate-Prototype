"use client"
import { useMenuStore } from "@/store/menu-store"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Common dietary options
const DIETARY_OPTIONS = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten Free" },
  { id: "dairy-free", label: "Dairy Free" },
  { id: "nut-free", label: "Nut Free" },
  { id: "halal", label: "Halal" },
]

// Common allergens
const ALLERGEN_OPTIONS = [
  { id: "peanuts", label: "Peanuts" },
  { id: "tree-nuts", label: "Tree Nuts" },
  { id: "dairy", label: "Dairy" },
  { id: "eggs", label: "Eggs" },
  { id: "wheat", label: "Wheat" },
  { id: "soy", label: "Soy" },
  { id: "fish", label: "Fish" },
  { id: "shellfish", label: "Shellfish" },
]

// Spice levels
const SPICE_LEVELS = [
  { id: "mild", label: "Mild" },
  { id: "medium", label: "Medium" },
  { id: "hot", label: "Hot" },
  { id: "extra-hot", label: "Extra Hot" },
]

interface MenuFiltersProps {
  onClose?: () => void
}

export function MenuFilters({ onClose }: MenuFiltersProps) {
  const {
    searchQuery,
    setSearchQuery,
    dietaryFilters,
    toggleDietaryFilter,
    allergenFilters,
    toggleAllergenFilter,
    spiceLevelFilter,
    setSpiceLevelFilter,
  } = useMenuStore()

  const totalFilters = dietaryFilters.length + allergenFilters.length + (spiceLevelFilter ? 1 : 0)

  return (
    <div className="flex flex-col gap-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search menu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {totalFilters > 0 && (
        <div className="flex flex-wrap gap-2">
          {dietaryFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {DIETARY_OPTIONS.find((opt) => opt.id === filter)?.label}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => toggleDietaryFilter(filter)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {allergenFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              No {ALLERGEN_OPTIONS.find((opt) => opt.id === filter)?.label}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => toggleAllergenFilter(filter)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {spiceLevelFilter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {SPICE_LEVELS.find((opt) => opt.id === spiceLevelFilter)?.label}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => setSpiceLevelFilter(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              dietaryFilters.forEach((filter) => toggleDietaryFilter(filter))
              allergenFilters.forEach((filter) => toggleAllergenFilter(filter))
              setSpiceLevelFilter(null)
              if (onClose) onClose()
            }}
            className="text-xs"
          >
            Clear All
          </Button>
        </div>
      )}

      <Separator className="my-2" />

      {/* Dietary Preferences */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Dietary Preferences</h3>
        <div className="grid grid-cols-2 gap-3">
          {DIETARY_OPTIONS.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`dietary-${option.id}`}
                checked={dietaryFilters.includes(option.id)}
                onCheckedChange={() => toggleDietaryFilter(option.id)}
              />
              <Label htmlFor={`dietary-${option.id}`} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-2" />

      {/* Allergens */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Exclude Allergens</h3>
        <div className="grid grid-cols-2 gap-3">
          {ALLERGEN_OPTIONS.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`allergen-${option.id}`}
                checked={allergenFilters.includes(option.id)}
                onCheckedChange={() => toggleAllergenFilter(option.id)}
              />
              <Label htmlFor={`allergen-${option.id}`} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-2" />

      {/* Spice Level */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Spice Level</h3>
        <RadioGroup value={spiceLevelFilter || ""} onValueChange={(value) => setSpiceLevelFilter(value || null)}>
          <div className="grid grid-cols-2 gap-3">
            {SPICE_LEVELS.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={`spice-${option.id}`} />
                <Label htmlFor={`spice-${option.id}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Mobile-only buttons */}
      {onClose && (
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Apply Filters</Button>
        </div>
      )}
    </div>
  )
}

