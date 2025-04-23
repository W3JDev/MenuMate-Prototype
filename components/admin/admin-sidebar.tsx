"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/auth-store"
import { LayoutDashboard, Store, UtensilsCrossed, Globe, Settings, LogOut, Users, Bot, FileText } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["admin", "staff"],
  },
  {
    title: "Restaurant",
    href: "/admin/restaurant",
    icon: Store,
    roles: ["admin"],
  },
  {
    title: "Menu",
    href: "/admin/menu",
    icon: UtensilsCrossed,
    roles: ["admin", "staff"],
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: FileText,
    roles: ["admin", "staff"],
  },
  {
    title: "Translations",
    href: "/admin/translations",
    icon: Globe,
    roles: ["admin", "staff"],
  },
  {
    title: "AI Settings",
    href: "/admin/ai-settings",
    icon: Bot,
    roles: ["admin"],
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    roles: ["admin", "staff"],
  },
]

interface AdminSidebarProps {
  onNavigation?: () => void
}

export function AdminSidebar({ onNavigation }: AdminSidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => user?.role && item.roles.includes(user.role))

  // Mock user data since we don't have real authentication
  const mockUser = {
    email: "admin@menumate.com",
  }

  return (
    <div className="flex flex-col h-full bg-white/90 dark:bg-black/90 backdrop-blur-md border-r border-ios-gray-5/50 dark:border-white/10">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-ios-gray-5/50 dark:border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-bold text-lg">MenuMate</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigation}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium",
                  isActive ? "bg-ios-blue/10 text-ios-blue" : "text-ios-gray-1 hover:bg-ios-gray-6 hover:text-ios-blue",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* User Profile */}
      <div className="border-t border-ios-gray-5/50 dark:border-white/10 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg?height=36&width=36" alt={user?.name || user?.email || ""} />
            <AvatarFallback>{user?.name?.charAt(0) || user?.email?.charAt(0) || "A"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || "Restaurant Admin"}</p>
            <p className="text-xs text-ios-gray-1 truncate">{user?.email || mockUser.email}</p>
          </div>
        </div>

        <Button variant="ios" size="sm" onClick={logout} className="mt-3 w-full justify-start">
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </Button>
      </div>
    </div>
  )
}

