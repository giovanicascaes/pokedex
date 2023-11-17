import { createContext } from "utils"
import { PageContextValue } from "./page.types"

export const [PageProvider, usePage] = createContext<PageContextValue>({
  hookName: "usePage",
  providerName: "PageProvider",
})
