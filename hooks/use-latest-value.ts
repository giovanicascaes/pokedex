import { useCallback, useRef } from "react"

export default function useLatestValue<T>(value: T) {
  const ref = useRef(value)

  ref.current = value

  return useCallback(() => ref.current, [])
}
