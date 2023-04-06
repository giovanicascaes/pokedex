import { DependencyList, EffectCallback } from "react"

export type UseIsoMorphicEffectFn = (
  effect: EffectCallback,
  deps?: DependencyList
) => void
