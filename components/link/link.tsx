import NextLink from "next/link"
import { twMerge } from "tailwind-merge"
import { LinkProps } from "./link.types"

export default function Link({ disabled, className, ...other }: LinkProps) {
  return (
    <NextLink
      {...other}
      className={twMerge(
        "text-sm font-medium focus-highlight-b",
        disabled
          ? "text-slate-500 dark:text-slate-300 cursor-default"
          : "text-red-500 dark:text-red-400 hover:text-black dark:hover:text-white",
        className
      )}
    />
  )
}
