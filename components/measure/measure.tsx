import { useMemo, useState } from "react"
import { MeasureProvider } from "./measure-context"
import { MeasureFrom } from "./measure-from"
import { MeasureValue } from "./measure-value"
import {
  MeasureContextActions,
  MeasureContextData,
  MeasureProps,
} from "./measure.types"

function Measure({ children }: MeasureProps) {
  const [measures, setMeasures] = useState<DOMRect | null>(null)

  const data: MeasureContextData = useMemo(
    () => ({
      measures,
    }),
    [measures]
  )

  const actions: MeasureContextActions = useMemo(
    () => ({
      updateMeasures(measures: DOMRect) {
        setMeasures(measures)
      },
    }),
    []
  )

  return <MeasureProvider value={[data, actions]}>{children}</MeasureProvider>
}

export default Object.assign(Measure, {
  From: MeasureFrom,
  Value: MeasureValue,
})
