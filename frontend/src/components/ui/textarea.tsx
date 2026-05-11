import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg bg-card px-2.5 py-2 text-base placeholder:text-muted-foreground transition-all neo-border-sm focus-visible:outline-none focus-visible:-translate-x-[2px] focus-visible:-translate-y-[2px] focus-visible:shadow-[3px_3px_0px_0px_var(--neo-shadow-color)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
