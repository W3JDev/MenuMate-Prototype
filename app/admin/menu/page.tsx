"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MenuAPI } from "@/lib/api"
import { useRestaurantStore } from "@/store/restaurant-store"
import type { MenuItem, MenuCategory } from "@/types"
import { Plus, Search, Edit, Trash2, Eye, ArrowUpDown, MoreHorizontal, Globe } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

// Restaurant ID
const RESTAURANT_ID = "67e5935b23a0f201833a3012"

export default function MenuManagement() {
  const router = useRouter()
  const { restaurant } = useRestaurantStore()
  const [items, setItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  // Fetch menu data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch menu categories
        const categoriesData = await MenuAPI.getCategories(RESTAURANT_ID)
        setCategories(categoriesData)

        // Fetch menu items
        const itemsData = await MenuAPI.getMenuItems(RESTAURANT_ID)
        setItems(itemsData)
      } catch (error) {
        console.error("Error fetching menu data:", error)
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

  // Filter items based on search query and selected category
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory ? item.category_id === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "MYR",
      currencyDisplay: "narrowSymbol",
    }).format(price)
  }

  // Delete menu item
  const handleDeleteItem = async () => {
    if (!itemToDelete) return

    try {
      await MenuAPI.deleteMenuItem(itemToDelete)
      setItems(items.filter((item) => item.id !== itemToDelete))
      toast({
        title: "Success",
        description: "Menu item deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting menu item:", error)
      toast({
        title: "Error",
        description: "Failed to delete menu item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setItemToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ios-gray-1" />
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full rounded-full border-ios-gray-5/50"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <select
            className="border border-ios-gray-5/50 bg-white/90 backdrop-blur-md rounded-full h-10 px-4 py-2 text-sm"
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <Button asChild variant="ios-filled">
            <Link href="/admin/menu/new">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Add Item</span>
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList className="w-full sm:w-auto bg-white/90 backdrop-blur-md rounded-full p-1 border border-ios-gray-5/50">
          <TabsTrigger
            value="grid"
            className="flex-1 sm:flex-initial rounded-full data-[state=active]:bg-ios-blue data-[state=active]:text-white"
          >
            Grid View
          </TabsTrigger>
          <TabsTrigger
            value="table"
            className="flex-1 sm:flex-initial rounded-full data-[state=active]:bg-ios-blue data-[state=active]:text-white"
          >
            Table View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="ios-card">
                    <Skeleton className="h-48 w-full rounded-t-ios" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="flex justify-between pt-2">
                        <Skeleton className="h-9 w-20 rounded-full" />
                        <Skeleton className="h-9 w-20 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <Card key={item.id} className={cn("ios-card", !item.available && "opacity-60")}>
                  <div className="relative h-48 w-full">
                    <Image
                      src={item.image_url || "/placeholder.svg?height=192&width=384"}
                      alt={item.name}
                      fill
                      className="object-cover rounded-t-ios"
                    />
                    {item.featured && (
                      <Badge className="absolute top-2 left-2 bg-ios-yellow text-black rounded-full">Featured</Badge>
                    )}
                    {!item.available && (
                      <Badge
                        variant="destructive"
                        className="absolute top-2 right-2 bg-ios-red text-white rounded-full"
                      >
                        Unavailable
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{item.name}</h3>
                        <p className="text-sm text-ios-gray-1 line-clamp-2 mt-1">
                          {item.description || "No description"}
                        </p>
                      </div>
                      <div className="font-bold text-lg">{formatPrice(item.price)}</div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {item.dietary_info.map((diet) => (
                        <Badge
                          key={diet}
                          variant="outline"
                          className="text-xs rounded-full bg-ios-gray-6 text-ios-gray-1 border-transparent"
                        >
                          {diet}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between mt-4">
                      <Button variant="ios" size="sm" asChild className="rounded-full">
                        <Link href={`/admin/menu/${item.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-ios-red rounded-full">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="ios-card">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the menu item "{item.name}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-ios-red text-white rounded-full"
                              onClick={() => {
                                setItemToDelete(item.id)
                                handleDeleteItem()
                              }}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="ios-card p-8 text-center">
              <h3 className="text-lg font-medium">No items found</h3>
              <p className="text-ios-gray-1 mt-2">Try adjusting your filters or search query.</p>
              <Button className="mt-4 rounded-full bg-ios-blue text-white" asChild>
                <Link href="/admin/menu/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Item
                </Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="table">
          <Card className="ios-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-ios-gray-5/50">
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          Name
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="hidden sm:table-cell">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <TableRow key={i} className="border-b border-ios-gray-5/50">
                            <TableCell>
                              <Skeleton className="h-10 w-10 rounded-ios" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-full max-w-[150px]" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Skeleton className="h-5 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-16" />
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Skeleton className="h-5 w-20 rounded-full" />
                            </TableCell>
                            <TableCell className="text-right">
                              <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                            </TableCell>
                          </TableRow>
                        ))
                    ) : filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <TableRow key={item.id} className="border-b border-ios-gray-5/50">
                          <TableCell>
                            <div className="relative h-10 w-10 rounded-ios overflow-hidden">
                              <Image
                                src={item.image_url || "/placeholder.svg?height=40&width=40"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.name}
                            {item.featured && (
                              <Badge
                                variant="outline"
                                className="ml-2 bg-ios-yellow/10 text-ios-yellow border-transparent rounded-full"
                              >
                                Featured
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {categories.find((c) => c.id === item.category_id)?.name || "Uncategorized"}
                          </TableCell>
                          <TableCell>{formatPrice(item.price)}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant={item.available ? "outline" : "destructive"} className="rounded-full">
                              {item.available ? "Available" : "Unavailable"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-xl border border-ios-gray-5/50 dark:border-white/10"
                              >
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  asChild
                                  className="focus:bg-ios-gray-6 focus:text-ios-blue rounded-lg my-0.5 cursor-default"
                                >
                                  <Link href={`/admin/menu/${item.id}`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  asChild
                                  className="focus:bg-ios-gray-6 focus:text-ios-blue rounded-lg my-0.5 cursor-default"
                                >
                                  <Link href={`/admin/menu/${item.id}/translations`}>
                                    <Globe className="mr-2 h-4 w-4" />
                                    Translations
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  asChild
                                  className="focus:bg-ios-gray-6 focus:text-ios-blue rounded-lg my-0.5 cursor-default"
                                >
                                  <Link href="/" target="_blank">
                                    <Eye className="mr-2 h-4 w-4" />
                                    View on Menu
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-ios-gray-5/50" />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      className="text-ios-red focus:bg-ios-red/10 rounded-lg my-0.5 cursor-default"
                                      onSelect={(e) => e.preventDefault()}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="ios-card">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the menu item "{item.name}". This action cannot be
                                        undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        className="bg-ios-red text-white rounded-full"
                                        onClick={() => {
                                          setItemToDelete(item.id)
                                          handleDeleteItem()
                                        }}
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <h3 className="text-lg font-medium">No items found</h3>
                          <p className="text-ios-gray-1 mt-2">Try adjusting your filters or search query.</p>
                          <Button className="mt-4 rounded-full bg-ios-blue text-white" asChild>
                            <Link href="/admin/menu/new">
                              <Plus className="mr-2 h-4 w-4" />
                              Add New Item
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

