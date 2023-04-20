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
      className={twMerge("cursor-pointer focus-highlight-b", className)}
    />
  )
}
