import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-ios-blue text-white hover:bg-ios-blue/90 rounded-full",
        destructive: "bg-ios-red text-white hover:bg-ios-red/90 rounded-full",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-full",
        secondary: "bg-ios-gray-6 text-ios-blue hover:bg-ios-gray-5 rounded-full",
        ghost: "hover:bg-ios-gray-6 hover:text-ios-blue rounded-full",
        link: "text-ios-blue underline-offset-4 hover:underline",
        ios: "text-ios-blue hover:bg-ios-gray-6 rounded-full",
        "ios-filled": "bg-ios-blue text-white hover:bg-ios-blue/90 rounded-full",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-full px-4",
        lg: "h-11 rounded-full px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

