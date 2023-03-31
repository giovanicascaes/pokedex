import { LinkProps } from "next/link"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { WithNonLegacyRef } from "types"

export type BreadcrumbProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>

export interface BreadcrumbItemProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  disabled?: boolean
}

export type BreadcrumbLinkProps = LinkProps &
  Omit<
    WithNonLegacyRef<
      DetailedHTMLProps<HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
      HTMLAnchorElement
    >,
    "onClick" | "onMouseEnter" | "onTouchStart"
  >
