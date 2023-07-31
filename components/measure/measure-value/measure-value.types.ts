import { ReactNode } from "react"

export type MeasureValueChildrenFnArgs = DOMRect | null

export interface MeasureValueProps {
  children: (args: MeasureValueChildrenFnArgs) => ReactNode
}
