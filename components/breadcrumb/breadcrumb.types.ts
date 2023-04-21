import { LinkProps } from "next/link"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { WithNonLegacyRef } from "types"

export type BreadcrumbElement = HTMLDivElement

export type BreadcrumbProps = DetailedHTMLProps<
  HTMLAttributes<BreadcrumbElement>,
  BreadcrumbElement
>

export type BreadcrumbItemProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
>

export interface BreadcrumbLinkProps
  extends LinkProps,
    Omit<
      WithNonLegacyRef<
        DetailedHTMLProps<HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
        HTMLAnchorElement
      >,
      "onClick" | "onMouseEnter" | "onTouchStart"
    > {
  disabled?: boolean
}
