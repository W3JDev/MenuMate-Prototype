"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MenuAPI, UploadAPI, AIAPI } from "@/lib/api"
import type { MenuItem, MenuCategory } from "@/types"
import { Loader2, Upload, Bot } from "lucide-react"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"

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

interface MenuItemFormProps {
  itemId?: string
  restaurantId: string
}

export function MenuItemForm({ itemId, restaurantId }: MenuItemFormProps) {
  const router = useRouter()
  const isEditing = !!itemId

  const [item, setItem] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 0,
    category_id: "",
    image_url: "",
    dietary_info: [],
    allergens: [],
    spice_level: undefined,
    available: true,
    featured: false,
  })

  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch categories
        const categoriesData = await MenuAPI.getCategories(restaurantId)
        setCategories(categoriesData)

        // If editing, fetch item data
        if (isEditing && itemId) {
          const itemData = await MenuAPI.getMenuItem(itemId)
          setItem(itemData)
          if (itemData.image_url) {
            setImagePreview(itemData.image_url)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [itemId, isEditing, restaurantId])

  // Handle form input changes
  const handleChange = (field: keyof MenuItem, value: any) => {
    setItem((prev) => ({ ...prev, [field]: value }))
  }

  // Handle dietary info changes
  const handleDietaryChange = (dietId: string, checked: boolean) => {
    if (checked) {
      handleChange("dietary_info", [...(item.dietary_info || []), dietId])
    } else {
      handleChange(
        "dietary_info",
        (item.dietary_info || []).filter((id) => id !== dietId),
      )
    }
  }

  // Handle allergen changes
  const handleAllergenChange = (allergenId: string, checked: boolean) => {
    if (checked) {
      handleChange("allergens", [...(item.allergens || []), allergenId])
    } else {
      handleChange(
        "allergens",
        (item.allergens || []).filter((id) => id !== allergenId),
      )
    }
  }

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Generate description using AI
  const generateDescription = async () => {
    if (!item.name) {
      toast({
        title: "Error",
        description: "Please enter a name before generating a description.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingDescription(true)
    try {
      // Pass only the item name and language
      const description = await AIAPI.generateDescription(item.name, "en")
      handleChange("description", description)
      toast({
        title: "Success",
        description: "Description generated successfully.",
      })
    } catch (error) {
      console.error("Error generating description:", error)
      toast({
        title: "Error",
        description: "Failed to generate description. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingDescription(false)
    }
  }

  // Save menu item
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!item.name || !item.price || !item.category_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      // Upload image if selected
      let imageUrl = item.image_url
      if (imageFile) {
        const uploadResult = await UploadAPI.uploadImage(imageFile)
        imageUrl = uploadResult.url
      }

      const itemData = {
        ...item,
        image_url: imageUrl,
      }

      // Create or update item
      if (isEditing && itemId) {
        await MenuAPI.updateMenuItem(itemId, itemData)
        toast({
          title: "Success",
          description: "Menu item updated successfully.",
        })
      } else {
        await MenuAPI.createMenuItem(itemData as Omit<MenuItem, "id">)
        toast({
          title: "Success",
          description: "Menu item created successfully.",
        })
      }

      // Redirect to menu management
      router.push("/admin/menu")
    } catch (error) {
      console.error("Error saving menu item:", error)
      toast({
        title: "Error",
        description: "Failed to save menu item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="glass-card p-8 rounded-lg">
          <h2 className="text-xl font-bold">Loading...</h2>
          <div className="mt-4 flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-75" />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-150" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the basic details of your menu item.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={item.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter item name"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Description</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateDescription}
                  disabled={isGeneratingDescription}
                  className="gap-2"
                >
                  {isGeneratingDescription ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
                  Generate with AI
                </Button>
              </div>
              <Textarea
                id="description"
                value={item.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe this menu item"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={item.price || ""}
                onChange={(e) => handleChange("price", Number.parseFloat(e.target.value))}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={item.category_id || ""} onValueChange={(value) => handleChange("category_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Image Upload */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Item Image</CardTitle>
            <CardDescription>Upload an image for this menu item.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-dashed border-border flex items-center justify-center">
                {imagePreview ? (
                  <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Drag and drop an image, or click to browse</p>
                  </div>
                )}
              </div>

              <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <Label
                htmlFor="image"
                className="mt-4 cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
              >
                {imagePreview ? "Change Image" : "Upload Image"}
              </Label>
            </div>

            <div className="space-y-4 mt-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={item.available}
                  onCheckedChange={(checked) => handleChange("available", checked)}
                />
                <Label htmlFor="available">Item is available</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={item.featured}
                  onCheckedChange={(checked) => handleChange("featured", checked)}
                />
                <Label htmlFor="featured">Feature this item</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dietary Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Dietary Information</CardTitle>
            <CardDescription>Specify dietary preferences and allergens.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Dietary Preferences</h3>
                <div className="grid grid-cols-2 gap-3">
                  {DIETARY_OPTIONS.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dietary-${option.id}`}
                        checked={(item.dietary_info || []).includes(option.id)}
                        onCheckedChange={(checked) => handleDietaryChange(option.id, checked === true)}
                      />
                      <Label htmlFor={`dietary-${option.id}`}>{option.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Contains Allergens</h3>
                <div className="grid grid-cols-2 gap-3">
                  {ALLERGEN_OPTIONS.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`allergen-${option.id}`}
                        checked={(item.allergens || []).includes(option.id)}
                        onCheckedChange={(checked) => handleAllergenChange(option.id, checked === true)}
                      />
                      <Label htmlFor={`allergen-${option.id}`}>{option.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-4">Spice Level</h3>
              <RadioGroup
                value={item.spice_level || ""}
                onValueChange={(value) => handleChange("spice_level", value || undefined)}
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
              >
                {SPICE_LEVELS.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={`spice-${option.id}`} />
                    <Label htmlFor={`spice-${option.id}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/menu")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Update Item" : "Create Item"}
        </Button>
      </div>
    </form>
  )
}

