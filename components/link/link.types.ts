import { LinkProps as NextLinkProps } from "next/link"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { WithNonLegacyRef } from "types"

export interface LinkProps
  extends NextLinkProps,
    WithNonLegacyRef<
      DetailedHTMLProps<HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
      HTMLAnchorElement
    > {
  disabled?: boolean
}
