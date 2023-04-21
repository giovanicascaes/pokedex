import { Children, Fragment } from "react"
import { twMerge } from "tailwind-merge"
import BreadcrumbItem from "./breadcrumb-item"
import BreadcrumbLink from "./breadcrumb-link"
import { BreadcrumbProps } from "./breadcrumb.types"

function Breadcrumb({ children, className, ...other }: BreadcrumbProps) {
  const childrenAsArray = Children.toArray(children).filter(Boolean)
  const childrenCount = childrenAsArray.length

  return (
    <div
      {...other}
      className={twMerge("flex items-center space-x-1", className)}
    >
      {childrenAsArray.map((child, i) => (
        <Fragment key={i}>
          {child}
          {childrenCount > 1 && i !== childrenCount - 1 && (
            <span className="text-slate-300 dark:text-slate-500 font-semibold">
              /
            </span>
          )}
        </Fragment>
      ))}
    </div>
  )
}

export default Object.assign(Breadcrumb, {
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
})
