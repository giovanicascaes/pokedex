import { DetailedHTMLProps, HTMLAttributes, ReactNode, Ref } from "react"

export type TransitionElement = HTMLDivElement

export interface TransitionProps<T>
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<TransitionElement>, TransitionElement>,
    "ref" | "children"
  > {
  children: ReactNode | ((key: T) => ReactNode)
  ref?: Ref<TransitionElement>
  watch: T
  transitionDuration?: number
}
