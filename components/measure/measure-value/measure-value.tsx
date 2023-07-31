import { useMeasure } from "../measure-context"
import { MeasureValueProps } from "./measure-value.types"

export default function MeasureValue({ children }: MeasureValueProps) {
  const [{ measures }] = useMeasure()

  return <>{children(measures)}</>
}
