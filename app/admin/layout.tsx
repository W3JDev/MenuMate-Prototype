"use client"

import type React from "react"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { VoiceChatAssistant } from "@/components/ai/voice-chat-assistant"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-ios-gray-6 dark:bg-black">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-[240px] bg-white/90 dark:bg-black/90 backdrop-blur-md">
          <AdminSidebar onNavigation={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:block w-64 shrink-0">
        <div className="fixed inset-y-0 z-30 w-64">
          <AdminSidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-white/90 dark:bg-black/90 backdrop-blur-md border-ios-gray-5/50 dark:border-white/10 px-4 sm:px-6">
          <Button variant="ghost" size="icon" className="md:hidden rounded-full" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="flex-1 flex items-center justify-between">
            <h1 className="text-lg font-semibold">
              {pathname === "/admin" && "Dashboard"}
              {pathname === "/admin/menu" && "Menu Management"}
              {pathname === "/admin/categories" && "Categories"}
              {pathname === "/admin/translations" && "Translations"}
              {pathname === "/admin/settings" && "Settings"}
              {pathname === "/admin/ai-settings" && "AI Settings"}
              {pathname === "/admin/users" && "User Management"}
              {pathname === "/admin/roles" && "Roles & Permissions"}
              {pathname.startsWith("/admin/menu/new") && "Add Menu Item"}
              {pathname.match(/^\/admin\/menu\/[^/]+$/) && "Edit Menu Item"}
            </h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>

      {/* Voice Chat Assistant */}
      <VoiceChatAssistant />
    </div>
  )
}

