import { UseIntersectionObserverArgs } from "hooks"
import { ReactElement } from "react"

export interface IntersectionObserverProps extends UseIntersectionObserverArgs {
  children: ReactElement
  onIntersectionChange?: (isIntersecting: boolean) => void
}
