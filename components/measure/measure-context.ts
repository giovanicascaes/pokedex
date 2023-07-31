import { createContext } from "utils"
import { MeasureContextValue } from "./measure.types"

export const [MeasureProvider, useMeasure] = createContext<MeasureContextValue>(
  {
    hookName: "useMeasure",
    providerName: "MeasureProvider",
  }
)
