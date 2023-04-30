import { forwardRef } from "react"
import { twMerge } from "tailwind-merge"
import { AppScrollProps } from "./app-scroll.types"

export default forwardRef<HTMLDivElement, AppScrollProps>(function AppScroll(
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
