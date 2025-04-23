"use client"

import { useMenuStore } from "@/store/menu-store"
import type { Language } from "@/types"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "zh", name: "中文" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "ms", name: "Bahasa Melayu" },
  { code: "my", name: "မြန်မာဘာသာ" },
  { code: "ta", name: "தமிழ்" },
]

export function LanguageSelector() {
  const { currentLanguage, setLanguage } = useMenuStore()

  const currentLanguageName = LANGUAGES.find((lang) => lang.code === currentLanguage)?.name || "English"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ios" size="sm" className="h-9 gap-1 rounded-full">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguageName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-xl border border-ios-gray-5/50 dark:border-white/10"
      >
        {LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setLanguage(language.code as Language)}
            className="focus:bg-ios-gray-6 focus:text-ios-blue rounded-lg my-0.5 cursor-default"
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

