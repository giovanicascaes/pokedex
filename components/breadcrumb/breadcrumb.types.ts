import { LinkProps } from "next/link"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { WithNonLegacyRef } from "types"

export type BreadcrumbElement = HTMLElement

export type BreadcrumbProps = DetailedHTMLProps<
  HTMLAttributes<BreadcrumbElement>,
  BreadcrumbElement
>

export type BreadcrumbItemProps = DetailedHTMLProps<
  HTMLAttributes<HTMLOListElement>,
  HTMLOListElement
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
