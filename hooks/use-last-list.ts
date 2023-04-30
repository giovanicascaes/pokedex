import { usePage } from "contexts"

export default function useLastList() {
  const [{ history }] = usePage()

  const lastList = [...history]
    .reverse()
    .find((path) => path === "/" || path === "/pokedex")

  return lastList
}
