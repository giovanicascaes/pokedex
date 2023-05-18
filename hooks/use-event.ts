import { useCallback } from "react"
import useLatestValue from "./use-latest-value"

export default function useEvent<
  F extends (...args: any[]) => any,
  P extends any[] = Parameters<F>,
  R = ReturnType<F>
>(cb?: (...args: P) => R) {
  const getLatestCb = useLatestValue(cb)

  return useCallback(
    (...args: P) => {
      const cb = getLatestCb()

      return cb?.(...args)
    },
    [getLatestCb]
  )
}
