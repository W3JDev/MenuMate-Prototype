"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RestaurantAPI } from "@/lib/api"
import { useRestaurantStore } from "@/store/restaurant-store"
import type { Restaurant, OperatingHours } from "@/types"
import { Loader2, Save, Upload } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"

// Mock restaurant ID - in a real app, this would be dynamic
const RESTAURANT_ID = "123"

// Days of the week
const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function SettingsPage() {
  const { restaurant, setRestaurant } = useRestaurantStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)

  // Create a copy of restaurant data for editing
  const [formData, setFormData] = useState<Partial<Restaurant>>({
    name: "",
    description: "",
    address: "",
    phone: "",
    whatsapp_link: "",
    booking_link: "",
    map_link: "",
    operating_hours: [],
  })

  // Fetch restaurant data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch restaurant data
        const restaurantData = await RestaurantAPI.getRestaurant(RESTAURANT_ID)
        setRestaurant(restaurantData)
        setFormData(restaurantData)

        // Set image previews
        if (restaurantData.logo_url) {
          setLogoPreview(restaurantData.logo_url)
        }
        if (restaurantData.banner_url) {
          setBannerPreview(restaurantData.banner_url)
        }
      } catch (error) {
        console.error("Error fetching restaurant data:", error)
        toast({
          title: "Error",
          description: "Failed to load restaurant data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [setRestaurant])

  // Handle form input changes
  const handleChange = (field: keyof Restaurant, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Handle logo upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle banner upload
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannerPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle operating hours changes
  const updateOperatingHours = (index: number, field: keyof OperatingHours, value: any) => {
    const updatedHours = [...(formData.operating_hours || [])]
    updatedHours[index] = { ...updatedHours[index], [field]: value }
    handleChange("operating_hours", updatedHours)
  }

  // Handle shift changes
  const updateShift = (dayIndex: number, shiftIndex: number, field: "open" | "close", value: string) => {
    const updatedHours = [...(formData.operating_hours || [])]
    updatedHours[dayIndex].shifts[shiftIndex][field] = value
    handleChange("operating_hours", updatedHours)
  }

  // Add a new shift
  const addShift = (dayIndex: number) => {
    const updatedHours = [...(formData.operating_hours || [])]
    updatedHours[dayIndex].shifts.push({ open: "09:00", close: "17:00" })
    handleChange("operating_hours", updatedHours)
  }

  // Remove a shift
  const removeShift = (dayIndex: number, shiftIndex: number) => {
    const updatedHours = [...(formData.operating_hours || [])]
    updatedHours[dayIndex].shifts.splice(shiftIndex, 1)
    handleChange("operating_hours", updatedHours)
  }

  // Save restaurant settings
  const saveSettings = async () => {
    if (!formData.name || !formData.address || !formData.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      // TODO: Upload logo and banner files

      // Update restaurant data
      await RestaurantAPI.updateRestaurant(RESTAURANT_ID, formData)

      // Update operating hours
      if (formData.operating_hours && formData.operating_hours.length > 0) {
        await RestaurantAPI.updateOperatingHours(RESTAURANT_ID, formData.operating_hours)
      }

      // Update restaurant in store
      setRestaurant({ ...restaurant, ...formData } as Restaurant)

      toast({
        title: "Success",
        description: "Restaurant settings saved successfully.",
      })
    } catch (error) {
      console.error("Error saving restaurant settings:", error)
      toast({
        title: "Error",
        description: "Failed to save restaurant settings. Please try again.",
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
          <h2 className="text-xl font-bold">Loading settings...</h2>
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
        <h2 className="text-3xl font-bold">Restaurant Settings</h2>
        <Button onClick={saveSettings} disabled={isSaving} className="gap-2">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Settings
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="hours">Operating Hours</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Information</CardTitle>
              <CardDescription>Basic information about your restaurant.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Restaurant Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter restaurant name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Describe your restaurant"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address || ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Enter restaurant address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Images</CardTitle>
              <CardDescription>Upload your restaurant logo and banner images.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Restaurant Logo</Label>
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-border flex items-center justify-center">
                    {logoPreview ? (
                      <Image src={logoPreview || "/placeholder.svg"} alt="Logo Preview" fill className="object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-xs text-muted-foreground">Upload Logo</p>
                      </div>
                    )}
                  </div>

                  <Input id="logo" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                  <Label
                    htmlFor="logo"
                    className="mt-4 cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                  >
                    {logoPreview ? "Change Logo" : "Upload Logo"}
                  </Label>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Banner Image</Label>
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-dashed border-border flex items-center justify-center">
                    {bannerPreview ? (
                      <Image
                        src={bannerPreview || "/placeholder.svg"}
                        alt="Banner Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Upload Banner Image</p>
                      </div>
                    )}
                  </div>

                  <Input id="banner" type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
                  <Label
                    htmlFor="banner"
                    className="mt-4 cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                  >
                    {bannerPreview ? "Change Banner" : "Upload Banner"}
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
              <CardDescription>Set your restaurant's operating hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DAYS_OF_WEEK.map((day, index) => {
                  const dayData = formData.operating_hours?.find((h) => h.day.toLowerCase() === day.toLowerCase()) || {
                    day: day.toLowerCase(),
                    closed: false,
                    shifts: [{ open: "09:00", close: "17:00" }],
                  }

                  return (
                    <div key={day} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{day}</h3>
                        <div className="flex items-center">
                          <Label htmlFor={`${day.toLowerCase()}-closed`} className="mr-2">
                            Closed
                          </Label>
                          <Input
                            type="checkbox"
                            id={`${day.toLowerCase()}-closed`}
                            checked={dayData.closed}
                            onChange={(e) => updateOperatingHours(index, "closed", e.target.checked)}
                            className="h-4 w-4"
                          />
                        </div>
                      </div>

                      {!dayData.closed && (
                        <div className="space-y-2">
                          {dayData.shifts.map((shift, shiftIndex) => (
                            <div key={shiftIndex} className="flex items-center gap-2">
                              <div className="grid grid-cols-2 gap-2 flex-1">
                                <div>
                                  <Label htmlFor={`${day.toLowerCase()}-open-${shiftIndex}`}>Open</Label>
                                  <Input
                                    type="time"
                                    id={`${day.toLowerCase()}-open-${shiftIndex}`}
                                    value={shift.open}
                                    onChange={(e) => updateShift(index, shiftIndex, "open", e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`${day.toLowerCase()}-close-${shiftIndex}`}>Close</Label>
                                  <Input
                                    type="time"
                                    id={`${day.toLowerCase()}-close-${shiftIndex}`}
                                    value={shift.close}
                                    onChange={(e) => updateShift(index, shiftIndex, "close", e.target.value)}
                                  />
                                </div>
                              </div>

                              {dayData.shifts.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeShift(index, shiftIndex)}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          ))}

                          <Button type="button" variant="outline" size="sm" onClick={() => addShift(index)}>
                            Add Shift
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>External Links</CardTitle>
              <CardDescription>Set up links to external services.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp_link">WhatsApp Link</Label>
                <Input
                  id="whatsapp_link"
                  value={formData.whatsapp_link || ""}
                  onChange={(e) => handleChange("whatsapp_link", e.target.value)}
                  placeholder="https://wa.me/1234567890"
                />
                <p className="text-xs text-muted-foreground">Format: https://wa.me/1234567890 (without + or spaces)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking_link">Booking Link</Label>
                <Input
                  id="booking_link"
                  value={formData.booking_link || ""}
                  onChange={(e) => handleChange("booking_link", e.target.value)}
                  placeholder="https://your-booking-system.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="map_link">Google Maps Link</Label>
                <Input
                  id="map_link"
                  value={formData.map_link || ""}
                  onChange={(e) => handleChange("map_link", e.target.value)}
                  placeholder="https://goo.gl/maps/your-location"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

