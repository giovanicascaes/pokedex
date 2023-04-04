import { twMerge } from "tailwind-merge"
import { BreadcrumbItemProps } from "./breadcrumb.types"

export default function BreadcrumbItem({
  disabled,
  className,
  ...other
}: BreadcrumbItemProps) {
  return (
    <span
      {...other}
      className={twMerge(
        "font-medium text-sm text-slate-500 dark:text-slate-300 rounded-full px-2.5 py-1 transition-colors",
        !disabled && "hover:text-black dark:hover:text-white",
        className
      )}
    />
  )
}
