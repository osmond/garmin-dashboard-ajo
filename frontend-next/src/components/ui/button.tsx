import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-[var(--ring)] focus-visible:ring-[3px] focus-visible:ring-[color:var(--ring)/.5] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-[var(--destructive)] aria-invalid:ring-[color:var(--destructive)/.2] dark:aria-invalid:ring-[color:var(--destructive)/.4] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs hover:bg-[color:var(--primary)/.9]",
        destructive:
          "bg-[var(--destructive)] text-white shadow-xs hover:bg-[color:var(--destructive)/.9] focus-visible:ring-[color:var(--destructive)/.2] dark:bg-[color:var(--destructive)/.6] dark:focus-visible:ring-[color:var(--destructive)/.4]",
        outline:
          "border bg-[var(--background)] shadow-xs hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] dark:border-[var(--input)] dark:bg-[color:var(--input)/.3] dark:hover:bg-[color:var(--input)/.5]",
        secondary:
          "bg-[var(--secondary)] text-[var(--secondary-foreground)] shadow-xs hover:bg-[color:var(--secondary)/.8]",
        ghost:
          "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] dark:hover:bg-[color:var(--accent)/.5]",
        link: "text-[var(--primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
