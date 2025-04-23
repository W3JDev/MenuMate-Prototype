"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

interface ActionButtonProps {
  icon: ReactNode
  title: string
  subtitle: string
  subtitleColor?: string
  className?: string
  onClick?: () => void
}

export function ActionButton({
  icon,
  title,
  subtitle,
  subtitleColor = "text-ios-gray-1",
  className,
  onClick,
}: ActionButtonProps) {
  const isMobile = useMobile()

  return (
    <button
      onClick={onClick}
      className={cn(
        "transition-all w-full",
        isMobile
          ? "ios-card shadow-ios hover:shadow-ios-lg transform hover:-translate-y-1 active:translate-y-0 active:shadow-ios"
          : "ios-card shadow-ios hover:shadow-ios-lg",
        className,
      )}
    >
      <div
        className={cn(
          "p-4 flex flex-col items-center text-center",
          !isMobile && "sm:flex-row sm:text-left sm:items-start",
        )}
      >
        <div className={cn("flex-shrink-0 mb-2", !isMobile && "sm:mb-0 sm:mr-4")}>{icon}</div>
        <div className={cn("flex flex-col items-center", !isMobile && "sm:items-start")}>
          <h3 className="font-medium text-base">{title}</h3>
          <p className={cn("text-sm", subtitleColor)}>{subtitle}</p>
        </div>
      </div>
    </button>
  )
}

