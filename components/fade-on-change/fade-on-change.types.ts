import { DetailedHTMLProps, HTMLAttributes, ReactNode, Ref } from "react"

export interface FadeOnChangeProps<T>
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    "ref" | "children"
  > {
  children: ReactNode | ((key: T) => ReactNode)
  ref?: Ref<HTMLDivElement>
  watchChangesOn: T
  transitionDuration?: number
}
