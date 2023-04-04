import Link from "next/link"
import { twMerge } from "tailwind-merge"
import { BreadcrumbLinkProps } from "./breadcrumb.types"

export default function BreadcrumbLink({
  href,
  className,
  ...props
}: BreadcrumbLinkProps) {
  return (
    <Link
      {...props}
      href={href}
      className={twMerge(
        "cursor-pointer focus-visible:outline-none focus-visible:border-b-2 focus-visible:border-red-500 focus-visible:border-opacity-50 dark:focus-visible:border-red-400",
        className
      )}
    />
  )
}
