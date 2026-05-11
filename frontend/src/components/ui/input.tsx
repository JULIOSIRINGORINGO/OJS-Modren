import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg bg-card px-2.5 py-1 text-base placeholder:text-muted-foreground transition-all neo-border-sm focus-visible:outline-none focus-visible:-translate-x-[2px] focus-visible:-translate-y-[2px] focus-visible:shadow-[3px_3px_0px_0px_var(--neo-shadow-color)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
