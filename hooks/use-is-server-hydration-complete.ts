import { useEffect, useState } from "react"
import { env } from "utils"

export default function useIsServerHydrationComplete() {
  const [isComplete, setIsComplete] = useState(env.isHydrationComplete)

  useEffect(() => {
    env.completeHydration()
  }, [])

  useEffect(() => {
    if (!isComplete) {
      setIsComplete(true)
    }
  }, [isComplete])

  return isComplete
}
