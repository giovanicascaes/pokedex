import { useHistory } from "hooks"
import { useCallback, useState } from "react"
import { createContext } from "utils"
import {
  PageBreadcrumbItem,
  PageContextActions,
  PageContextData,
  PageContextValue,
  PageProviderProps,
} from "./page.types"

const [Provider, useContext] = createContext<PageContextValue>({
  hookName: "usePage",
  providerName: "PageProvider",
})

export const usePage = useContext

export function PageProvider({ children }: PageProviderProps) {
  const [breadcrumb, setBreadcrumb] = useState<PageBreadcrumbItem[]>([])
  const history = useHistory()

  const data: PageContextData = {
    breadcrumb,
    history,
  }

  const setUpBreadcrumb = useCallback((breadcrumb: PageBreadcrumbItem[]) => {
    setBreadcrumb(breadcrumb)

    return () => {
      setBreadcrumb([])
    }
  }, [])

  const actions: PageContextActions = {
    setUpBreadcrumb,
  }

  return <Provider value={[data, actions]}>{children}</Provider>
}
