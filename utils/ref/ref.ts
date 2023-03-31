import { MutabletRef } from "./ref.types"

export function assignRef<T = any>(
  ref: MutabletRef<T> | null | undefined,
  value: T
) {
  if (ref === null || ref === undefined) return

  if (typeof ref === "function") {
    ref(value)
    return
  }

  try {
    ref.current = value
  } catch (error) {
    throw new Error(`Cannot assign value '${value}' to ref '${ref}'`)
  }
}

export function mergeRefs<T>(...refs: (MutabletRef<T> | null | undefined)[]) {
  return (node: T | null) => {
    refs.forEach((ref) => {
      assignRef(ref, node)
    })
  }
}
