import { twMerge } from "tailwind-merge"
import { BreadcrumbItemProps } from "./breadcrumb.types"

export default function BreadcrumbItem({
  className,
  ...other
}: BreadcrumbItemProps) {
  return (
    <span
      {...other}
      className={twMerge(
        "font-medium text-sm px-2.5 py-1 transition-colors",
        className
      )}
    />
  )
}
