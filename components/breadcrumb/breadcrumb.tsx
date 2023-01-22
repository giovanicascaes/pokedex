import Link from "next/link";
import { Children, Fragment } from "react";
import { twMerge } from "tailwind-merge";
import {
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbProps,
} from "./breadcrumb.types";

function BreadcrumbLink({ href, className, ...props }: BreadcrumbLinkProps) {
  return (
    <Link
      {...props}
      href={href}
      className={twMerge(
        "cursor-pointer focus-visible:outline-none focus-visible:border-b-2 focus-visible:border-red-500 focus-visible:border-opacity-50 dark:focus-visible:border-red-400",
        className
      )}
    />
  );
}

function BreadcrumbItem({
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
  );
}

function Breadcrumb({ children, className, ...other }: BreadcrumbProps) {
  const childrenAsArray = Children.toArray(children).filter(Boolean);
  const childrenCount = childrenAsArray.length;

  return (
    <div {...other} className={twMerge("space-x-1", className)}>
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
  );
}

export default Object.assign(Breadcrumb, {
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
});
