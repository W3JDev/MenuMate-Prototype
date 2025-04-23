import Link from "next/link"
import { UtensilsCrossed } from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuButtonProps {
  href: string
  className?: string
}

export function MenuButton({ href, className }: MenuButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "ios-card shadow-ios hover:shadow-ios-lg transition-all p-4 flex items-center justify-center text-ios-blue hover:bg-ios-gray-6/50",
        className,
      )}
    >
      <div className="flex items-center justify-center">
        <UtensilsCrossed className="h-6 w-6 mr-3" />
        <span className="font-medium text-lg">View Our Menu</span>
        <svg className="h-5 w-5 ml-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  )
}

