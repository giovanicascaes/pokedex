import { useResizeObserver } from "hooks"
import { useEffect } from "react"
import { useMeasure } from "../measure-context"
import { MeasureFromProps } from "./measure-from.types"

export default function MeasureFrom({ children }: MeasureFromProps) {
  const [measureRef, measureRect] = useResizeObserver()
  const [, { updateMeasures }] = useMeasure()

  useEffect(() => {
    if (measureRect) {
      updateMeasures(measureRect)
    }
  }, [measureRect, updateMeasures])

  return (
    <div ref={measureRef} className="invisible fixed -z-10">
      {children}
    </div>
  )
}
