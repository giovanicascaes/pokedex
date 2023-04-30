import { createContext } from "utils"
import { ScrollControlContextValue } from "./scroll-control.types"

export const [ScrollControlProvider, useScrollControl] =
  createContext<ScrollControlContextValue>({
    hookName: "useScrollControl",
    providerName: "ScrollControlProvider",
  })
