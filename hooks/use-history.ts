import { useRouter } from "next/router"
import { useState } from "react"
import useRouterEvent from "./use-router-event"

export default function useHistory() {
  const { pathname } = useRouter()
  const [history, setHistory] = useState<string[]>([])

  useRouterEvent("beforeHistoryChange", () => {
    setHistory((current) => [...current, pathname])
  })

  return history
}
