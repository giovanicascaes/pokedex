import { createContext } from "utils"
import { SelectContextValue } from "./select.types"

export const [SelectProvider, useSelect] = createContext<SelectContextValue>({
  hookName: "useSelect",
  providerName: "SelectProvider",
})
