"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, UtensilsCrossed, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNavigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav className="ios-nav md:hidden">
      <Link href="/" className={cn("ios-tab w-full h-full", isActive("/") ? "text-ios-blue" : "text-ios-gray-1")}>
        <Home className="h-6 w-6" />
        <span>Home</span>
      </Link>

      <Link
        href="/menu"
        className={cn("ios-tab w-full h-full", isActive("/menu") ? "text-ios-blue" : "text-ios-gray-1")}
      >
        <UtensilsCrossed className="h-6 w-6" />
        <span>Menu</span>
      </Link>

      <Link
        href="/admin/menu"
        className={cn("ios-tab w-full h-full", isActive("/admin/menu") ? "text-ios-blue" : "text-ios-gray-1")}
      >
        <Settings className="h-6 w-6" />
        <span>Manage</span>
      </Link>

      <Link
        href="/admin/settings"
        className={cn("ios-tab w-full h-full", isActive("/admin/settings") ? "text-ios-blue" : "text-ios-gray-1")}
      >
        <User className="h-6 w-6" />
        <span>Profile</span>
      </Link>
    </nav>
  )
}

