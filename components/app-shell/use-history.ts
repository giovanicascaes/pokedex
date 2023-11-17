import { useRouter } from "next/router"
import { useState } from "react"
import useRouterEvent from "../../hooks/use-router-event"

export default function useHistory() {
  const { pathname } = useRouter()
  const [history, setHistory] = useState<string[]>([])

  useRouterEvent("routeChangeComplete", () => {
    setHistory((current) => [
      ...current.filter((path) => path !== pathname),
      pathname,
    ])
  })

  return history
}
