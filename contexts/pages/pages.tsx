import { createContext } from "utils"
import { PagesContextValue } from "./pages.types"

export const [PagesProvider, usePages] = createContext<PagesContextValue>({
  hookName: "usePages",
  providerName: "PagesProvider",
})
