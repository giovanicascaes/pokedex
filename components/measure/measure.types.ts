import { ReactNode } from "react"

export interface MeasureProps {
  children: ReactNode
}

export interface MeasureContextData {
  measures: DOMRect | null
}

export interface MeasureContextActions {
  onMeasuresChange: (measures: DOMRect) => void
}

export type MeasureContextValue = [MeasureContextData, MeasureContextActions]
