import { forwardRef } from "react"
import { twMerge } from "tailwind-merge"
import { AppScrollElement, AppScrollProps } from "./app-scroll.types"

export default forwardRef<AppScrollElement, AppScrollProps>(function AppScroll(
  { children, className, ...other },
  ref
) {
  return (
    <div
      {...other}
      className={twMerge("flex flex-col h-full overflow-auto", className)}
      ref={ref}
    >
      {children}
    </div>
  )
})
