import { useIsServerHydrationComplete } from "hooks"
import { useEffect, useState } from "react"
import { UseMediaOptions } from "./use-media.types"

export default function useMedia(
  query: string | string[],
  { fallback = [] }: UseMediaOptions = {}
): boolean[] {
  const queries = Array.isArray(query) ? query : [query]
  const isReady = useIsServerHydrationComplete()

  const [value, setValue] = useState(() => {
    const fallbackValues = Array.isArray(fallback) ? fallback : [fallback]

    return queries.map((query, index) => ({
      media: query,
      matches: isReady
        ? window.matchMedia(query).matches
        : !!fallbackValues[index],
    }))
  })

  useEffect(() => {
    setValue(
      queries.map((query) => ({
        media: query,
        matches: window.matchMedia(query).matches,
      }))
    )

    const mediaQueries = queries.map((query) => window.matchMedia(query))

    const handler = (evt: MediaQueryListEvent) => {
      setValue((current) =>
        current
          .slice()
          .map((item) =>
            item.media === evt.media ? { ...item, matches: evt.matches } : item
          )
      )
    }

    mediaQueries.forEach((mediaQuery) => {
      mediaQuery.addEventListener("change", handler)
    })

    return () => {
      mediaQueries.forEach((mediaQuery) => {
        mediaQuery.removeEventListener("change", handler)
      })
    }

    // No need to watch for `query` changes, as it is not likely to change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return value.map((item) => item.matches)
}
