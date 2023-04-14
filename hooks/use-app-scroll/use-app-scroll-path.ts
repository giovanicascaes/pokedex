import { useRouter } from "next/router"
import { useCallback, useRef } from "react"

export default function useAppScrollPath() {
  const scrollTopRef = useRef<{ [k: string]: number }>({})
  const { pathname: currentPath } = useRouter()

  const setScrollTop = useCallback(
    (scrollTop: number) => {
      scrollTopRef.current[currentPath] = scrollTop
    },
    [currentPath]
  )

  return [scrollTopRef.current[currentPath] ?? 0, setScrollTop] as const
}
