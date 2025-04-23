"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MenuAPI } from "@/lib/api"
import type { MenuItem, MenuTranslation, Language } from "@/types"
import { Loader2, Save, Bot } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Mock restaurant ID - in a real app, this would be dynamic
const RESTAURANT_ID = "123"

// Language options
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "zh", name: "中文" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "ms", name: "Bahasa Melayu" },
  { code: "my", name: "မြန်မာဘာသာ" },
  { code: "ta", name: "தமிழ்" },
]

export default function TranslationsPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [translations, setTranslations] = useState<Record<string, MenuTranslation[]>>({})
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch menu data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch menu items
        const itemsData = await MenuAPI.getMenuItems(RESTAURANT_ID)
        setItems(itemsData)

        // If there are items, select the first one
        if (itemsData.length > 0) {
          setSelectedItem(itemsData[0].id)

          // Fetch translations for the first item
          const translationsData = await MenuAPI.getTranslations(itemsData[0].id)
          setTranslations({ [itemsData[0].id]: translationsData })
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load menu data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fetch translations for selected item
  useEffect(() => {
    const fetchTranslations = async () => {
      if (!selectedItem) return

      // Skip if we already have translations for this item
      if (translations[selectedItem]) return

      try {
        const translationsData = await MenuAPI.getTranslations(selectedItem)
        setTranslations((prev) => ({ ...prev, [selectedItem]: translationsData }))
      } catch (error) {
        console.error("Error fetching translations:", error)
      }
    }

    fetchTranslations()
  }, [selectedItem, translations])

  // Filter items based on search query
  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Get selected item
  const currentItem = items.find((item) => item.id === selectedItem)

  // Get translations for selected item
  const currentTranslations = selectedItem ? translations[selectedItem] || [] : []

  // Update translation
  const updateTranslation = (
    language: Language,
    field: "translated_name" | "translated_description",
    value: string,
  ) => {
    if (!selectedItem) return

    const existingTranslation = currentTranslations.find((t) => t.language_code === language)

    if (existingTranslation) {
      // Update existing translation
      setTranslations((prev) => ({
        ...prev,
        [selectedItem]: prev[selectedItem].map((t) => (t.language_code === language ? { ...t, [field]: value } : t)),
      }))
    } else {
      // Create new translation
      const newTranslation: MenuTranslation = {
        id: `new-${selectedItem}-${language}`,
        item_id: selectedItem,
        language_code: language,
        translated_name: field === "translated_name" ? value : "",
        translated_description: field === "translated_description" ? value : "",
      }

      setTranslations((prev) => ({
        ...prev,
        [selectedItem]: [...(prev[selectedItem] || []), newTranslation],
      }))
    }
  }

  // Save translations
  const saveTranslations = async () => {
    if (!selectedItem) return

    setIsSaving(true)
    try {
      // Save each translation
      for (const translation of currentTranslations) {
        await MenuAPI.updateTranslation(translation.id, translation)
      }

      toast({
        title: "Success",
        description: "Translations saved successfully.",
      })
    } catch (error) {
      console.error("Error saving translations:", error)
      toast({
        title: "Error",
        description: "Failed to save translations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Generate translation using AI
  const generateTranslation = async (language: Language) => {
    if (!selectedItem || !currentItem) return

    // TODO: Implement AI translation
    toast({
      title: "Coming Soon",
      description: "AI translation will be available soon.",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="glass-card p-8 rounded-lg">
          <h2 className="text-xl font-bold">Loading translations...</h2>
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-3xl font-bold">Menu Translations</h2>
        <Button onClick={saveTranslations} disabled={isSaving} className="gap-2">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save All Translations
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Item List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Menu Items</CardTitle>
            <CardDescription>Select an item to translate.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Search items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <button
                    key={item.id}
                    className={`w-full text-left p-3 rounded-md transition-colors ${
                      selectedItem === item.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                    }`}
                    onClick={() => setSelectedItem(item.id)}
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {item.description || "No description"}
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center p-4 text-muted-foreground">No items found. Try adjusting your search.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Translation Editor */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{currentItem ? `Translate: ${currentItem.name}` : "Select an item"}</CardTitle>
            <CardDescription>Provide translations for each language.</CardDescription>
          </CardHeader>
          <CardContent>
            {currentItem ? (
              <Tabs defaultValue="zh" className="space-y-4">
                <TabsList className="flex flex-wrap">
                  {LANGUAGES.filter((lang) => lang.code !== "en").map((language) => (
                    <TabsTrigger key={language.code} value={language.code}>
                      {language.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {LANGUAGES.filter((lang) => lang.code !== "en").map((language) => {
                  const translation = currentTranslations.find((t) => t.language_code === language.code)

                  return (
                    <TabsContent key={language.code} value={language.code} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Original Name (English)</Label>
                          <Input value={currentItem.name} disabled />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`name-${language.code}`}>Translated Name ({language.name})</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => generateTranslation(language.code as Language)}
                              className="gap-2"
                            >
                              <Bot className="h-4 w-4" />
                              Generate
                            </Button>
                          </div>
                          <Input
                            id={`name-${language.code}`}
                            value={translation?.translated_name || ""}
                            onChange={(e) =>
                              updateTranslation(language.code as Language, "translated_name", e.target.value)
                            }
                            placeholder={`Enter ${language.name} name`}
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Original Description (English)</Label>
                          <Textarea value={currentItem.description || ""} disabled rows={4} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`description-${language.code}`}>
                              Translated Description ({language.name})
                            </Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => generateTranslation(language.code as Language)}
                              className="gap-2"
                            >
                              <Bot className="h-4 w-4" />
                              Generate
                            </Button>
                          </div>
                          <Textarea
                            id={`description-${language.code}`}
                            value={translation?.translated_description || ""}
                            onChange={(e) =>
                              updateTranslation(language.code as Language, "translated_description", e.target.value)
                            }
                            placeholder={`Enter ${language.name} description`}
                            rows={4}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  )
                })}
              </Tabs>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                Select a menu item from the list to start translating.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

