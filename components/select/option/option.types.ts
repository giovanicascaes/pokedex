import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react"

export interface SelectOptionChildrenFnArgs {
  disabled: boolean
  selected: boolean
  clicked: boolean
}

export interface SelectOptionProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement>,
    "children"
  > {
  children: ReactNode | ((args: SelectOptionChildrenFnArgs) => ReactNode)
  value: any
  disabled?: boolean
}
