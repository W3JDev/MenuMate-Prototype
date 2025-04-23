import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

interface HeaderProps {
  title?: string
}

export function Header({ title = "MenuMate" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/60 border-b border-ios-gray-5/50 dark:border-white/10">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg md:text-xl">{title}</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium text-ios-gray-1 hover:text-ios-blue transition-colors">
              Home
            </Link>
            <Link href="/menu" className="text-sm font-medium text-ios-gray-1 hover:text-ios-blue transition-colors">
              Menu
            </Link>
            <Link
              href="/admin/menu"
              className="text-sm font-medium text-ios-gray-1 hover:text-ios-blue transition-colors"
            >
              Manage Menu
            </Link>
            <Link
              href="/admin/settings"
              className="text-sm font-medium text-ios-gray-1 hover:text-ios-blue transition-colors"
            >
              Settings
            </Link>
          </nav>

          <ThemeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0 bg-white/90 dark:bg-black/90 backdrop-blur-md">
              <div className="flex flex-col space-y-4 px-2">
                <Link
                  href="/"
                  className="flex items-center py-2 text-lg font-semibold text-ios-gray-1 hover:text-ios-blue transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/menu"
                  className="flex items-center py-2 text-lg font-semibold text-ios-gray-1 hover:text-ios-blue transition-colors"
                >
                  Menu
                </Link>
                <Link
                  href="/admin/menu"
                  className="flex items-center py-2 text-lg font-semibold text-ios-gray-1 hover:text-ios-blue transition-colors"
                >
                  Manage Menu
                </Link>
                <Link
                  href="/admin/settings"
                  className="flex items-center py-2 text-lg font-semibold text-ios-gray-1 hover:text-ios-blue transition-colors"
                >
                  Settings
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

