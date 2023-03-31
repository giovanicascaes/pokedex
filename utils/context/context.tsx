import { createContext as createReactContext, useContext } from "react"
import {
  CreateContextOptions,
  CreateContextProviderProps,
  CreateContextReturn,
} from "./context.types"

export function createContext<T>({
  providerName = "Provider",
  hookName = "useProvider",
  initialValue,
  required = true,
}: CreateContextOptions<T> = {}): CreateContextReturn<T> {
  const Context = createReactContext<T>(initialValue as T)

  function Provider({ value, children }: CreateContextProviderProps<T>) {
    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  function useProvider() {
    const context = useContext(Context)

    if (!context && required) {
      throw new Error(
        `\`${hookName}\` must be used within a \`${providerName}\``
      )
    }

    return context
  }

  return [Provider, useProvider, Context] as const
}
