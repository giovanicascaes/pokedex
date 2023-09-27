import { useIsoMorphicEffect, useResizeObserver } from "hooks"
import { useState } from "react"
import { useMeasure } from "../measure-context"
import { MeasureFromProps } from "./measure-from.types"

export default function MeasureFrom({ children }: MeasureFromProps) {
  const [measureRef, measureRect] = useResizeObserver()
  const [, { onMeasuresChange }] = useMeasure()

  useIsoMorphicEffect(() => {
    if (measureRect) {
      onMeasuresChange(measureRect)
    }
  }, [measureRect, onMeasuresChange])

  return children(measureRef)
}
