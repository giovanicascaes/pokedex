import { useLatestValue, useRouterEvent } from "hooks"
import { useRouter } from "next/router"
import { useRef } from "react"

export default function usePreviousScroll(currentScrollTop: number) {
  const previousScrollTopRef = useRef<Partial<Record<string, number>>>({})
  const { pathname: currentPath } = useRouter()
  const getCurrentScrollTop = useLatestValue(currentScrollTop)

  useRouterEvent("routeChangeStart", () => {
    previousScrollTopRef.current[currentPath] = getCurrentScrollTop()
  })

  return previousScrollTopRef.current[currentPath] ?? 0
}
