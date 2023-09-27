import { RefCallback } from "react"

export interface MeasureFromProps {
  children: (ref: RefCallback<Element>) => JSX.Element
}
