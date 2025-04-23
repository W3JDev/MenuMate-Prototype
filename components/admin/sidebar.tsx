"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/auth-store"
import {
  LayoutDashboard,
  Store,
  MenuIcon,
  Globe,
  Settings,
  ChevronLeft,
  LogOut,
  Users,
  Bot,
  FileText,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
    icon: MenuIcon,
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

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => user?.role && item.roles.includes(user.role))

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "flex flex-col h-screen bg-[#0f172a] text-white transition-all duration-300",
          collapsed ? "w-16" : "w-64",
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex items-center h-16 px-4 border-b border-slate-700",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          {!collapsed && (
            <Link href="/admin" className="text-xl font-bold">
              MenuMate
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

              return collapsed ? (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-center h-10 w-10 rounded-md mx-auto my-2",
                        isActive ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center h-10 px-3 rounded-md",
                    isActive ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800",
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Profile */}
        <div className={cn("border-t border-slate-700 p-4", collapsed ? "text-center" : "")}>
          <div className={cn("flex items-center", collapsed ? "flex-col" : "space-x-3")}>
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt={user?.name || user?.email || ""} />
              <AvatarFallback>{user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name || "Restaurant Admin"}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email || "admin@menumate.com"}</p>
              </div>
            )}
          </div>

          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="mt-3 text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Log out</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="mt-3 w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

