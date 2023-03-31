import { useEffect, useState } from "react"

export default function useShouldAnimate(
  pokemonsHaveChanged: boolean = false,
  initial: boolean = true
) {
  const [animate, setAnimate] = useState(initial)

  useEffect(() => {
    if (pokemonsHaveChanged) {
      setAnimate(true)
    }
  }, [pokemonsHaveChanged])

  return animate
}
