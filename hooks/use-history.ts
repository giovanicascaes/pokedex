import { Router, useRouter } from "next/router"
import { useEffect, useRef } from "react"

export default function useHistory() {
  const { pathname } = useRouter()
  const history = useRef<string[]>([])

  useEffect(() => {
    const change = () => {
      history.current.unshift(pathname)
    }

    Router.events.on("beforeHistoryChange", change)

    return () => {
      Router.events.off("beforeHistoryChange", change)
    }
  }, [pathname])

  return history.current
}
