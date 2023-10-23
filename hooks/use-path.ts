import { usePage } from "contexts"
import { useRouter } from "next/router"
import { useMemo } from "react"

export default function usePath() {
  const router = useRouter()
  const [{ history }] = usePage()

  return useMemo(() => {
    const path = router.asPath.split("/").filter(Boolean)
    const [prevPath] = history.slice(-2)

    if (router.pathname !== "/pokemon/[key]" || prevPath !== "/pokedex") {
      return path
    }

    const [, pokemon] = path

    return [prevPath.replace("/", ""), pokemon]
  }, [history, router.asPath, router.pathname])
}
