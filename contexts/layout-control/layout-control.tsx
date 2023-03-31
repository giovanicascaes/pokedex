import { useMemo, useState } from "react"
import { createContext } from "utils"
import {
  LayoutControlContextActions,
  LayoutControlContextData,
  LayoutControlContextValue,
  LayoutControlProviderProps,
} from "./layout-control.types"

const [Provider, useContext] = createContext<LayoutControlContextValue>({
  hookName: "useLayoutControl",
  providerName: "LayoutControlProvider",
})

export const useLayoutControl = useContext

export function LayoutControlProvider({
  children,
}: LayoutControlProviderProps) {
  const [isPageReady, setIsPageReady] = useState(true)

  const data: LayoutControlContextData = useMemo(
    () => ({
      isPageReady,
    }),
    [isPageReady]
  )

  const actions: LayoutControlContextActions = useMemo(
    () => ({
      setIsPageReady,
    }),
    []
  )

  return <Provider value={[data, actions]}>{children}</Provider>
}
