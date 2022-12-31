import { createContext, useContext } from "react";
import { SelectContextValue } from "./context.types";

export const SelectContext = createContext<SelectContextValue | null>(null);

export function useSelect() {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error(
      "useContext: `SelectContext` is undefined. Seems you forgot to wrap component within the `SelectContext.Provider` component"
    );
  }

  return context;
}
