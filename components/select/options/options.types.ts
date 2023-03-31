import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react"
import { WithNonLegacyRef } from "types"

export interface SelectOptionsChildrenFnArgs {
  open: boolean
}

export interface SelectOptionsProps
  extends Omit<
    WithNonLegacyRef<
      DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
      HTMLUListElement
    >,
    "children"
  > {
  children: ReactNode | ((args: SelectOptionsChildrenFnArgs) => ReactNode)
}
