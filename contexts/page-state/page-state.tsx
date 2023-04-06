import { createContext } from "utils"
import { PageStateContextValue } from "./page-state.types"

export const [PageStateProvider, usePageState] =
  createContext<PageStateContextValue>({
    hookName: "usePageState",
    providerName: "PageStateProvider",
  })
