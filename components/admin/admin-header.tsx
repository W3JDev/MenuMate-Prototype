"use client"

import { useRestaurantStore } from "@/store/restaurant-store"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, ExternalLink } from "lucide-react"
import Link from "next/link"

export function AdminHeader() {
  const { restaurant } = useRestaurantStore()
  const { user, logout } = useAuthStore()

  // Mock user data since we don't have real authentication
  const mockUser = {
    email: "admin@menumate.com",
  }

  return (
    <header className="sticky top-0 z-10 glass-card border-b h-16 md:h-20 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold hidden md:block">{restaurant?.name || "Restaurant Admin"}</h1>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="hidden md:flex gap-2" asChild>
          <Link href="/" target="_blank">
            <span>View Menu</span>
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.email || mockUser.email} />
                <AvatarFallback>{(user?.email || mockUser.email)?.charAt(0).toUpperCase() || "A"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.email || mockUser.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="text-red-500">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

